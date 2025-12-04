const FamilyModel = require("../models/familyModel");

async function getFamilies(req, res) {
  let families;

  try {
    families = await FamilyModel.fetchAll();
    res.status(200).json({ success: true, list: families });
  } catch (error) {
    console.log(error);

    res.status(500).json({ success: false, error: error });
  }
}

const createFullFamily = async (req, res) => {
  const { family, family_head, family_members } = req.body;

  if (!family) {
    res
      .status(400)
      .json({ success: false, error: "لطفا اطلاعات خانواده را وارد کنید" });
  }
  if (!family_head) {
    res
      .status(400)
      .json({ success: false, error: "لطفا اطلاعات سرپرست را وارد کنید" });
  }
  if (family_members?.length === 0) {
    res
      .status(400)
      .json({ success: false, error: " لطفا اعضای خانواده را وارد کنید" });
  }

  try {
    const familyId = await FamilyModel.insert(
      family,
      family_head,
      family_members
    );

    res
      .status(201)
      .json({ success: true, msg: "خانواده با موفقیت ثبت شد", familyId });
  } catch (error) {
    res.status(500).json({ success: true, msg: "خانواده ثبت نشد" });
  }
};

module.exports = { getFamilies, createFullFamily };
