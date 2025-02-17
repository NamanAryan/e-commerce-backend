import Order from '../models/order.model.js';
import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
const router = Router();

router.post('/create', protect, async (req, res) => {
    try {
        const { orderItems, shippingAddress, totalPrice } = req.body;

        if (!orderItems || !shippingAddress || !totalPrice) {
            return res.status(400).json({ 
                message: 'Please provide all required fields' 
            });
        }

        const order = await Order.create({
            user: req.user._id,
            orderItems,
            shippingAddress,
            totalPrice
        });

        res.status(201).json({ 
            success: true, 
            order 
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Order creation failed' 
        });
    }
});


router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders'
        });
    }
});

router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ 
                message: 'Order not found' 
            });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order'
        });
    }
});

export default router;