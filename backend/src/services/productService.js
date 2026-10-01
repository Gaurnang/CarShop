import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductById,
  getProductByName,
  updateProduct,
  updateProductImage,
  deleteProductImage,
  countProducts
} from "../repositories/productRepository.js";

import {
  getCategoryById
} from "../repositories/categoryRepository.js";

import { uploadImage } from "./cloudinaryService.js";
import cloudinary from "../config/cloudinary.js";

// ─── PRODUCT CRUD ─────────────────────────────────────────────────────────────

export const addProduct = async (
  name,
  description,
  price,
  categoryId,
  imageUrl = null,
  imagePublicId = null
) => {
  const existing = await getProductByName(name);

  if (existing) {
    throw new Error("Product already exists");
  }

  if (!categoryId) {
    throw new Error("Category is required");
  }

  const checkCategory = await getCategoryById(categoryId);

  if (!checkCategory) {
    throw new Error("Category not found");
  }

  return await createProduct(
    name,
    description,
    price,
    categoryId,
    imageUrl,
    imagePublicId
  );
};

export const fetchProducts = async (filters) => {
  const products = await getProducts(filters);
  const total = await countProducts(filters);
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 10;
  const totalPages = Math.ceil(total / limit);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
  };
};

export const fetchProduct = async (id) => {
  const product = await getProductById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

export const editProduct = async (
  id,
  name,
  description,
  price,
  imageUrl,
  isActive,
  imagePublicId
) => {
  const product = await getProductById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  const existing = await getProductByName(name);

  if (existing && existing.id !== Number(id)) {
    throw new Error("Product already exists");
  }

  return await updateProduct(
    id,
    name,
    description,
    price,
    isActive,
    imageUrl,
    imagePublicId
  );
};

export const removeProduct = async (id) => {
  const product = await getProductById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  // Clean up Cloudinary image before deleting
  if (product.image_public_id) {
    try {
      await cloudinary.uploader.destroy(product.image_public_id);
    } catch (err) {
      console.error("Cloudinary cleanup error:", err.message);
    }
  }

  await deleteProduct(id);
};

// ─── PRODUCT IMAGE ─────────────────────────────────────────────────────────────

export const uploadProductImageService = async (productId, file) => {
  const product = await getProductById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (!file) {
    throw new Error("No image file provided");
  }

  // Delete old Cloudinary image if present
  if (product.image_public_id) {
    try {
      await cloudinary.uploader.destroy(product.image_public_id);
    } catch (err) {
      console.error("Cloudinary cleanup error:", err.message);
    }
  }

  const result = await uploadImage(file.buffer);

  const updated = await updateProductImage(
    productId,
    result.secure_url,
    result.public_id
  );

  return {
    id: updated.id,
    productId: updated.id,
    imageUrl: result.secure_url,
    image_url: result.secure_url,
    publicId: result.public_id,
  };
};

export const removeProductImageService = async (productId) => {
  const product = await getProductById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.image_public_id) {
    try {
      await cloudinary.uploader.destroy(product.image_public_id);
    } catch (err) {
      console.error("Cloudinary cleanup error:", err.message);
    }
  }

  return await deleteProductImage(productId);
};