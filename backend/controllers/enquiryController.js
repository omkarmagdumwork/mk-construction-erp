import mongoose from "mongoose";
import Enquiry from "../models/Enquiry.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Public: called from the website contact form
export const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, serviceType, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res
        .status(400)
        .json({ message: "Name, email, phone and message are required" });
    }

    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    // Only pick allowed fields, so status cannot be set by the public
    await Enquiry.create({ name, email, phone, serviceType, message });

    res.status(201).json({ message: "Thank you! We will contact you soon." });
  } catch (error) {
    res.status(500).json({ message: "Could not submit enquiry. Please try again." });
  }
};

// Admin: ?status=new&search=rahul
export const getEnquiries = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (search) filter.name = { $regex: search, $options: "i" };

    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEnquiryById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid enquiry id" });
    }

    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin can change only status and note
export const updateEnquiry = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid enquiry id" });
    }

    const { status, adminNote } = req.body;
    const updates = {};
    if (status !== undefined) updates.status = status;
    if (adminNote !== undefined) updates.adminNote = adminNote;

    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEnquiry = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid enquiry id" });
    }

    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};