import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import './Cart.css' ;

// قائمة ولايات الجزائر مع بلدياتها
const algerianProvinces = {
    "Adrar": ["Adrar", "Reggane", "Timimoun", "Zaouiet Kounta"],
    "Chlef": ["Chlef", "Ténès", "Béni Haoua", "Ouled Fares"],
    "Laghouat": ["Laghouat", "Aflou", "Brida", "Tadjemout"],
    "Oum El Bouaghi": ["Oum El Bouaghi", "Aïn Beïda", "Meskiana", "F'kirina"],
    "Batna": ["Batna", "Barika", "Merouana", "Tazoult"],
    "Béjaïa": ["Béjaïa", "Akbou", "Sidi Aïch", "Tichy"],
    "Biskra": ["Biskra", "Tolga", "El Kantara", "Ouled Djellal"],
    "Blida": ["Blida", "Boufarik", "Mouzaia", "El Affroun"],
    "Bouira": ["Bouira", "Lakhdaria", "M'Chedallah", "Aïn Bessem"],
    "Tamanrasset": ["Tamanrasset", "Ain Guezzam", "Idlès", "Tazrouk"],
    "Tébessa": ["Tébessa", "Bir el Ater", "Cheria", "El Aouinet"],
    "Tlemcen": ["Tlemcen", "Maghnia", "Remchi", "Ghazaouet"],
    "Algiers": ["Algiers", "Bab El Oued", "Hussein Dey", "El Harrach"],
    "Oran": ["Oran", "Es Senia", "Bir El Djir", "Arzew"],
    "Constantine": ["Constantine", "El Khroub", "Aïn Smara", "Hamma Bouziane"],
};

