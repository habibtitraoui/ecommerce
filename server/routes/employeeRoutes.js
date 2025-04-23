const express = require("express");
const EmployeeModel = require("../models/employee");
const router = express.Router();

// 🟢 جلب بيانات الموظف
router.get("/profile/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const employee = await EmployeeModel.findOne({ email });

        if (!employee) {
            return res.status(404).json({ error: "❌ Employee not found." });
        }

        res.status(200).json(employee);
    } catch (error) {
        console.error("❌ Error fetching employee profile:", error);
        res.status(500).json({ error: "حدث خطأ أثناء جلب بيانات الموظف." });
    }
});
// 🟢 تحديث بيانات الموظف
router.put("/profile/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const { newEmail, newPassword } = req.body;

        const employee = await EmployeeModel.findOne({ email });

        if (!employee) {
            return res.status(404).json({ error: "❌ Employee not found." });
        }

        // تحديث البريد الإلكتروني وكلمة المرور
        if (newEmail) employee.email = newEmail;
        if (newPassword) employee.password = newPassword;

        await employee.save();

        res.status(200).json({ message: "✅ Profile updated successfully!", employee });
    } catch (error) {
        console.error("❌ Error updating employee profile:", error);
        res.status(500).json({ error: "حدث خطأ أثناء تحديث بيانات الموظف." });
    }
});