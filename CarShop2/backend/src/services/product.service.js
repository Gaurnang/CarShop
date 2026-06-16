import {
  getProducts,
  getProductById,
  createProduct,
} from "../repositories/product.repository.js";

const fetchProducts = async () => {
  return await getProducts();
};

const fetchProductById = async (id) => {
  return await getProductById(id);
};

const addProduct = async (productData) => {
  return await createProduct(productData);
};

export {
  fetchProducts,
  fetchProductById,
  addProduct,
};