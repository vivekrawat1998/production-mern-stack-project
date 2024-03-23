const { default: slugify } = require("slugify");
const CategoryModel = require("../models/CategoryModel");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).send({ success: false, message: "Name is required" });
    }

    const existingCategory = await CategoryModel.findOne({ name });

    if (existingCategory) {
      return res.status(409).send({ success: false, message: "Category already exists" });
    }

    const category = await new CategoryModel({ name, slug: slugify(name) }).save();

    res.status(200).send({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in creating category",
      error: error.message,
    });
  }
};


exports.UpdateCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
  
      const updatedCategory = await CategoryModel.findByIdAndUpdate(
        id,
        { name, slug: slugify(name) },
        { new: true } 
      );
  
      if (!updatedCategory) {
        return res.status(404).send({
          success: false,
          message: "Category not found",
        });
      }
  
      res.status(200).send({
        success: true,
        message: "Category updated successfully",
        updatedCategory,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error updating category",
        error: error.message,
      });
    }
  };
  

exports.GetAllCategory = async (req, res) => {
  try {
    const getall = await CategoryModel.find({});
    res.status(200).send({
      success: true,
      messsage: "all category",
      getall,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      messsage: "error for getall category",
      error,
    });
  }
};

exports.SingleCategory = async (req, res) => {
  try {
    const {slug} =req.params
    const single = await CategoryModel.findOne({ slug });
    res.status(200).send({
      success: true,
      messsage: "get single category successfully",
      single,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      messsage: "error for get single category",
      error,
    });
  }
};

exports.DeleteCategory = async (req, res) => {
  try {
    const {id} = req.params
    await CategoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      messsage: "category deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      messsage: "error in  delete category",
      error,
    });
  }
};
