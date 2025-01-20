import User from '../models/user.model.js';
import { Router } from 'express';
const router = Router();
import jwt from 'jsonwebtoken';

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
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.status(201).json({ success: true, user: userResponse, token });
       
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Registration failed' 
        });
    }
});

router.post('/login', async (req, res) => {
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message: 'Please provide all required fields'});
    }
    try {
        const user = await User.findOne({email: email.toLowerCase()});
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        const isaPasswordMatch = await user.comparePassword(password);
        if(!isaPasswordMatch){
            return res.status(401).json({message: 'Invalid credentials'});
        }
        const userResponse = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email
        };
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.status(200).json({ success: true, user: userResponse, token });
    } catch (error) {   
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Login failed' 
        });
    }
    
});

export default router;