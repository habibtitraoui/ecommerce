import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Products from "./Products";
import Profile from "./profile";
import Analytics from "./Analytics";
import Settings from "./Settings";
import AddProduct from "./AddProduct";
import ClientOrders from "../ClientOrders";


function Dashboard() {
    const [user, setUser] = useState(null);
    const [view, setView] = useState("dashboard");
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [mostRatedProducts, setMostRatedProducts] = useState([]);
    const [mostSoldProducts, setMostSoldProducts] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("userLoggedIn");

        if (!isLoggedIn) {
            console.log("User not logged in, redirecting...");
            window.location.href = "/login";
        } else {
            setUser({ name: "Admin", email: "admin@example.com", role: "Administrator" });
            fetchDashboardData();
        }
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const productsResponse = await axios.get("http://localhost:5000/api/products/total-products");
            setTotalProducts(productsResponse.data.totalProducts);

            const ordersResponse = await axios.get("http://localhost:5000/api/cart/total-orders");
            setTotalOrders(ordersResponse.data.totalOrders);

            const mostRatedResponse = await axios.get("http://localhost:5000/api/products/most-rated");
            setMostRatedProducts(mostRatedResponse.data);

            const mostSoldResponse = await axios.get("http://localhost:5000/api/cart/most-sold");
            setMostSoldProducts(mostSoldResponse.data);

            const usersResponse = await axios.get("http://localhost:5000/api/cart/total-users");
            setTotalUsers(usersResponse.data.totalUsers);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Sidebar */}
                <nav className="col-md-3 col-lg-2 d-md-block bg-dark sidebar text-white min-vh-100 p-3">
                    <h2 className="text-center">Dashboard</h2>
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <button className="btn btn-link text-white nav-link" onClick={() => setView("dashboard")}>🏠 Home</button>
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-link text-white nav-link" onClick={() => setView("profile")}>👤 Profile</button>
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-link text-white nav-link" onClick={() => setView("products")}>📦 Products</button>
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-link text-white nav-link" onClick={() => setView("analytics")}>📊 Analytics</button>
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-link text-white nav-link" onClick={() => setView("settings")}>⚙️ Settings</button>
                        </li>
                        <li className="nav-item">
    <button className="btn btn-link text-white nav-link" onClick={() => setView("clients")}>🧾 Clients</button>
</li>
                        <li className="nav-item mt-3">
                            <button className="btn btn-primary w-100" onClick={() => setView("addProduct")}>
                                ➕ Add Product
                            </button>
                        </li>
                     
                        <li className="nav-item mt-4">
                            <button
                                className="btn btn-danger w-100"
                                onClick={() => {
                                    localStorage.removeItem("userLoggedIn");
                                    window.location.href = "/login";
                                }}
                            >
                                🚪 Logout
                            </button>
                        </li>
                    </ul>
                </nav>

                {/* Main Content */}
                <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                    <div className="d-flex justify-content-between align-items-center mt-3 bg-light p-3 rounded shadow-sm">
                        <h2>Welcome, {user?.name || "User"} 👋</h2>
                        <span className="badge bg-primary">{user?.role}</span>
                    </div>

                    {/* Loading Spinner */}
                    {loading && (
                        <div className="text-center mt-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}

                    {/* Dashboard View */}
                    {!loading && view === "dashboard" && (
                        <div className="row mt-4">
                            <div className="col-md-3">
                                <div className="card shadow-sm p-3">
                                    <h5 className="card-title">📦 Total Products</h5>
                                    <p className="fs-4 fw-bold">{totalProducts}</p>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card shadow-sm p-3">
                                    <h5 className="card-title">🛒 Total Orders</h5>
                                    <p className="fs-4 fw-bold">{totalOrders}</p>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card shadow-sm p-3">
                                    <h5 className="card-title">👥 Total Users</h5>
                                    <p className="fs-4 fw-bold">{totalUsers}</p>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card shadow-sm p-3">
                                    <h5 className="card-title">💰 Revenue</h5>
                                    <p className="fs-4 fw-bold">$15,750</p>
                                </div>
                            </div>

                            {/* Most Rated Products */}
                            <div className="col-md-6 mt-4">
                                <div className="card shadow-sm p-3">
                                    <h5 className="card-title">⭐ Most Rated Products</h5>
                                    <ul className="list-group">
                                        {mostRatedProducts.map((product) => (
                                            <li key={product._id} className="list-group-item">
                                                {product.name} - Rating: {product.averageRating}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Most Sold Products */}
                            <div className="col-md-6 mt-4">
                                <div className="card shadow-sm p-3">
                                    <h5 className="card-title">🔥 Most Sold Products</h5>
                                    <ul className="list-group">
                                        {mostSoldProducts.map((product) => (
                                            <li key={product.productId} className="list-group-item">
                                                {product.name} - Sold: {product.count} times
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Profile View */}
                    {!loading && view === "profile" && <Profile email={user?.email} />}

                    {/* Products View */}
                    {!loading && view === "products" && <Products />}

                    {/* Analytics View */}
                    {!loading && view === "analytics" && (
                        <Analytics
                            totalProducts={totalProducts}
                            totalOrders={totalOrders}
                            totalUsers={totalUsers}
                        />
                    )}

                    {/* Settings View */}
                    {!loading && view === "settings" && <Settings />}
                    {!loading && view === "clients" && <ClientOrders />}


                    {/* Add Product View */}
                    {!loading && view === "addProduct" && <AddProduct onBack={() => setView("dashboard")} />}
                </main>
            </div>
        </div>
    );
}

export default Dashboard;