import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { addSweet, deleteSweet, listSweets, purchaseSweet, restockSweet, searchSweets, updateSweet } from "../controllers/sweet.controller.js";

const router = express.Router();

// Protected routes
router.post("/", protectRoute, adminRoute, addSweet);
router.get("/", protectRoute, listSweets);
router.get("/search", protectRoute, searchSweets);
router.put("/:id", protectRoute, adminRoute, updateSweet);
router.delete("/:id", protectRoute, adminRoute, deleteSweet);

// Inventory operations
router.post("/:id/purchase", protectRoute, purchaseSweet);
router.post("/:id/restock", protectRoute, adminRoute, restockSweet);

export default router;


