import mongoose from "mongoose";
import Service from "../models/Service.js";
import WebsiteProject from "../models/WebsiteProject.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Builds create, list, get, update and delete handlers for any model
const buildCrud = (Model, label, sortBy) => ({
  create: async (req, res) => {
    try {
      const doc = await Model.create(req.body);
      res.status(201).json(doc);
    } catch (error) {
      const status = error.name === "ValidationError" ? 400 : 500;
      res.status(status).json({ message: error.message });
    }
  },

  list: async (req, res) => {
    try {
      const docs = await Model.find().sort(sortBy);
      res.json(docs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getOne: async (req, res) => {
    try {
      if (!isValidId(req.params.id)) {
        return res.status(400).json({ message: `Invalid ${label} id` });
      }

      const doc = await Model.findById(req.params.id);
      if (!doc) {
        return res.status(404).json({ message: `${label} not found` });
      }

      res.json(doc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      if (!isValidId(req.params.id)) {
        return res.status(400).json({ message: `Invalid ${label} id` });
      }

      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!doc) {
        return res.status(404).json({ message: `${label} not found` });
      }

      res.json(doc);
    } catch (error) {
      const status = error.name === "ValidationError" ? 400 : 500;
      res.status(status).json({ message: error.message });
    }
  },

  remove: async (req, res) => {
    try {
      if (!isValidId(req.params.id)) {
        return res.status(400).json({ message: `Invalid ${label} id` });
      }

      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) {
        return res.status(404).json({ message: `${label} not found` });
      }

      res.json({ message: `${label} deleted successfully` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
});

// Admin handlers
export const serviceHandlers = buildCrud(Service, "Service", { sortOrder: 1, createdAt: -1 });
export const projectHandlers = buildCrud(WebsiteProject, "Project", { createdAt: -1 });

// Public handlers (only active items are visible)
export const getPublicServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({
      sortOrder: 1,
      createdAt: -1,
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Optional: ?category=residential&featured=true&status=completed
export const getPublicProjects = async (req, res) => {
  try {
    const { category, featured, status } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (featured === "true") filter.isFeatured = true;

    const projects = await WebsiteProject.find(filter).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublicProjectById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    const project = await WebsiteProject.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
