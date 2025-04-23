import { useState, useEffect } from "react";
import axios from "axios";

function ClientOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/cart/clients");
            setOrders(response.data.clients);
        } catch (err) {
            setError("❌ Error fetching orders.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            try {
                await axios.delete(`http://localhost:5000/api/cart/${id}`);
                setOrders(orders.filter(order => order._id !== id));
            } catch (err) {
                console.error("Delete failed:", err);
            }
        }
    };

    const handleConfirm = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/cart/confirm/${id}`);
            fetchOrders();
        } catch (err) {
            console.error("Confirm failed:", err);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg border-0">
                <div className="card-body">
                    <h2 className="text-center mb-4">📦 All Client Orders</h2>

                    {loading && <div className="text-center text-secondary">⏳ Loading orders...</div>}
                    {error && <div className="alert alert-danger text-center">{error}</div>}

                    {!loading && orders.length === 0 && (
                        <p className="text-center text-muted">No orders found.</p>
                    )}

                    {orders.length > 0 && (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover align-middle">
                                <thead className="table-dark">
                                    <tr>
                                        <th>#</th>
                                        <th>Client</th>
                                        <th>Phone</th>
                                        <th>Delivery</th>
                                        <th>City</th>
                                        <th>Street</th>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, index) => (
                                        <tr key={order._id}>
                                            <td>{index + 1}</td>
                                            <td>{order.name}</td>
                                            <td>{order.phone}</td>
                                            <td>
                                                <span className="badge bg-primary">
                                                    {order.deliveryType}
                                                </span>
                                            </td>
                                            <td>{order.city || "-"}</td>
                                            <td>{order.street || "-"}</td>
                                            <td>{order.product?.name || "Unknown"}</td>
                                            <td>${order.product?.price?.toFixed(2) || "0.00"}</td>
                                            <td><strong>${order.totalPrice?.toFixed(2)}</strong></td>
                                            <td className="text-nowrap">
                                                {new Date(order.createdAt).toLocaleString()}
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button
                                                        className="btn btn-outline-success btn-sm"
                                                        onClick={() => handleConfirm(order._id)}
                                                    >
                                                        ✅ Confirm
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => handleDelete(order._id)}
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ClientOrders;
