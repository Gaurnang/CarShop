import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductById,
  getProductByName,
  updateProduct,
  countProducts
} from "../repositories/productRepository.js";

import {
  getCategoryById
} from "../repositories/categoryRepository.js"

export const addProduct = async (
  name,
  description,
  price,
  categoryId
) => {
  const existing =
    await getProductByName(name);

  if (existing) {
    throw new Error("Product already exists");
  }

  if(!categoryId) {
    throw new Error("Category is required");
  }

  const checkCategory = await getCategoryById(categoryId);

  if(!checkCategory) {
    throw new Error("Category not found");
  }
  
  
  return await createProduct(
    name,
    description,
    price,
    categoryId
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

            hasPrevious: page > 1

        }

    };

};

export const fetchProduct = async (id) => {
  const product =
    await getProductById(id);

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
  isActive
) => {
  const product =
    await getProductById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  const existing =
    await getProductByName(name);

  if (
    existing &&
    existing.id !== Number(id)
  ) {
    throw new Error("Product already exists");
  }

  return await updateProduct(
    id,
    name,
    description,
    price,
    imageUrl,
    isActive
  );
};

export const removeProduct = async (id) => {
  const product =
    await getProductById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  await deleteProduct(id);
};