const express = require("express");
const cors = require("cors");
const connection = require("./config/db");
const userRouter = require("./routes/user.route");
const empRouter = require("./routes/emp.route");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use(cors());

// to go to user route
app.use("/user", userRouter);

// to go to employee route
app.use("/emp", empRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
  } catch (err) {
    console.log("error in connecting mongoDB", err);
  }
  console.log(`server listening on port ${process.env.PORT}`);
});
