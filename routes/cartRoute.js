
import Cart from "../models/cart.model.js";
import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/add_cart", protect, async (req, res) => {
    try {
        // Debug the user object from auth middleware
        console.log('Auth user:', req.user);

        const { items, totalPrice } = req.body;
        
        // Create the cart with explicit userId assignment
        const cart = await Cart.create({
            userId: req.user.id,  
            items: items,
            totalPrice: totalPrice
        });

        res.status(201).json({ success: true, cart });
    } catch (error) {
        console.warn('Add to cart error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message,
            // Add more error details in development
            debug: {
                userId: req.user?.id,
                items: req.body.items,
                error: error.toString()
            }
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