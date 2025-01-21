import express from 'express';
const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${req.params.id}`);
        const product = await response.json();
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
    }
});

export default router;