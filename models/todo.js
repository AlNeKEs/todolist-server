const mongoose = require("mongoose");

const schema  = mongoose.Schema;

const todoSchema = new schema({
    todoName: {
        type: String,
        require: true
    },
    todoDiscription: {
        type: String,
    },
    status:{
        type: String,
    },
    createAt: {
        type: Date
    },
    deadline: {
        type: String
    },
    createBy: {
        type: schema.Types.ObjectId,
        ref: 'user'
    }
})

module.exports = mongoose.model("todolist", todoSchema);