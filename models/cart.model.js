import mongoose from 'mongoose';
const { Schema } = mongoose;  

// Backend cart schema
const CartSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            productId: {
                type: String,  
                required: true
            },
            title: {         // Add title
                type: String,
                required: true
            },
            image: {         // Add image
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    }
});

const Cart = mongoose.model('Cart', CartSchema);
export default Cart;