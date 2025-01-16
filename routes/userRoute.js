import User from '../models/user.model.js';
import { Router } from 'express';
const router = Router();

router.post('/register', async (req, res) => {
    const { fullName, email, password } = req.body;
    
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ 
                message: 'Please provide all required fields' 
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: 'Please provide a valid email' 
            });
        }

        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({ 
                message: 'User already exists' 
            });
        }

        const user = await User.create({
            fullName,
            email: email.toLowerCase(),
            password
        });

        const userResponse = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email
        };

        res.status(201).json({
            success: true,
            user: userResponse
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Registration failed' 
        });
    }
});

export default router;