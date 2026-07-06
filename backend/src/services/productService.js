import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductByName,
  updateProduct,
} from "../repositories/productRepository.js";

export const addProduct = async (
  name,
  description,
  price,
  imageUrl
) => {
  const existing =
    await getProductByName(name);

  if (existing) {
    throw new Error("Product already exists");
  }

  return await createProduct(
    name,
    description,
    price,
    imageUrl
  );
};

export const fetchProducts = async () => {
  return await getAllProducts();
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