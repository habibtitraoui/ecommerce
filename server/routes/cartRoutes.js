import express from "express";
import Cart from "../models/cart.js";

const router = express.Router();

router.post("/add", async (req, res) => {
    try {
        const { product, name, phone, deliveryType, city, street, totalPrice } = req.body;

        // Validate required fields for domicile delivery
        if (deliveryType === "domicile" && (!city )) {
            return res.status(400).json({ message: "City and Street are required for domicile delivery." });
        }

        // Create a new cart item
        const newCartItem = new Cart({ product, name, phone, deliveryType, city, street, totalPrice });
        await newCartItem.save();

        res.status(201).json({ message: "Product added to cart successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error adding to cart", error });
    }
});

// 🟢 جلب عدد المستخدمين الذين قاموا بالشراء
router.get("/total-users", async (req, res) => {
    try {
        const uniqueUsers = await Cart.aggregate([
            { $match: { name: { $exists: true, $ne: "" } }}, // Filter out documents with missing/empty names
            { $group: { _id: "$name" } }, // Group by the `name` field
            { $count: "totalUsers" } // Count the number of unique users
        ]);

        // If no users are found, return 0
        const totalUsers = uniqueUsers.length > 0 ? uniqueUsers[0].totalUsers : 0;

        res.status(200).json({ totalUsers });
    } catch (error) {
        console.error("❌ خطأ في جلب عدد المستخدمين:", error);
        res.status(500).json({ error: "حدث خطأ أثناء جلب عدد المستخدمين." });
    }
});
// 🟢 جلب المنتجات الأكثر مبيعًا
router.get("/most-sold", async (req, res) => {
    try {
        const mostSoldProducts = await Cart.aggregate([
            { $group: { _id: "$product", count: { $sum: 1 } } }, // تجميع عدد الطلبات لكل منتج
            { $sort: { count: -1 } }, // ترتيب تنازلي حسب العدد
            { $limit: 5 }, // جلب أفضل 5 منتجات
            {
                $lookup: {
                    from: "products", // اسم مجموعة المنتجات في قاعدة البيانات
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
            { $unwind: "$productDetails" }, // تفكيك مصفوفة المنتج
            {
                $project: {
                    _id: 0,
                    productId: "$_id",
                    name: "$productDetails.name",
                    image: "$productDetails.image",
                    price: "$productDetails.price",
                    count: 1, // عدد مرات الطلب
                },
            },
        ]);
        res.status(200).json(mostSoldProducts);
    } catch (error) {
        console.error("❌ خطأ في جلب المنتجات الأكثر مبيعًا:", error);
        res.status(500).json({ error: "حدث خطأ أثناء جلب المنتجات الأكثر مبيعًا." });
    }
});
// 🟢 جلب عدد الطلبات الكلي
router.get("/total-orders", async (req, res) => {
    try {
        const totalOrders = await Cart.countDocuments();
        res.status(200).json({ totalOrders });
    } catch (error) {
        console.error("❌ خطأ في جلب عدد الطلبات:", error);
        res.status(500).json({ error: "حدث خطأ أثناء جلب عدد الطلبات." });
    }
});
// 🟢 جلب جميع الطلبات مع معلومات العملاء والمنتجات
router.get("/clients", async (req, res) => {
    try {
        const clients = await Cart.find()
            .populate("product") // جلب معلومات المنتج من الـ Product model
            .sort({ createdAt: -1 }); // ترتيب تنازلي حسب تاريخ الطلب

        res.status(200).json({ clients });
    } catch (error) {
        console.error("❌ Error fetching client orders:", error);
        res.status(500).json({ message: "Error fetching client orders", error });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Client deleted successfully" });
    } catch (error) {
        console.error("Error deleting client:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



export default router;