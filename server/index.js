import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer"; // 🟢 إضافة multer
import path from "path";
import fs from "fs";
import cartRoutes from "./routes/cartRoutes.js";
import ProductRoutes from "./routes/productRoutes.js"; // Updated to ES Modules
import EmployeeModel from "./models/employee.js"; // Updated to ES Modules

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'))); // ✅ التأكد من أن الصور متاحة بشكل صحيح

// ✅ اتصال مع قاعدة البيانات
mongoose.connect('mongodb+srv://haytpeer:haithem123@cluster0.jb7na.mongodb.net/employee')
    .then(() => {
        console.log("✅ Connected to MongoDB");
    })
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
    });

// ✅ إعداد multer لحفظ الصور في مجلد "uploads"
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), 'uploads'); // التأكد من أن المسار صحيح
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // إعادة تسمية الملف
    }
});
const upload = multer({ storage });

// ✅ API لرفع الصور
app.post("/api/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "❌ No file uploaded" });
    }
    res.json({ imagePath: `/uploads/${req.file.filename}` }); // ✅ استخدام القوس الصحيح في Template Literal
});

// ✅ API للمنتجات
app.use("/api/products", ProductRoutes);
app.use("/api/cart", cartRoutes);

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await EmployeeModel.findOne({ email: email });

        if (user) {
            if (user.password === password) {
                return res.json("success");
            } else {
                return res.json("error");
            }
        } else {
            return res.json("noUser");
        }
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json("serverError");
    }
});

// ✅ تشغيل السيرفر
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));