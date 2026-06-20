import {
  fetchProducts,
  fetchProductById,
  addProduct,
  updateProductById,
  removeProduct,
} from "../services/product.service.js";

import {uploadProductImage} from "../services/product.service.js";

const getProducts = async (req, res) => {
  try {
    const products = await fetchProducts();

    res.status(200).json({
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

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product =
      await fetchProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const product =
      await addProduct(req.body);

    res.status(201).json({
      success: true,
      data: product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProduct = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    const product =
      await updateProductById(
        id,
        req.body
      );

    res.status(200).json({
      success: true,
      data: product,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const deleteProduct = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    const product =
      await removeProduct(id);

    res.status(200).json({
      success: true,
      data: product,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const uploadImage = async (
    req,
    res
  ) => {

    try {

      const product =
        await uploadProductImage(
          req.params.id,
          req.file
        );

      res.status(200).json({
        success: true,
        data: product,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};