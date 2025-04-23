const express = require("express");
const Product = require("../models/product");
const router = express.Router();



// 🟢 إضافة منتج جديد
router.post("/add", async (req, res) => {
    try {
        const { name, price, description, promotion, image, category, visible } = req.body;

        if (!name || price === undefined || !description || !image || !category) {
            return res.status(400).json({ error: "❌ جميع الحقول مطلوبة، بما في ذلك السعر!" });
        }

        const allowedCategories =["bocsh", "crown", "Honestpro", "sofeclef", "Tolson" , "Total", "emtop", "ingco"]
        if (!allowedCategories.includes(category)) {
            return res.status(400).json({ error: "❌ فئة غير صحيحة. استخدم: " + allowedCategories.join(", ") });
        }

        const newProduct = new Product({
            name,
            price,
            description,
            promotion: promotion || 0,
            image,
            category,
            visible: visible !== undefined ? visible : true,
            date: new Date()
        });

        await newProduct.save();
        res.status(201).json({ message: "✅ المنتج تمت إضافته بنجاح!", newProduct });

    } catch (error) {
        console.error("❌ خطأ في إضافة المنتج:", error);
        res.status(500).json({ error: "حدث خطأ أثناء إضافة المنتج." });
    }
});

// 🟢 جلب جميع المنتجات
router.get("/all", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error("❌ خطأ في جلب المنتجات:", error);
        res.status(500).json({ error: "حدث خطأ أثناء جلب المنتجات." });
    }
});
// 🟢 جلب جميع المنتجات في فئة معينة
router.get("/category/:category", async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category, visible: true }); // Fetch only visible products
        res.status(200).json(products);
    } catch (error) {
        console.error("❌ خطأ في جلب المنتجات:", error);
        res.status(500).json({ error: "حدث خطأ أثناء جلب المنتجات." });
    }
});


// 🟢 جلب عدد المنتجات الكلي
router.get("/total-products", async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        res.status(200).json({ totalProducts });
    } catch (error) {
        console.error("❌ خطأ في جلب عدد المنتجات:", error);
        res.status(500).json({ error: "حدث خطأ أثناء جلب عدد المنتجات." });
    }
});
// 🟢 جلب المنتجات الأعلى تقييمًا
router.get("/most-rated", async (req, res) => {
    try {
        const mostRatedProducts = await Product.find()
            .sort({ averageRating: -1 }) // ترتيب تنازلي حسب التقييم
            .limit(5); // جلب أفضل 5 منتجات
        res.status(200).json(mostRatedProducts);
    } catch (error) {
        console.error("❌ خطأ في جلب المنتجات الأعلى تقييمًا:", error);
        res.status(500).json({ error: "حدث خطأ أثناء جلب المنتجات الأعلى تقييمًا." });
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

// 🟢 تحديث منتج معين
router.put("/:id", async (req, res) => {
    try {
        const { name, price, description, promotion, visible } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, price, description, promotion, visible },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: "❌ المنتج غير موجود!" });
        }

        res.json({ message: "✅ المنتج تم تحديثه!", updatedProduct });
    } catch (error) {
        res.status(500).json({ error: "❌ حدث خطأ أثناء تحديث المنتج." });
    }
});


// 🟢 تقييم منتج معين
router.post("/:id/rate", async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "❌ Product not found" });
        }

        // ✅ إنشاء التقييم بدون `user`
        const newRating = { rating, comment };
        product.ratings.push(newRating);

        // ✅ تحديث متوسط التقييم
        const totalRatings = product.ratings.length;
        const avgRating = product.ratings.reduce((acc, r) => acc + r.rating, 0) / totalRatings;
        product.averageRating = avgRating.toFixed(1);

        await product.save();

        res.status(201).json({ message: "✅ Rating saved successfully!", product });
    } catch (error) {
        res.status(500).json({ message: "❌ Server error", error: error.message });
    }
});


router.put("/:id", async (req, res) => {
    try {
        const { name, price, description, promotion, visible } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, price, description, promotion, visible },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: "❌ المنتج غير موجود!" });
        }

        console.log("Updated product:", updatedProduct); // ✅ Log the updated product
        res.json({ message: "✅ المنتج تم تحديثه!", updatedProduct });
    } catch (error) {
        res.status(500).json({ error: "❌ حدث خطأ أثناء تحديث المنتج." });
    }
});




// 🔥 حذف المنتج
router.delete("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "❌ المنتج غير موجود!" });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "✅ المنتج تم حذفه بنجاح!" });
    } catch (error) {
        res.status(500).json({ error: "❌ حدث خطأ أثناء حذف المنتج." });
    }
});

module.exports = router;


































router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "❌ Server error", error: error.message });
    }
});

// ✅ إرجاع منتج معين عبر الـ ID
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "❌ Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "❌ Server error", error: error.message });
    }
});

module.exports = router;