import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        maxLength: 120,
        required: [true, "Task title is required"],
    },
    description: {
        type: String,
        default: "",
        maxLength: 1000,
    },
    status: {
        type: String,
        enum: ["pending", "active", "completed"],
        default: "pending",
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
    },
    category: {
        type: String,
        enum: ["General", "Work", "Personal", "Study", "Health", "Shopping", "Other"],
        default: "General",
        trim: true,
    },
    dueDate: {
        type: Date,
        default: null,
    },
    dueTime: {
        type: String,
        default: "",
        match: [/^$|^(?:[01]\d|2[0-3]):[0-5]\d$/, "Due time must use HH:mm format"],
    },
},
    {
        timestamps: true,
        versionKey: false,
    });

const Task = mongoose.model("Task", taskSchema);

export default Task;