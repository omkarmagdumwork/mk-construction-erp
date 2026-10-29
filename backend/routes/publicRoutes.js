import express from "express";
import {
  getPublicServices,
  getPublicProjects,
  getPublicProjectById,
} from "../controllers/websiteController.js";

const router = express.Router();

router.get("/services", getPublicServices);
router.get("/projects", getPublicProjects);
router.get("/projects/:id", getPublicProjectById);

export default router;