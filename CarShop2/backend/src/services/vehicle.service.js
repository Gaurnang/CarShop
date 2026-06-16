import {
  getBrands,
  getModelsByBrandId,
  getVariantsByModelId,
} from "../repositories/vehicle.repository.js";

const fetchBrands = async () => {
  return await getBrands();
};

const fetchModelsByBrandId = async (brandId) => {
  return await getModelsByBrandId(brandId);
};

const fetchVariantsByModelId = async (modelId) => {
  return await getVariantsByModelId(modelId);
};

export { fetchBrands, fetchModelsByBrandId, fetchVariantsByModelId };