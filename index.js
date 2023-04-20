require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const user = require("./router/user.js");
const todolist = require("./router/todolists.js");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@cluster0.eocxoud.mongodb.net/todolist?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("connected");
  } catch (e) {
    console.log(e);
  }
};
connectDB();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/user", user);
app.use("/api/todolist", todolist);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server start on port ${PORT}`));
