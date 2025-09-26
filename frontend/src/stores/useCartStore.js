import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
	cart: [],
    total: 0,
    subtotal: 0,

    // Client-side cart only; purchase will call backend inventory API
    getCartItems: async () => {
        // no-op for server fetch; preserved for API compatibility
        get().calculateTotals();
    },
	clearCart: async () => {
        set({ cart: [], total: 0, subtotal: 0 });
	},
    addToCart: async (product) => {
        set((prevState) => {
            const existingItem = prevState.cart.find((item) => item._id === product._id);
            const newCart = existingItem
                ? prevState.cart.map((item) => (item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item))
                : [...prevState.cart, { ...product, quantity: 1 }];
            return { cart: newCart };
        });
        toast.success("Added to cart");
        get().calculateTotals();
    },
    removeFromCart: async (productId) => {
        set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== productId) }));
        get().calculateTotals();
    },
    updateQuantity: async (productId, quantity) => {
		if (quantity === 0) {
			get().removeFromCart(productId);
			return;
		}
		set((prevState) => ({
			cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
		}));
		get().calculateTotals();
	},
    purchaseCart: async () => {
        const { cart } = get();
        try {
            for (const item of cart) {
                await axios.post(`/sweets/${item._id}/purchase`, { quantity: item.quantity });
            }
            toast.success("Purchase successful");
            set({ cart: [] });
            get().calculateTotals();
        } catch (error) {
            toast.error(error.response?.data?.message || "Purchase failed");
        }
    },
	calculateTotals: () => {
        const { cart } = get();
		const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const total = subtotal;
		set({ subtotal, total });
	},
}));
