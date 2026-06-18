import {
  getBrands,
  getModelsByBrandId,
  getVariantsByModelId,
} from "../repositories/vehicle.repository.js";

import {
  createBrand,
  updateBrand,
  deleteBrand,

  createModel,
  updateModel,
  deleteModel,

  createVariant,
  updateVariant,
  deleteVariant,
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

const addBrand = async (name) => {
  return await createBrand(name);
};

const editBrand = async (
  brandId,
  name
) => {
  return await updateBrand(
    brandId,
    name
  );
};

const removeBrand = async (
  brandId
) => {
  return await deleteBrand(
    brandId
  );
};

const addModel = async (
  brandId,
  name
) => {

  return await createModel(
    brandId,
    name
  );

};

const editModel = async (
  modelId,
  name
) => {

  return await updateModel(
    modelId,
    name
  );

};

const removeModel = async (
  modelId
) => {

  return await deleteModel(
    modelId
  );

};

const addVariant = async (
  modelId,
  name
) => {

  return await createVariant(
    modelId,
    name
  );

};

const editVariant = async (
  variantId,
  name
) => {

  return await updateVariant(
    variantId,
    name
  );

};

const removeVariant = async (
  variantId
) => {

  return await deleteVariant(
    variantId
  );

};


export {
  fetchBrands,
  fetchModelsByBrandId,
  fetchVariantsByModelId,
  addBrand,
  editBrand,
  removeBrand,
  addModel,
  editModel,
  removeModel,
  addVariant,
  editVariant,
  removeVariant,
};