import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    deliveryType: { type: String, enum: ["desktop", "domicile"], required: true },
    city: { type: String },
    street: { type: String },
    totalPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;