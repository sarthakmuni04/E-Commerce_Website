import Sweet from "../models/sweet.model.js";

export const addSweet = async (req, res) => {
	try {
		const { name, category, price, quantity, description, image } = req.body;

		if (!name || !category || price === undefined || quantity === undefined) {
			return res.status(400).json({ message: "Missing required fields" });
		}

		const existing = await Sweet.findOne({ name });
		if (existing) {
			return res.status(409).json({ message: "Sweet with this name already exists" });
		}

		const sweet = await Sweet.create({ name, category, price, quantity, description, image });
		return res.status(201).json(sweet);
	} catch (error) {
		console.log("Error in addSweet controller", error.message);
		return res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const listSweets = async (req, res) => {
	try {
		const sweets = await Sweet.find({}).sort({ createdAt: -1 });
		return res.json({ sweets });
	} catch (error) {
		console.log("Error in listSweets controller", error.message);
		return res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const searchSweets = async (req, res) => {
	try {
		const { name, category, minPrice, maxPrice } = req.query;
		const query = {};
		if (name) query.name = { $regex: name, $options: "i" };
		if (category) query.category = { $regex: category, $options: "i" };
		if (minPrice !== undefined || maxPrice !== undefined) {
			query.price = {};
			if (minPrice !== undefined) query.price.$gte = Number(minPrice);
			if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
		}
		const sweets = await Sweet.find(query).sort({ createdAt: -1 });
		return res.json({ sweets });
	} catch (error) {
		console.log("Error in searchSweets controller", error.message);
		return res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateSweet = async (req, res) => {
	try {
		const { id } = req.params;
		const updates = req.body;
		if (updates.name) {
			const exists = await Sweet.findOne({ name: updates.name, _id: { $ne: id } });
			if (exists) {
				return res.status(409).json({ message: "Sweet with this name already exists" });
			}
		}
		const sweet = await Sweet.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
		if (!sweet) return res.status(404).json({ message: "Sweet not found" });
		return res.json(sweet);
	} catch (error) {
		console.log("Error in updateSweet controller", error.message);
		return res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteSweet = async (req, res) => {
	try {
		const { id } = req.params;
		const sweet = await Sweet.findByIdAndDelete(id);
		if (!sweet) return res.status(404).json({ message: "Sweet not found" });
		return res.json({ message: "Sweet deleted successfully" });
	} catch (error) {
		console.log("Error in deleteSweet controller", error.message);
		return res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const purchaseSweet = async (req, res) => {
	try {
		const { id } = req.params;
		const { quantity } = req.body;
		const qty = Number(quantity) || 1;
		const sweet = await Sweet.findById(id);
		if (!sweet) return res.status(404).json({ message: "Sweet not found" });
		if (sweet.quantity < qty) return res.status(400).json({ message: "Insufficient stock" });
		sweet.quantity -= qty;
		await sweet.save();
		return res.json({ message: "Purchase successful", sweet });
	} catch (error) {
		console.log("Error in purchaseSweet controller", error.message);
		return res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const restockSweet = async (req, res) => {
	try {
		const { id } = req.params;
		const { quantity } = req.body;
		const qty = Number(quantity) || 0;
		if (qty <= 0) return res.status(400).json({ message: "Quantity must be greater than 0" });
		const sweet = await Sweet.findById(id);
		if (!sweet) return res.status(404).json({ message: "Sweet not found" });
		sweet.quantity += qty;
		await sweet.save();
		return res.json({ message: "Restock successful", sweet });
	} catch (error) {
		console.log("Error in restockSweet controller", error.message);
		return res.status(500).json({ message: "Server error", error: error.message });
	}
};