function Cart() {
    const location = useLocation();
    const navigate = useNavigate();
    const cart = location.state?.cart || []; // Get the cart state from location

    // State for form data
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        deliveryType: "onDesk", // Default delivery type
        province: "",
        municipality: "",
        street: "",
    });

    // State for similar products
    const [similarProducts, setSimilarProducts] = useState([]);

    // Fetch similar products based on the category of products in the cart
    useEffect(() => {
        if (cart.length > 0) {
            const categories = [...new Set(cart.map((item) => item.category))]; // Get unique categories
            const excludeId = cart[0]._id; // Exclude the first product in the cart

            console.log("Fetching similar products for category:", categories[0]); // Log the category
            console.log("Excluding product ID:", excludeId); // Log the excluded product ID

            fetch(`http://localhost:5000/api/products/category/${categories[0]}/${excludeId}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log("Similar products data:", data); // Log the data
                    setSimilarProducts(data);
                })
                .catch((error) => console.error("Error fetching similar products:", error));
        }
    }, [cart]);

    // Handle input change for form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
            ...(name === "province" ? { municipality: "" } : {}), // Reset municipality when province changes
        }));
    };

    // Handle quantity change for a product
    const handleQuantityChange = (id, newQuantity) => {
        if (newQuantity < 1) return; // Prevent negative or zero quantities
        const updatedCart = cart.map((item) =>
            item._id === id ? { ...item, quantity: newQuantity } : item
        );
        // Update the cart state and navigate with the updated cart
        navigate("/cart", { state: { cart: updatedCart } });
    };

    // Remove a product from the cart
    const removeFromCart = (id) => {
        const updatedCart = cart.filter((item) => item._id !== id);
        // Update the cart state and navigate with the updated cart
        navigate("/cart", { state: { cart: updatedCart } });
    };

    // Add a product to the cart
    const addToCart = (product) => {
        const existingProduct = cart.find((item) => item._id === product._id);
        let updatedCart;

        if (existingProduct) {
            // If the product already exists, increase its quantity
            updatedCart = cart.map((item) =>
                item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            // If the product is new, add it to the cart with quantity 1
            updatedCart = [...cart, { ...product, quantity: 1 }];
        }

        // Update the cart state and navigate with the updated cart
        navigate("/cart", { state: { cart: updatedCart } });
    };

    // Calculate total price (including delivery charges)
    const totalPrice =
        cart.reduce((total, item) => total + item.price * item.quantity, 0) +
        (formData.deliveryType === "onDesk" ? 45 : 75);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Prepare the data to be sent to the backend
        const cartData = {
            product: cart[0]._id, // Assuming one product per cart for simplicity
            name: formData.name,
            phone: formData.phone,
            deliveryType: formData.deliveryType === "onDesk" ? "desktop" : "domicile",
            city: formData.province,
            street: formData.street,
            totalPrice: totalPrice,
        };
    
        try {
            // Send the data to the backend
            const response = await fetch("http://localhost:5000/api/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cartData),
            });
    
            if (response.ok) {
                alert("Order confirmed successfully!");
                // Clear the cart after successful submission
                navigate("/cart", { state: { cart: [] } });
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error submitting order:", error);
            alert("Failed to submit order. Please try again.");
        }
    };

    // If no product is selected and the cart is empty, show a message
    if (cart.length === 0) {
        return <h2 className="text-center text-danger">🚨 No product selected!</h2>;
    }

    return (
        <div className="container mt-4" style={{ padding:" 0",
            margin: "0"}}>
            <h2 className="text-center">🛒 Shopping Cart</h2>
            <div className="row">
                {/* Cart Items Section */}
                <div className="col-md-8">
                    {cart.map((item) => (
                        <div key={item._id} className="card mb-3 shadow-sm">
                            <div className="row g-0">
                                <div className="col-md-4">
                                    <img
                                        src={`http://localhost:5000${item.image}`}
                                        className="img-fluid rounded-start"
                                        alt={item.name}
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h5 className="card-title">{item.name}</h5>
                                        <p className="card-text text-muted">{item.description}</p>
                                        <p className="card-text text-success fw-bold">
                                            💰 Price: ${item.price} (Qty: {item.quantity})
                                        </p>
                                        <div className="d-flex align-items-center">
                                            <label className="me-2">Qty:</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    handleQuantityChange(item._id, Number(e.target.value))
                                                }
                                                className="form-control w-25"
                                            />
                                            <button
                                                className="btn btn-danger ms-3"
                                                onClick={() => removeFromCart(item._id)}
                                            >
                                                ❌ Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
                {/* Order Summary and Form Section */}
                <div className="col-md-4 position-absolute top-0 end-0 w-48 ms-4" style={{ marginTop: "5%" }}>
            <div className="card shadow-sm p-3">
                <h4>📋 Order Summary</h4>
                <p>Total Items: {cart.length}</p>
                <p>Total Price: ${totalPrice}</p>

                {/* Delivery Options */}
                <div className="mb-3">
                    <label className="form-label">🚚 Delivery Type</label>
                    <select
                        className="form-control"
                        name="deliveryType"
                        value={formData.deliveryType}
                        onChange={handleInputChange}
                    >
                        <option value="onDesk">On Desk (+$45)</option>
                        <option value="home">To Home (+$75)</option>
                    </select>
                </div>

                {/* User Details Form */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">👤 Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">📞 Phone</label>
                        <input
                            type="text"
                            className="form-control"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">🏙️ Province</label>
                        <select
                            className="form-control"
                            name="province"
                            value={formData.province}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">-- Select Province --</option>
                            {Object.keys(algerianProvinces).map((province, index) => (
                                <option key={index} value={province}>{province}</option>
                            ))}
                        </select>
                    </div>
                    {formData.province && (
                        <div className="mb-3">
                            <label className="form-label">🏘️ Municipality</label>
                            <select
                                className="form-control"
                                name="municipality"
                                value={formData.municipality}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">-- Select Municipality --</option>
                                {algerianProvinces[formData.province].map((municipality, index) => (
                                    <option key={index} value={municipality}>{municipality}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <button type="submit" className="btn btn-success w-100 mt-3">
                        ✅ Confirm Order
                    </button>
                </form>
            </div>
        </div>
  

                

             
            {/* Similar Products Moving Bar */}
            {similarProducts.length > 0 && (
                <div style={{width:"65%" , margin:"0px" , padding:"0px"}}>
                    <h3 className="text-center mb-4">🔄 Similar Products</h3>
                    <div className="moving-bar">
                        <div className="moving-track">
                            {similarProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className="moving-item"
                                    onClick={() => addToCart(product)} // Add product to cart on click
                                    style={{ cursor: "pointer" }} // Change cursor to pointer
                                >
                                    <img
                                        src={`http://localhost:5000${product.image}`}
                                        alt={product.name}
                                        className="product-image"
                                        style={{ height: "150px", objectFit: "cover" }}
                                    />
                                    <div className="text-center mt-2">
                                        <h6>{product.name}</h6>
                                        <p className="text-success fw-bold">${product.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
          
        </div>
         

               
        
    );
}

export default Cart;