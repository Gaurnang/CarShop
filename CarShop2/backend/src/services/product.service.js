import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../repositories/product.repository.js";

import { uploadImage } from "./cloudinary.service.js";
import {updateProductImage} from "../repositories/product.repository.js";

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

const uploadProductImage =  async (
    productId,
    file
  ) => {

    const result =
      await uploadImage(
        file.buffer
      );

    return await updateProductImage(
      productId,
      result.secure_url
    );
  };
export {
  fetchProducts,
  fetchProductById,
  addProduct,
  updateProductById,
  removeProduct,
  uploadProductImage,
};  
