import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
	products: [],
	loading: false,

	setProducts: (products) => set({ products }),
    createProduct: async (productData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/sweets", productData);
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to create sweet");
			set({ loading: false });
		}
	},
    fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/sweets");
			set({ products: response.data.sweets, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch sweets", loading: false });
			toast.error(error.response?.data?.message || "Failed to fetch sweets");
		}
	},
    fetchProductsByCategory: async (category) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/sweets/search`, { params: { category } });
			set({ products: response.data.sweets, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch sweets", loading: false });
			toast.error(error.response?.data?.message || "Failed to fetch sweets");
		}
	},
    deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/sweets/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to delete sweet");
		}
	},
}));
