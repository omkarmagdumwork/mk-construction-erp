import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect); // all project routes need login

router.route("/").get(getProjects).post(createProject);
router
  .route("/:id")
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

export default router;
