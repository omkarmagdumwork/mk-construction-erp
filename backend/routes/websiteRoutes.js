import express from "express";
import { serviceHandlers, projectHandlers } from "../controllers/websiteController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/services").get(serviceHandlers.list).post(serviceHandlers.create);
router
  .route("/services/:id")
  .get(serviceHandlers.getOne)
  .put(serviceHandlers.update)
  .delete(serviceHandlers.remove);

router.route("/projects").get(projectHandlers.list).post(projectHandlers.create);
router
  .route("/projects/:id")
  .get(projectHandlers.getOne)
  .put(projectHandlers.update)
  .delete(projectHandlers.remove);

export default router;