import express from "express";
import {
  createMaterial,
  getMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
  useMaterial,
  getUsage,
} from "../controllers/materialController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getMaterials).post(createMaterial);
router.get("/usage", getUsage);
router.post("/:id/use", useMaterial);
router
  .route("/:id")
  .get(getMaterialById)
  .put(updateMaterial)
  .delete(deleteMaterial);

export default router;