import { useState, useRef } from "react";
import axios from "axios";

function AddProduct({ onBack = () => {} }) {
    const [product, setProduct] = useState({
        name: "",
        price: "",
        description: "",
        promotion: "",
        image: "",
        category: "bocsh", // ✅ Default category
        date: new Date().toISOString().split("T")[0],
        visible: true, // ✅ Matches database schema
    });

    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null); // ✅ Corrected useRef for file input

    // 🟢 Available categories list
    const categories = ["bocsh", "crown", "Honestpro", "sofeclef", "Tolson" , "Total", "emtop", "ingco"];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (product.name && product.price && product.description && imageFile) {
            try {
                const formData = new FormData();
                formData.append("image", imageFile);

                // 🟢 Upload image to server
                const uploadRes = await axios.post("http://localhost:5000/api/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if (uploadRes.data.imagePath) {
                    const productData = { 
                        ...product, 
                        image: uploadRes.data.imagePath,
                    };

                    // 🟢 Send product data to server
                    const res = await axios.post("http://localhost:5000/api/products/add", productData);
                    alert("✅ Product added successfully!");
                    console.log(res.data);
                    onBack();
                } else {
                    alert("❌ Image upload failed");
                }
            } catch (error) {
                alert("❌ Error adding product");
                console.error(error);
            }
        } else {
            alert("❌ Please fill all fields.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg p-4">
                <h2 className="text-center mb-4">🛒 Add New Product</h2>
                <form onSubmit={handleAddProduct}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Product Name</label>
                        <input type="text" className="form-control" value={product.name}
                            onChange={(e) => setProduct({ ...product, name: e.target.value })} required />
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Price ($)</label>
                            <input type="number" className="form-control" value={product.price}
                                onChange={(e) => setProduct({ ...product, price: e.target.value })} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Promotion (%)</label>
                            <input type="number" className="form-control" value={product.promotion}
                                onChange={(e) => setProduct({ ...product, promotion: e.target.value })} />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Description</label>
                        <textarea className="form-control" rows="3" value={product.description}
                            onChange={(e) => setProduct({ ...product, description: e.target.value })} required />
                    </div>
                    {/* ✅ Category selection */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Category</label>
                        <select className="form-select" value={product.category} 
                            onChange={(e) => setProduct({ ...product, category: e.target.value })} required>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Product Image</label>
                        <div className="d-flex align-items-center">
                            <input type="file" className="d-none" ref={fileInputRef} onChange={handleFileChange} required />
                            <button type="button" className="btn btn-primary me-3" onClick={() => fileInputRef.current.click()}>
                                📷 Select Image
                            </button>
                            {preview && <img src={preview} alt="Preview" className="img-thumbnail" width="100" />}
                        </div>
                    </div>
                    {/* ✅ "Visible" option */}
                    <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" 
                            checked={product.visible} 
                            onChange={(e) => setProduct({ ...product, visible: e.target.checked })} 
                        />
                        <label className="form-check-label fw-bold">Visible</label>
                    </div>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button type="submit" className="btn btn-success px-4">✅ Add Product</button>
                        <button type="button" className="btn btn-secondary px-4" onClick={onBack}>❌ Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProduct;
