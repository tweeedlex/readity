const express = require("express");
const cors = require("cors");
const sequelize = require("./db")
require("dotenv").config();
const router = require("./router")

const app = express();
app.use(express.json());
app.use(cors());
app.use("/", router)

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  try {
    await sequelize.authenticate()  
    await sequelize.sync()
    console.log(`Server started on port ${port}`);
  } catch (e) {
    console.log(e);
  }
});
