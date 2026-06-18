import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
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

const updateProductById = async ( id, productData ) => {
  return await updateProduct(id, productData);
};

const removeProduct = async (id) => {
  return await deleteProduct(id);
};

export {
  fetchProducts,
  fetchProductById,
  addProduct,
  updateProductById,
  removeProduct
};  
