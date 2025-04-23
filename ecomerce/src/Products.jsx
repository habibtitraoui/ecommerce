import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Products() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products for search
    const [searchQuery, setSearchQuery] = useState(""); // Search query
    const [editingProduct, setEditingProduct] = useState(null);
    const [updatedProduct, setUpdatedProduct] = useState({ name: "", price: "", description: "", promotion: "" });
    const [productToDelete, setProductToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
    const productsPerPage = 10; // Number of products per page

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        axios.get("http://localhost:5000/api/products/all")
            .then(response => {
                setProducts(response.data);
                setFilteredProducts(response.data); // Initialize filtered products
            })
            .catch(error => console.error("Error fetching products:", error));
    };

    // Handle search input change
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        // Filter products by name
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(query)
        );
        setFilteredProducts(filtered);
        setCurrentPage(1); // Reset to the first page after search
    };

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const confirmDelete = (id) => {
        setProductToDelete(id);
    };

    const handleDelete = async () => {
        if (productToDelete) {
            try {
                await axios.delete(`http://localhost:5000/api/products/${productToDelete}`);
                fetchProducts();
            } catch (error) {
                console.error("Error deleting product:", error);
            }
            setProductToDelete(null);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setUpdatedProduct({ name: product.name, price: product.price, description: product.description, promotion: product.promotion });
    };

    const handleChange = (e) => {
        setUpdatedProduct({ ...updatedProduct, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, updatedProduct);
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    // Toggle product visibility
    const toggleVisibility = async (id, currentVisibility) => {
        try {
            await axios.put(`http://localhost:5000/api/products/${id}`, { visible: !currentVisibility });
            fetchProducts();
        } catch (error) {
            console.error("Error updating product visibility:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Product List</h2>

            {/* Search Bar */}
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search products by name..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Promotion</th>
                        <th>Image</th>
                        <th>Date</th>
                        <th>Visible</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.length > 0 ? (
                        currentProducts.map((product, index) => (
                            <tr key={index}>
                                <td>{product.name}</td>
                                <td>${product.price}</td>
                                <td>{product.description}</td>
                                <td>{product.promotion}%</td>
                                <td>
                                    {product.image ? (
                                        <img src={`http://localhost:5000${product.image}`} alt={product.name} width="50" />
                                    ) : (
                                        "No Image"
                                    )}
                                </td>
                                <td>{new Date(product.date).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className={`btn btn-sm ${product.visible ? "btn-success" : "btn-secondary"}`}
                                        onClick={() => toggleVisibility(product._id, product.visible)}
                                    >
                                        {product.visible ? "Visible" : "Hidden"}
                                    </button>
                                </td>
                                <td>
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(product)} data-bs-toggle="modal" data-bs-target="#editModal">
                                        Edit
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(product._id)} data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">No products available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <nav>
                <ul className="pagination">
                    {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => (
                        <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                            <button className="page-link" onClick={() => paginate(i + 1)}>
                                {i + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Edit Product Modal */}
            <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editModalLabel">Edit Product</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Name:</label>
                                <input type="text" name="name" className="form-control" value={updatedProduct.name} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Price:</label>
                                <input type="number" name="price" className="form-control" value={updatedProduct.price} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description:</label>
                                <input type="text" name="description" className="form-control" value={updatedProduct.description} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Promotion (%):</label>
                                <input type="number" name="promotion" className="form-control" value={updatedProduct.promotion} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={handleUpdate} data-bs-dismiss="modal">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete this product?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-danger" onClick={handleDelete} data-bs-dismiss="modal">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Products;