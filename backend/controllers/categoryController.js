const db = require("../db");

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, category FROM categories WHERE "isDelete" = FALSE ORDER BY category'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'SELECT id, category FROM categories WHERE id = $1 AND "isDelete" = FALSE',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new category
const createCategory = async (req, res) => {
  const { category } = req.body;

  if (!category) {
    return res.status(400).json({ message: "Category name is required" });
  }

  try {
    // Check if category already exists
    const checkResult = await db.query(
      'SELECT id FROM categories WHERE category = $1 AND "isDelete" = FALSE',
      [category]
    );

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const result = await db.query(
      "INSERT INTO categories (category) VALUES ($1) RETURNING id, category",
      [category]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { category } = req.body;

  if (!category) {
    return res.status(400).json({ message: "Category name is required" });
  }

  try {
    // Check if new category name already exists
    const checkResult = await db.query(
      'SELECT id FROM categories WHERE category = $1 AND id != $2 AND "isDelete" = FALSE',
      [category, id]
    );

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const result = await db.query(
      'UPDATE categories SET category = $1, "modifiedTime" = NOW() WHERE id = $2 AND "isDelete" = FALSE RETURNING id, category',
      [category, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a category (soft delete)
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if category is in use by any events
    const checkResult = await db.query(
      'SELECT COUNT(*) FROM events WHERE "categoryId" = $1 AND "isDelete" = FALSE',
      [id]
    );

    if (parseInt(checkResult.rows[0].count) > 0) {
      return res.status(400).json({
        message: "Cannot delete category as it is being used by events",
      });
    }

    const result = await db.query(
      'UPDATE categories SET "isDelete" = TRUE, "modifiedTime" = NOW() WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
