import mongoose from "mongoose";
import Employee from "../models/Employee.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createEmployee = async (req, res) => {
  try {
    const { name, phone, dailyWage } = req.body;

    if (!name || !phone || dailyWage === undefined) {
      return res
        .status(400)
        .json({ message: "Name, phone and daily wage are required" });
    }

    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Optional filters: ?role=mason&status=active&project=<projectId>&search=amit
export const getEmployees = async (req, res) => {
  try {
    const { role, status, project, search } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (status) filter.status = status;
    if (project) filter.assignedProject = project;
    if (search) filter.name = { $regex: search, $options: "i" };

    const employees = await Employee.find(filter)
      .populate("assignedProject", "name")
      .sort({ createdAt: -1 });

    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid employee id" });
    }

    const employee = await Employee.findById(req.params.id).populate(
      "assignedProject",
      "name"
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid employee id" });
    }

    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid employee id" });
    }

    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};