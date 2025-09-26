import mongoose from "mongoose";

const sweetSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		category: {
			type: String,
			required: true,
			trim: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		quantity: {
			type: Number,
			required: true,
			min: 0,
		},
		description: {
			type: String,
			default: "",
		},
		image: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
);

sweetSchema.index({ name: 1 });
sweetSchema.index({ category: 1 });

const Sweet = mongoose.model("Sweet", sweetSchema);

export default Sweet;


