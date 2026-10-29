import mongoose from "mongoose";
import Project from "../models/Project.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create a new project
export const createProject = async (req, res) => {
  try {
    const { name, client, location, budget } = req.body;

    if (!name || !client || !location || budget === undefined) {
      return res
        .status(400)
        .json({ message: "Name, client, location and budget are required" });
    }

    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all projects (optional filters: ?status=in-progress&search=tower)
export const getProjects = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (search) filter.name = { $regex: search, $options: "i" };

    //   const projects = await Project.find(filter).sort({ createdAt: -1 });
    const projects = await Project.find(filter)
      .populate("client", "name phone")
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single project
export const getProjectById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    // const project = await Project.findById(req.params.id);
        const project = await Project.findById(req.params.id).populate(
      "client",
      "name phone email"
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a project (also used for status change)
export const updateProject = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a project
export const deleteProject = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
