import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Analytics = ({ totalProducts, totalOrders, totalUsers }) => {
    // Sample data for the chart
    const data = [
        { name: "Products", value: totalProducts },
        { name: "Orders", value: totalOrders },
        { name: "Users", value: totalUsers },
    ];

    return (
        <div className="container mt-4">
            <h2>Analytics</h2>
            <div className="row">
                <div className="col-md-8">
                    <div className="card shadow-sm p-3">
                        <h5 className="card-title">📊 Key Metrics</h5>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm p-3">
                        <h5 className="card-title">📈 Quick Stats</h5>
                        <ul className="list-group">
                            <li className="list-group-item">Total Products: {totalProducts}</li>
                            <li className="list-group-item">Total Orders: {totalOrders}</li>
                            <li className="list-group-item">Total Users: {totalUsers}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;