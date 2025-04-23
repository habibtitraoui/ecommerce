import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FaShoppingCart, FaUser, FaBoxOpen } from "react-icons/fa";
import "./MovingBar.css";
import "./Footer.css"


import { useRef } from "react";
import { FaSearch } from "react-icons/fa";
import StarRating from "./StarRating";
import { useNavigate } from "react-router-dom";

function ClientShop() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories] = useState(["bocsh", "crown", "Honestpro", "sofeclef","Tolson" , "Total","emtop","ingco"]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [scrollIndex, setScrollIndex] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [isScrollingPaused, setIsScrollingPaused] = useState(false);
    const [ showToast,setShowToast] = useState(false);
    const [cart, setCart] = useState([]); // State for the cart
    const [searchMessage, setSearchMessage] = useState("");
    const [highlightedProduct, setHighlightedProduct] = useState(null);
    const productRefs = useRef({}); // Refs for products
    const categoryRefs = useRef({}); // Refs for categories
    const [topProducts, setTopProducts] = useState([]);
    const [currentTopProductIndex, setCurrentTopProductIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    
    const categoryStyles = {
        bocsh: { backgroundColor: "#003B6A", color: "#ED0007" }, // Light Gray
        crown: { backgroundColor: "#afafaf", color: "#C51C1C" }, // Red with White text
        Honestpro: { backgroundColor: "#00445B", color: "#ED1B24" }, // Blue with White text
        sofeclef: { backgroundColor: "#FD0000", color: "white" }, // Green with White text
        Tolson: { backgroundColor: "#000000", color: "#FFA300" }, // Yellow with Black text
        Total: { backgroundColor: "#006466", color: "white" }, // Orange with White text
        emtop: { backgroundColor: "#001F60", color: "D2001E" }, // Purple with White text
        ingco: { backgroundColor: "#FF9900", color: "black" } // Black with Yellow text
    };
    
    

    useEffect(() => {
        fetchProducts();
    }, []);
    useEffect(() => {
        // اختيار المنتجات الأعلى تصنيفًا
        const sortedProducts = [...products].sort((a, b) => b.rating - a.rating);
        setTopProducts(sortedProducts.slice(0, 5));
      }, [products]);
    useEffect(() => {
        if (topProducts.length === 0) return;
    
        const interval = setInterval(() => {
            setCurrentTopProductIndex((prevIndex) => (prevIndex + 1) % Math.min(5, topProducts.length));
        }, 5000);
    
        return () => clearInterval(interval);
    }, [topProducts]);
    
    
    useEffect(() => {
        if (isScrollingPaused) return; // Stop auto-scrolling if paused
    
        const intervals = [];
    
        categories.forEach(category => {
            const categoryProducts = products.filter(p => p.category === category);
            if (categoryProducts.length > 3) {
                const interval = setInterval(() => {
                    handleScroll(category, "right");
                }, 8000); // Change every 8 seconds
                intervals.push(interval);
            }
        });
    
        return () => {
            intervals.forEach(interval => clearInterval(interval));
        };
    }, [products, isScrollingPaused]);






    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find((item) => item._id === product._id);
            if (existingProduct) {
                // If the product already exists, increase its quantity
                return prevCart.map((item) =>
                    item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                // If the product is new, add it to the cart with quantity 1
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    
        // Show the toast
        setShowToast(true);
    
        // Hide the toast after 3 seconds
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };
    

    const goToCartPage = () => {
        if (cart.length === 0) {
            alert("🚨 No product selected! Please add products to your cart.");
        } else {
            navigate("/cart", { state: { cart } }); // Pass the entire cart state
        }
    };


    

    const handleSearch = () => {
        const foundProduct = products.find(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

        if (foundProduct) {
            const category = foundProduct.category;
            const categoryProducts = products.filter(p => p.category === category);
            const productIndex = categoryProducts.findIndex(p => p._id === foundProduct._id);

            if (productIndex !== -1) {
                setScrollIndex(prev => ({
                    ...prev,
                    [category]: productIndex
                }));

                setHighlightedProduct(foundProduct._id);
                setIsScrollingPaused(true); // Pause scrolling

                setTimeout(() => {
                    productRefs.current[foundProduct._id]?.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 300);

                setTimeout(() => {
                    setHighlightedProduct(null);
                    setIsScrollingPaused(false);
                }, 5000);
            }
        } else {
            setSearchMessage("🚨 Product not found! Please try another search.");
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/products/all");
            const visibleProducts = response.data.filter(product => product.visible);
            setProducts(visibleProducts);

            const initialScrollIndex = {};
            categories.forEach(category => {
                initialScrollIndex[category] = 0;
            });
            setScrollIndex(initialScrollIndex);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleScroll = (category, direction) => {
        setScrollIndex(prev => {
            const categoryProducts = products.filter(p => p.category === category);
            const maxIndex = categoryProducts.length - 1;

            let newIndex;
            if (direction === "left") {
                newIndex = prev[category] === 0 ? maxIndex : prev[category] - 1;
            } else {
                newIndex = prev[category] === maxIndex ? 0 : prev[category] + 1;
            }

            return { ...prev, [category]: newIndex };
        });
    };

    return (
        <div className="container mt-1 ms-0  w-100">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top " style={{ marginRight: '-130px',height:"50px" }}>
                <div className="container" >
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
            {searchMessage && (
                <div className="alert alert-warning text-center mt-9 " role="alert" style={{ marginRight: '-130px' }}>
                    {searchMessage}
                </div>
            )}
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

            <div className="text-center my-3">
                {categories.map((category, index) => (
                    <button
                        key={index}
                        style={{ ...categoryStyles[category] , fontFamily:"-moz-initial"  }}
                        className={`btn me-2 ${selectedCategory === category ? "btn-primary" : "btn-outline-primary"}`}
                         onClick={() => {
                            setSelectedCategory(category);
                            categoryRefs.current[category]?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}>
                        {category === "bocsh" ? <FaBoxOpen /> :
                             <FaBoxOpen  />} {category}
                    </button>
                ))}
            </div>

            

          

           {/* New Arrivals and Top Products */}
           <div className="row">
                <div className="col-md-8">
                    <h4 className="text-center mt-2 text-primary">🆕 New Arrivals</h4>
                    <div className="moving-bar">
                        <div className="moving-track">
                            {products.slice(-6).map((p) => (
                                <div key={p._id} className="moving-item">
                                    <img src={`http://localhost:5000${p.image}`} alt={p.name} className="product-image"/>
                                    <span className="fw-bold">{p.name} - ${p.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <h4 className="text-center mt-2 text-danger">🔥 Promotions</h4>
                    <div className="moving-bar promotion-bar">
                        <div className="moving-track">
                            {products.filter(p => p.promotion > 0).map((p) => (
                                <div key={p._id} className="moving-item">
                                    <img src={`http://localhost:5000${p.image}`} alt={p.name} className="product-image"    style={{ objectFit: "fill"}}/>
                                    <span className="text-danger fw-bold">{p.name} - <del>${p.price}</del> ${p.price - (p.price * p.promotion / 100)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Products Section */}
                <div className="col-md-3" style={{ marginLeft: '90px' }}>
    <h4 className="text-center mt-2 text-success">🏆 Top Products</h4>
    {topProducts.length > 0 && (
        <div className="card shadow-sm p-2 text-center" style={{ maxHeight: "250px", overflow: "hidden" , width:"120%"}}>
            <img
                src={`http://localhost:5000${topProducts[currentTopProductIndex].image}`}
                className="card-img-top mx-auto"
                alt={topProducts[currentTopProductIndex].name}
                style={{ height: "120px", objectFit: "contain", width: "100%" }}
            />
            <div className="card-body mt-n4">
                
                <p className="fw-bold text-success">${topProducts[currentTopProductIndex].price}</p>
                <button className="btn btn-sm btn-success mt-n2" onClick={() => addToCart(topProducts[currentTopProductIndex])}>
                    🛒 Add to Cart
                </button>
            </div>
        </div>
    )}
</div>
            </div>






            <h2 className="text-center mt-4 text-dark"> Our Categories</h2>

            {categories.map((category, index) => {
          const categoryProducts = products.filter(p => p.category === category);
           return (
          <div key={category} ref={(el) => (categoryRefs.current[category] = el)} className="mt-2  "style={{ marginRight: '-130px' }}>
            <h4 className="text-center  fw-bold "style={{ ...categoryStyles[category] , fontFamily:"-moz-initial"  }}>{category}</h4>
            <div className="text-end">
            <button
      className="btn"
      style={{
        ...categoryStyles[category],
        backgroundColor: isHovered ? "#454F54" : categoryStyles[category]?.backgroundColor,
        color: isHovered ? "#fff" : categoryStyles[category]?.color,
        transition: "0.3s ease-in-out",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/category/${category}`)}
    >
       All {category} Products
    </button>
            </div>

            {categoryProducts.length > 0 ? (
                <div className="position-relative">
                    <div className="d-flex overflow-hidden rounded border p-3 shadow-sm bg-light"
                        style={{ gap: "15px", transition: "transform 0.4s ease-in-out", position: "relative" }}>

                        {categoryProducts
                            .slice(scrollIndex[category], scrollIndex[category] + 4)
                            .map((product) => (
                                <div
                                    key={product._id}
                                    ref={(el) => (productRefs.current[product._id] = el)}
                                    className={`card mx-2 ms-5 ${highlightedProduct === product._id ? "border border-danger shadow-lg" : ""}`}
                                    style={{ minWidth: "220px", maxWidth: "220px", height: "320px", cursor: "pointer" }}
                                >
                                    <img src={`http://localhost:5000${product.image}`}
                                        className="card-img-top"
                                        alt={product.name}
                                        style={{ height: "50%", objectFit: "fill", width: "100%" }}
                                        onClick={() => addToCart(product)}
                                    />
                                    <div className="card-body text-center">
                                        <h6 className="card-title">{product.name}</h6>
                                        <p className="fw-bold text-success">${product.price}</p>
                                        <StarRating productId={product._id} />
                                        <button className="btn btn-sm btn-success mt-2" onClick={() => addToCart(product)}>
                                            🛒 Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {categoryProducts.length > 1 && categoryProducts.length > 4 && (
                        <>
                            <button className="btn btn-primary position-absolute top-0 start-0 h-100"
                                style={{ width: "50px", borderRadius: "0", fontSize: "20px" }}
                                onClick={() => handleScroll(category, "left")}>
                                ◀
                            </button>
                            <button className="btn btn-primary position-absolute top-0 end-0 h-100"
                                style={{ width: "50px", borderRadius: "0", fontSize: "20px" }}
                                onClick={() => handleScroll(category, "right")}>
                                ▶
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <p className="text-center text-muted">🚨 No products available in this category!</p>
            )}

            {/* Insert the delivery, product, and service client bar after the first category */}
            {index === 2 && (
                <div className="container-fluid bg-light py-3 my-4">
                    <div className="row justify-content-center text-center">
                        {/* Livraison disponible 58 wilayas */}
                        <div className="col-md-3">
                            <div className="d-flex align-items-center justify-content-center">
                                <img
                                    src="src/delivry.png" // Replace with the actual path to the delivery logo
                                    alt="Delivery"
                                    className="me-2"
                                    style={{ width: "130px", height: "130px" }}
                                />
                                <div>
                                    <h6 className="mb-0">Livraison disponible</h6>
                                    <p className="mb-0">58 wilayas</p>
                                </div>
                            </div>
                        </div>

                        {/* Numéro total de produits */}
                        <div className="col-md-4">
                            <div className="d-flex align-items-center justify-content-center">
                                <img
                                    src="src/box.png" // Replace with the actual path to the product logo
                                    alt="Products"
                                    className="me-2"
                                    style={{ width: "130px", height: "130px" }}
                                />
                                <div>
                                    <h6 className="mb-0">Numéro total de produits</h6>
                                    <p className="mb-0">{products.length} produits</p>
                                </div>
                            </div>
                        </div>

                        {/* Service client disponible 6/7j à votre service | Ouverture de 9H à 16H */}
                        <div className="col-md-4">
                            <div className="d-flex align-items-center justify-content-center">
                                <img
                                    src="src/costumer.png"
                                    alt="Customer Service"
                                    className="me-2"
                                    style={{ width: "130px", height: "130px" }}
                                />
                                <div>
                                    <h6 className="mb-0">Service client disponible</h6>
                                    <p className="mb-0">6/7j à votre service | Ouverture de 9H à 16H</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
          </div>
           );
              })}
            


            <footer className="footer" style={{ marginRight: '-130px' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-4"></div>
                        <div className="col-md-4">
                            <h5>🛍️ Quick Links</h5>
                            <ul className="list-unstyled">
                                <li><a href="#">Home</a></li>
                                <li><a href="#">Shop</a></li>
                                <li><a href="#">Contact Us</a></li>
                            </ul>
                        </div>
                        <div className="col-md-4 text-end">
                            <h5>💡 About Us</h5>
                            <p>Your one-stop shop for the best deals!</p>
                            <p className="mt-3">&copy; {new Date().getFullYear()} E-Shop. All Rights Reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default ClientShop;