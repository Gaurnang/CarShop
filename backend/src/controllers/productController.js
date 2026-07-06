import {
  addProduct,
  editProduct,
  fetchProduct,
  fetchProducts,
  removeProduct,
} from "../services/productService.js";

export const create = async (req, res) => {
  try {

    const {
      name,
      description,
      price,
      imageUrl,
    } = req.body;

    const product =
      await addProduct(
        name,
        description,
        price,
        imageUrl
      );

    res.status(201).json({
      success: true,
      data: product,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

export const getAll = async (req, res) => {
  try {

    const products =
      await fetchProducts();

    res.json({
      success: true,
      data: products,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getOne = async (req, res) => {
  try {

    const product =
      await fetchProduct(
        req.params.id
      );

    res.json({
      success: true,
      data: product,
    });

  } catch (error) {

    res.status(404).json({
      success: false,
      message: error.message,
    });

  }
};

export const update = async (req, res) => {
  try {

    const {
      name,
      description,
      price,
      imageUrl,
      isActive,
    } = req.body;

    const product =
      await editProduct(
        req.params.id,
        name,
        description,
        price,
        imageUrl,
        isActive
      );

    res.json({
      success: true,
      data: product,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

export const remove = async (req, res) => {
  try {

    await removeProduct(
      req.params.id
    );

    res.json({
      success: true,
      message:
        "Product deleted successfully",
    });

  } catch (error) {

    res.status(404).json({
      success: false,
      message: error.message,
    });

  }
};