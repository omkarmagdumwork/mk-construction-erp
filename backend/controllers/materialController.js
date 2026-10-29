import mongoose from "mongoose";
import Material from "../models/Material.js";
import MaterialUsage from "../models/MaterialUsage.js";
import Purchase from "../models/Purchase.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createMaterial = async (req, res) => {
  try {
    const { name, unit } = req.body;

    if (!name || !unit) {
      return res.status(400).json({ message: "Name and unit are required" });
    }

    const material = await Material.create(req.body);
    res.status(201).json(material);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Material already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

// Optional: ?search=cement and ?lowStock=true
export const getMaterials = async (req, res) => {
  try {
    const { search, lowStock } = req.query;
    const filter = {};

    if (search) filter.name = { $regex: search, $options: "i" };
    if (lowStock === "true") {
      filter.$expr = { $lte: ["$stockQuantity", "$minStockLevel"] };
    }

    const materials = await Material.find(filter).sort({ name: 1 });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMaterialById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid material id" });
    }

    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    res.json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Only name, unit and minStockLevel can be edited. Stock changes only by purchase or usage.
export const updateMaterial = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid material id" });
    }

    const { name, unit, minStockLevel } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (unit !== undefined) updates.unit = unit;
    if (minStockLevel !== undefined) updates.minStockLevel = minStockLevel;

    const material = await Material.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    res.json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMaterial = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid material id" });
    }

    const purchaseCount = await Purchase.countDocuments({ material: req.params.id });
    const usageCount = await MaterialUsage.countDocuments({ material: req.params.id });

    if (purchaseCount > 0 || usageCount > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete a material that has purchase or usage records" });
    }

    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    res.json({ message: "Material deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Stock out: material used on a project
export const useMaterial = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid material id" });
    }

    const { project, usedOn, note } = req.body;
    const quantity = Number(req.body.quantity);

    if (!project || !quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Project and a valid quantity are required" });
    }

    // Reduce stock only if enough stock is available
    const material = await Material.findOneAndUpdate(
      { _id: req.params.id, stockQuantity: { $gte: quantity } },
      { $inc: { stockQuantity: -quantity } },
      { new: true }
    );

    if (!material) {
      return res
        .status(400)
        .json({ message: "Material not found or not enough stock available" });
    }

    const usage = await MaterialUsage.create({
      material: req.params.id,
      project,
      quantity,
      usedOn,
      note,
    });

    res.status(201).json({ usage, currentStock: material.stockQuantity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Usage history. Optional: ?project=<id>&material=<id>
export const getUsage = async (req, res) => {
  try {
    const { project, material } = req.query;
    const filter = {};

    if (project) filter.project = project;
    if (material) filter.material = material;

    const usage = await MaterialUsage.find(filter)
      .populate("material", "name unit")
      .populate("project", "name")
      .sort({ usedOn: -1 });

    res.json(usage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};