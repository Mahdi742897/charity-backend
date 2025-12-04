const express = require("express");
const app = express();
const cors = require("cors");
const familyRouter = require("./routes/familyRouter");

app.use(express.json());
app.use(cors());

app.use("/api/families", familyRouter);

app.listen(5000, () => {
  console.log("the server is running on port 5000");
});
