const express = require("express");
const router = express.Router();

const verifyToken = require("../midleware/auth");
const todo = require("../models/todo");

// create todo
// Private
router.post("/create", verifyToken, async (req, res) => {
  const { title, discription, deadline } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: "missing title" });
  }
  try {
    const newTodo = new todo({
      todoName: title,
      todoDiscription: discription,
      status: "todo",
      createAt: new Date(),
      deadline: deadline,
      createBy: req.userId,
    });
    const saveTodo = await newTodo.save();
    if (saveTodo) {
      return res.status(200).json({ success: true, message: "successful" });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

// update todo
//private
router.put("/update", verifyToken, async (req, res) => {
  const { title, discription, deadline, id } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: "missing title" });
  }
  try {
    const updateData = {
      todoName: title,
      todoDiscription: discription,
      deadline: deadline,
    };
    const updateStatus = await todo.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return res.json({
      success: true,
      message: "update successful",
      updateStatus,
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

// get all todo
// private
router.get("/getAll", verifyToken, async (req, res) => {
  try {
    const allData = await todo.find({ createBy: req.userId });
    return res.status(200).json({ success: true, allData });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

// get detail 1 todo item
// private
router.get("/detail/:id", verifyToken, async (req, res) => {
  try {
    const detail = await todo.find({
      $and: [{ _id: req.params.id }, { createBy: req.userId }],
    });
    return res.status(200).json({success: true, detail});
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

// delete todo
// private
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const delStatus = await todo.findByIdAndDelete(req.params.id);
    return res
      .status(201)
      .json({ success: true, message: "delete successful" });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
