import {
  addCompatibility,
  getCompatibilityByProductId,
} from "../repositories/productCompatibility.repository.js";

const createCompatibility = async (
  productId,
  variantIds
) => {
  return await addCompatibility(
    productId,
    variantIds
  );
};

const fetchCompatibility = async (
  productId
) => {
  return await getCompatibilityByProductId(
    productId
  );
};

export {
  createCompatibility,
  fetchCompatibility,
};