import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import StarRating from "./StarRating";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function CategoryProducts() {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchMessage, setSearchMessage] = useState("");
    const [cart, setCart] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const navigate = useNavigate();
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        fetchCategoryProducts();
    }, [category]);

    const fetchCategoryProducts = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/products/category/${category}`);
            setProducts(response.data);
            setFilteredProducts(response.data); // Initialize filteredProducts with all products
        } catch (error) {
            console.error("Error fetching category products:", error);
        }
    };

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredProducts(products); // Show all products if search query is empty
            setSearchMessage(""); // Clear search message
        } else {
            const filtered = products.filter((p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProducts(filtered);
            if (filtered.length === 0) {
                setSearchMessage("🚨 Product not found! Please try another search.");
            } else {
                setSearchMessage(""); // Clear search message if products are found
            }
        }
    }, [searchQuery, products]);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find((item) => item._id === product._id);
            if (existingProduct) {
                return prevCart.map((item) =>
                    item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });

        setShowToast(true);
    };

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const goToCartPage = () => {
        if (cart.length === 0) {
            alert("🚨 No product selected! Please add products to your cart.");
        } else {
            navigate("/cart", { state: { cart } });
        }
    };

    const handleSearch = () => {
        // Filtering is already handled in the useEffect, so no need to do anything here
        // This function is just to trigger the search when the button is clicked
    };

    return (
        <div className="container mt-1 ms-0 w-100">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top" style={{ height: "50px" }}>
                <div className="container">
                    <a className="navbar-brand fw-bold" href="/">🛒 E-Shop</a>
                    <div className="d-flex my-3">
                        <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Search for products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="btn btn-light" onClick={handleSearch}><FaSearch /></button>
                    </div>
                    <div className="d-flex">
                        <a href="#" className="btn btn-outline-light me-2"><FaUser /> Profile</a>
                        <button className="btn btn-warning position-relative" onClick={goToCartPage}>
                            <FaShoppingCart /> Cart
                            {cart.length > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {cart.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Search Message */}
            {searchMessage && (
                <div className="alert alert-warning text-center mt-9" role="alert">
                    {searchMessage}
                </div>
            )}

            {/* Toast Notification */}
            <div className="toast-container position-fixed bottom-0 end-0 p-3">
                <div
                    className={`toast ${showToast ? "show" : ""}`}
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                >
                    <div className="toast-header bg-success text-white">
                        <strong className="me-auto">🛒 Added to Cart</strong>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            data-bs-dismiss="toast"
                            aria-label="Close"
                            onClick={() => setShowToast(false)}
                        ></button>
                    </div>
                    <div className="toast-body">
                        The product has been added to your cart.
                    </div>
                </div>
            </div>

            {/* Category Products */}
            <div className="container mt-4">
                <h2 className="text-center mb-4">All {category} Products</h2>
                <div className="row">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <div key={product._id} className="col-md-4 mb-4">
                                <div className="card h-100">
                                    <img
                                        src={`http://localhost:5000${product.image}`}
                                        className="card-img-top"
                                        alt={product.name}
                                        style={{ height: "250px", objectFit: "fill" }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="card-text">${product.price}</p>
                                        <StarRating productId={product._id} />
                                        <button
                                            className="btn btn-success w-100"
                                            onClick={() => addToCart(product)}
                                        >
                                            <FaShoppingCart /> Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center">No products found in this category.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CategoryProducts;