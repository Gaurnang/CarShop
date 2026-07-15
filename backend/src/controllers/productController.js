import {
  addProduct,
  editProduct,
  fetchProduct,
  fetchProducts,
  removeProduct,
} from "../services/productService.js";

import * as productImageService from "../services/productImageService.js";

export const create = async (req, res) => {
  try {

    const {
      name,
      description,
      price,
      categoryId
    } = req.body;

    const product =
      await addProduct(
        name,
        description,
        price,
        categoryId
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

    const results =
      await fetchProducts(req.query);

    res.json({
      success: true,
      data: results.products,
      pagination : results.pagination
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

export const uploadProductImages = async (
    req,
    res
) => {

    try {

        const images =
            await productImageService.uploadProductImages(

                req.params.id,

                req.files

            );

        res.status(201).json({

            success: true,

            data: images

        });

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};