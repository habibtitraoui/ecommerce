import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const StarRating = ({ productId }) => {
    const { id } = useParams(); 
    const finalProductId = productId || id;

    const [rating, setRating] = useState(0);

    const handleRating = async (ratingValue) => {
        if (!finalProductId) {
            console.error("❌ Product ID is undefined. Cannot submit rating.");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/api/products/${finalProductId}/rate`, {
                rating: ratingValue,
                comment: "Nice product!",
            });

            console.log("✅ Rating saved successfully!", response.data);
            setRating(ratingValue);
        } catch (error) {
            console.error("❌ Error saving rating:", error);
        }
    };

    return (
        <div>
           
            <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>  
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        onClick={() => handleRating(star)}
                        style={{
                            cursor: "pointer",
                            color: rating >= star ? "gold" : "gray",
                            fontSize: "24px",
                            transition: "color 0.3s ease",
                        }}
                    >
                        ★
                    </span>
                ))}
            </div>
        </div>
    );
};

export default StarRating;
