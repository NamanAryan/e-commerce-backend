
import Cart from "../models/cart.model.js";
import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/add_cart", protect, async (req, res) => {
    const { items, totalPrice } = req.body;

    try {
        if (!Array.isArray(items) || items.length === 0 || totalPrice === undefined) {
            return res.status(400).json({ message: "Please provide valid items and total price" });
        }

        if (!items.every(item => item.productId && Number.isInteger(item.quantity) && item.quantity > 0 && item.price >= 0)) {
            return res.status(400).json({ message: "Invalid items format" });
        }

        let existingCart = await Cart.findOne({ userId: req.user._id });

        if (existingCart) {
            items.forEach(newItem => {
                const existingItem = existingCart.items.find(item => item.productId === newItem.productId);
                if (existingItem) {
                    // Increase quantity if the item is already in the cart
                    existingItem.quantity += newItem.quantity;
                } else {
                    // Add new item if not in the cart
                    existingCart.items.push(newItem);
                }
            });

            // Recalculate total price
            existingCart.totalPrice = existingCart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
            await existingCart.save();

            return res.status(200).json({ success: true, cart: existingCart });
        }

        // If no existing cart, create a new one
        const cart = await Cart.create({
            userId: req.user._id,
            items,
            totalPrice,
        });

        res.status(201).json({ success: true, cart });

    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({ success: false, message: "Add to cart failed" });
    }
});



router.delete("/delete_cart/:id", protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ 
            _id: req.params.id,
            userId: req.user._id 
        });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Cart deleted" });
    } catch (error) {
        console.error("Delete cart error:", error);
        res.status(500).json({ success: false, message: "Delete cart failed" });
    }
});

router.get("/get_cart/:id", protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ 
            _id: req.params.id,
            userId: req.user._id 
        });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error("Get cart error:", error);
        res.status(500).json({ success: false, message: "Get cart failed" });
    }
});

router.patch("/update_cart/:id", protect, async (req, res) => {
    const { items, totalPrice } = req.body;
    try {
        if (!items || !items.length || !totalPrice) {
            return res.status(400).json({
                message: "Please provide all required fields",
            });
        }

        let cart = await Cart.findOne({ 
            _id: req.params.id,
            userId: req.user._id 
        });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart = await Cart.findByIdAndUpdate(
            req.params.id,
            { items, totalPrice },
            { new: true }
        );

        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error("Update cart error:", error);
        res.status(500).json({ success: false, message: "Update cart failed" });
    }
});

router.get("/my_cart", protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        
        if (!cart) {
            return res.status(404).json({ message: "No cart found" });
        }

        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error("Get cart error:", error);
        res.status(500).json({ success: false, message: "Get cart failed" });
    }
});

export default router;