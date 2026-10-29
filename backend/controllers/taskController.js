import mongoose from "mongoose";
import Task from "../models/Task.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createTask = async (req, res) => {
  try {
    const { title, project } = req.body;

    if (!title || !project) {
      return res.status(400).json({ message: "Title and project are required" });
    }

    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Optional: ?project=<id>&status=todo&priority=high&assignedTo=<employeeId>
export const getTasks = async (req, res) => {
  try {
    const { project, status, priority, assignedTo } = req.query;
    const filter = {};

    if (project) filter.project = project;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter)
      .populate("project", "name")
      .populate("assignedTo", "name role")
      .sort({ dueDate: 1, createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findById(req.params.id)
      .populate("project", "name")
      .populate("assignedTo", "name role");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    // A finished task always has 100% progress
    if (req.body.status === "done") {
      req.body.progress = 100;
    }

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};