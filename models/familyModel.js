const pool = require("../db");
const db = require("../db");

class FamilyModel {
  static async fetchAll() {
    const result = await db.query(`
  SELECT 
    f.family_id,
    f.house_status_id,
    f.region,
    fh.first_name AS head_first_name,
    fh.last_name AS head_last_name,
    fh.national_code AS head_national_code,
    fh.job AS head_job,
    COUNT(fm.family_member_id) AS members_count
FROM families f
LEFT JOIN family_head fh ON fh.family_id = f.family_id
LEFT JOIN family_members fm ON fm.family_id = f.family_id
GROUP BY 
    f.family_id, 
    f.house_status_id, 
    f.region, 
    fh.first_name, 
    fh.last_name, 
    fh.national_code, 
    fh.job;
`);

    return result.rows;
  }

  static async insert(family, family_head, family_members) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const familyResult = await client.query(
        `INSERT INTO families
      (insurance_type_id, house_status_id, address, phone, region, support_orgs_id, employment_fields_id) 
      VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING family_id`,
        [
          family.insurance_type_id,
          family.house_status_id,
          family.address,
          family.phone,
          family.region,
          family.support_orgs_id,
          family.employment_fields_id,
        ]
      );

      const familyId = familyResult?.rows[0]?.family_id;
      // ------------------------------------------------------------------------
      await client.query(
        `INSERT INTO family_head 
        (family_id, first_name, last_name, father_name, national_code, birth_date, phone, gender,wifes_name,bank_account,job)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [
          familyId,
          family_head.first_name,
          family_head.last_name,
          family_head.father_name,
          family_head.national_code,
          family_head.birth_date,
          family_head.phone,
          family_head.gender,
          family_head.wifes_name,
          family_head.bank_account,
          family_head.job,
        ]
      );
      // ------------------------------------------------------------------------
      for (const mem of family_members) {
        await client.query(
          `INSERT INTO family_members
         (family_id, first_name, last_name, father_name, gender, national_code, birth_date)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [
            familyId,
            mem.first_name,
            mem.last_name,
            mem.father_name,
            mem.gender,
            mem.national_code,
            mem.birth_date,
          ]
        );
      }

      await client.query("COMMIT");

      return familyId;
    } catch (error) {
      await client.query("ROLLBACK");
    } finally {
      client.release();
    }
  }
}

module.exports = FamilyModel;
