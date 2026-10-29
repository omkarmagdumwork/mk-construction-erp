import mongoose from "mongoose";
import Material from "../models/Material.js";
import Purchase from "../models/Purchase.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createPurchase = async (req, res) => {
  try {
    const { material, supplierName } = req.body;
    const quantity = Number(req.body.quantity);
    const rate = Number(req.body.rate);

    if (!material || !supplierName || !quantity || quantity <= 0 || isNaN(rate)) {
      return res
        .status(400)
        .json({ message: "Material, supplier name, quantity and rate are required" });
    }

    if (!isValidId(material)) {
      return res.status(400).json({ message: "Invalid material id" });
    }

    const materialDoc = await Material.findById(material);
    if (!materialDoc) {
      return res.status(404).json({ message: "Material not found" });
    }

    const purchase = await Purchase.create({
      ...req.body,
      quantity,
      rate,
      totalAmount: quantity * rate,
    });

    // Stock in
    await Material.findByIdAndUpdate(material, { $inc: { stockQuantity: quantity } });

    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Optional: ?project=<id>&material=<id>
export const getPurchases = async (req, res) => {
  try {
    const { project, material } = req.query;
    const filter = {};

    if (project) filter.project = project;
    if (material) filter.material = material;

    const purchases = await Purchase.find(filter)
      .populate("material", "name unit")
      .populate("project", "name")
      .sort({ purchaseDate: -1 });

    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPurchaseById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid purchase id" });
    }

    const purchase = await Purchase.findById(req.params.id)
      .populate("material", "name unit")
      .populate("project", "name");

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.json(purchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deleting a purchase also removes that quantity from stock
export const deletePurchase = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid purchase id" });
    }

    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    const updated = await Material.findOneAndUpdate(
      { _id: purchase.material, stockQuantity: { $gte: purchase.quantity } },
      { $inc: { stockQuantity: -purchase.quantity } }
    );

    if (!updated) {
      return res.status(400).json({
        message: "Cannot delete: this stock has already been used",
      });
    }

    await purchase.deleteOne();
    res.json({ message: "Purchase deleted and stock adjusted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};