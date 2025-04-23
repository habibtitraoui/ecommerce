const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true, // Remove extra spaces
        minlength: [3, "Name must be at least 3 characters long"], 
        maxlength: [100, "Name cannot exceed 100 characters"],
    },
    price: { 
        type: Number, 
        required: true, 
        min: [0, "Price cannot be negative"], 
    },
    description: { 
        type: String, 
        trim: true, 
        maxlength: [10000, "Description cannot exceed 500 characters"],
    },
    promotion: { 
        type: Number, 
        default: 0, 
        min: [0, "Promotion cannot be negative"], 
        max: [100, "Promotion cannot exceed 100%"], 
    },
    image: { 
        type: String, 
        required: true, 
    },
    category: { 
        type: String, 
        required: true, 
        enum: ["bocsh", "crown", "Honestpro", "sofeclef", "Tolson", "Total", "emtop", "ingco"], // Ensure category is valid
    },
    date: { 
        type: Date, 
        default: Date.now, 
    },
    visible: { 
        type: Boolean, 
        default: true, 
    },
    ratings: [
        {
            rating: { 
                type: Number, 
                required: true, 
                min: [1, "Rating must be at least 1"], 
                max: [5, "Rating cannot exceed 5"], 
            },
            comment: { 
                type: String, 
                trim: true, 
                maxlength: [200, "Comment cannot exceed 200 characters"],
            },
            user: { 
                type: String, 
                trim: true, 
            },
        },
    ],
    averageRating: { 
        type: Number, 
        default: 0, 
        min: [0, "Average rating cannot be negative"], 
        max: [5, "Average rating cannot exceed 5"], 
    },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
