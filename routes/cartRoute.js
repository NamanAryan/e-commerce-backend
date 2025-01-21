
import Cart from "../models/cart.model.js";
import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/add_cart", protect, async (req, res) => {
    const { items, totalPrice } = req.body;
    try {
        if (!items || !items.length || !totalPrice) {
            return res.status(400).json({
                message: "Please provide all required fields",
            });
        }

        if (!items.every(item => item.productId && item.quantity && item.price)) {
            return res.status(400).json({
                message: "Invalid items format",
            });
        }

        let existingCart = await Cart.findOne({ userId: req.user._id });
        
        if (existingCart) {
            existingCart.items = items;
            existingCart.totalPrice = totalPrice;
            await existingCart.save();
            return res.status(200).json({ success: true, cart: existingCart });
        }

        const cart = await Cart.create({
            userId: req.user._id,
            items,
            totalPrice,
        });

        res.status(201).json({ success: true, cart });
    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({
            success: false,
            message: "Add to cart failed",
        });
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