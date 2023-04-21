const express = require("express");
const router = express.Router();

const verifyToken = require("../midleware/auth");
const todo = require("../models/todo");

// create todo
// Private
router.post("/create", verifyToken, async (req, res) => {
  const { title, discription } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: "missing title" });
  }
  try {
    const newTodo = new todo({
      todoName: title,
      todoDiscription: discription,
      status: false,
      createAt: new Date(),
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
  const { id, status } = req.body;
  try {
    const updateData = {
      status: status,
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

//  search item
// private
router.post("/search", verifyToken, async (req, res) => {
  const { searchValue } = req.body;
  try {
    if (searchValue === "All") {
      const searchData = await todo.find({ createBy: req.userId });
      return res.status(200).json({ success: true, searchData });
    }
    if (searchValue === "Done") {
      const searchData = await todo.find({
        $and: [{ status: true, createBy: req.userId }],
      });
      return res.status(200).json({ success: true, searchData });
    }
    if (searchValue === "Notdone") {
      const searchData = await todo.find({
        $and: [{ status: false, createBy: req.userId }],
      });
      return res.status(200).json({ success: true, searchData });
    }
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
