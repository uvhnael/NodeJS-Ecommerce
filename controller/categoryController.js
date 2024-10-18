import Category from "../model/mysql/categoryModel.js";

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.getAll();
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
}

