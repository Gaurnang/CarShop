import {
  addCompatibility,
  getCompatibilityByProductId,
  removeCompatibility,
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

const deleteCompatibility =
  async (
    productId,
    variantId
  ) => {

    return await removeCompatibility(
      productId,
      variantId
    );

  };

export {
  createCompatibility,
  fetchCompatibility,
  deleteCompatibility
};