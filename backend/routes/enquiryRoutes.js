import express from "express";
import rateLimit from "express-rate-limit";
import {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
} from "../controllers/enquiryController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Allow only 10 enquiries per 15 minutes from one IP
const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { message: "Too many enquiries. Please try again later." },
});

// Public route (no login)
router.post("/", enquiryLimiter, createEnquiry);

// Admin routes (login required)
router.use(protect);

router.get("/", getEnquiries);
router.route("/:id").get(getEnquiryById).put(updateEnquiry).delete(deleteEnquiry);

export default router;