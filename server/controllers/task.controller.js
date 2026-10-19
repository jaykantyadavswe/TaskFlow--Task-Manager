import mongoose from "mongoose";

import Task from "../models/Task.js";

const taskCategories = ["General", "Work", "Personal", "Study", "Health", "Shopping", "Other"];

// GET /api/tasks
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });

        res.status(200).json(
            { success: true, data: tasks }
        );
    } catch (error) {
        res.status(500).json({ 
            success: false, message: "Error retrieving tasks", error 
        });
    }
};

// GET /api/tasks/:id
export const getTaskById = async (req, res) => {
    try {
        if(!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ 
                success: false, message: "Invalid task ID" 
            });
        }

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ 
                success: false, message: "Task not found" 
            });
        }

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ 
            success: false, message: "Error retrieving task", error 
        });
    }
};

// POST /api/tasks
export const createTask = async (req, res) => {
    try {
        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
            return res.status(400).json({
                success: false, message: "Task data must be a JSON object"
            });
        }

        const { title, description, priority, category, dueDate, dueTime = "" } = req.body;

        if (typeof title !== 'string' || !title.trim()){
            return res.status(400).json({ 
                success: false, message: "A task title is required"
            });
        }

        if ((description !== undefined && typeof description !== 'string')
            || (category !== undefined && typeof category !== 'string')) {
            return res.status(400).json({
                success: false, message: "Description and category must be strings"
            });
        }

        if (category !== undefined && !taskCategories.includes(category)) {
            return res.status(400).json({
                success: false, message: "Choose a valid task category"
            });
        }

        if (typeof dueTime !== 'string' || (dueTime !== '' && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(dueTime))) {
            return res.status(400).json({
                success: false, message: "Due time must use HH:mm format"
            });
        }

        const task = await Task.create({
            title: title.trim(),
            description: description?.trim() ?? "",
            priority: priority,
            category: category,
            dueDate: dueDate || null,
            dueTime: dueDate ? dueTime : "",
        });

        res.status(201).json({ success: true, data: task });
    } catch (error) {
        if(error.name === 'ValidationError' || error.name === 'CastError') {  
            return res.status(400).json({ 
                success: false, message: "Invalid task data", error 
            });
        }

        res.status(500).json({ 
            success: false, message: "Failed to create task", error 
        });
    }
};

// PATCH /api/tasks/:id
export const updateTask = async (req, res) => {
    try {
        if(!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ 
                success: false, message: "Invalid task ID" 
            });
        }

        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
            return res.status(400).json({
                success: false, message: "Task data must be a JSON object"
            });
        }

        const allowedFields = ['title', 'description', 'status', 'priority', 'category', 'dueDate', 'dueTime'];
        const updateData = {};

        for (const field of allowedFields) {
            if (Object.hasOwn(req.body, field)) {
                updateData[field] = req.body[field];
            }
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false, message: "No valid task fields were provided"
            });
        }

        if(Object.hasOwn(updateData, 'title') && (typeof updateData.title !== 'string' || !updateData.title.trim())) {
            return res.status(400).json({ 
                success: false, message: "A task title is required" 
            });
        }

        if ((Object.hasOwn(updateData, 'description') && typeof updateData.description !== 'string')
            || (Object.hasOwn(updateData, 'category') && typeof updateData.category !== 'string')) {
            return res.status(400).json({
                success: false, message: "Description and category must be strings"
            });
        }

        if (Object.hasOwn(updateData, 'category') && !taskCategories.includes(updateData.category)) {
            return res.status(400).json({
                success: false, message: "Choose a valid task category"
            });
        }

        if (Object.hasOwn(updateData, 'dueTime')
            && (typeof updateData.dueTime !== 'string'
                || (updateData.dueTime !== '' && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(updateData.dueTime)))) {
            return res.status(400).json({
                success: false, message: "Due time must use HH:mm format"
            });
        }

        if(typeof updateData.title === 'string') {
            updateData.title = updateData.title.trim();
        }

        if(Object.hasOwn(updateData, 'description') && typeof updateData.description === 'string') {
            updateData.description = updateData.description.trim();
        }

        if(Object.hasOwn(updateData, 'dueDate') && updateData.dueDate === '') {
            updateData.dueDate = null;
        }

        if (Object.hasOwn(updateData, 'dueDate') && !updateData.dueDate) {
            updateData.dueTime = "";
        }

        const task = await Task.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

        if (!task) {
            return res.status(404).json({ 
                success: false, message: "Task not found" 
            });
        }

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        if(error.name === 'ValidationError' || error.name === 'CastError') {  
            return res.status(400).json({ 
                success: false, message: "Invalid task data", error 
            });
        }

        res.status(500).json({ 
            success: false, message: "Failed to update task", error 
        });
    }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
    try {
        if(!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ 
                success: false, message: "Invalid task ID" 
            });
        }
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({ 
                success: false, message: "Task not found" 
            });
        }

        res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ 
            success: false, message: "Failed to delete task", error 
        });
    }
};
