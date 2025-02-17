import Order from '../models/order.model.js';
import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
const router = Router();

router.post('/create', protect, async (req, res) => {
    res.send('Order creation route');
    const { orderItems, shippingAddress, itemsPrice, totalPrice } = req.body;
    if (!orderItems || !shippingAddress || !itemsPrice || !totalPrice) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }
    try {
        const order = await Order.create({
            orderItems,
            itemsPrice,
            totalPrice
        });
        res.status(201).json({ success: true, order });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ success: false, message: 'Order creation failed' });
    }
});

router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error('Order retrieval error:', error);
        res.status(500).json({ success: false, message: 'Order retrieval failed' });
    }
});

export default router;