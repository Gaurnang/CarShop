import {
  addProduct,
  editProduct,
  fetchProduct,
  fetchProducts,
  removeProduct,
  uploadProductImageService,
  removeProductImageService,
} from "../services/productService.js";

export const create = async (req, res) => {
  try {
    const { name, description, price, categoryId, imageUrl } = req.body;

    const product = await addProduct(
      name,
      description,
      price,
      categoryId,
      imageUrl
    );

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const results = await fetchProducts(req.query);

    res.json({
      success: true,
      data: results.products,
      pagination: results.pagination,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const product = await fetchProduct(req.params.id);
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { name, description, price, imageUrl, isActive } = req.body;

    const product = await editProduct(
      req.params.id,
      name,
      description,
      price,
      imageUrl,
      isActive
    );

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    await removeProduct(req.params.id);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const uploadProductImage = async (req, res) => {
  try {
    const file = req.file || (req.files && req.files[0]);

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "No image file provided" });
    }

    const image = await uploadProductImageService(req.params.id, file);

    res.status(200).json({ success: true, data: image });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const removeImage = async (req, res) => {
  try {
    await removeProductImageService(req.params.id);
    res.json({ success: true, message: "Product image removed successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};