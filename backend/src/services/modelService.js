import {
  createModel,
  deleteModel,
  getAllModels,
  getModelById,
  getModelByNameAndBrand,
  getModelsByBrand,
  updateModel,
} from "../repositories/modelRepository.js";

import { getBrandById } from "../repositories/brandRepository.js";

export const addModel = async (
  name,
  brandId
) => {

  const brand = await getBrandById(brandId);

  if (!brand) {
    throw new Error("Brand not found");
  }

  const existingModel =
    await getModelByNameAndBrand(
      name,
      brandId
    );

  if (existingModel) {
    throw new Error(
      "Model already exists for this brand"
    );
  }

  return await createModel(
    name,
    brandId
  );
};

export const fetchModels = async () => {
  return await getAllModels();
};

export const fetchModel = async (id) => {

  const model =
    await getModelById(id);

  if (!model) {
    throw new Error("Model not found");
  }

  return model;
};

export const fetchModelsByBrand = async (
  brandId
) => {

  return await getModelsByBrand(
    brandId
  );
};

export const editModel = async (
  id,
  name,
  brandId
) => {

  const model =
    await getModelById(id);

  if (!model) {
    throw new Error("Model not found");
  }

  const brand =
    await getBrandById(brandId);

  if (!brand) {
    throw new Error("Brand not found");
  }

  const existingModel =
    await getModelByNameAndBrand(
      name,
      brandId
    );

  if (
    existingModel &&
    existingModel.id !== Number(id)
  ) {
    throw new Error(
      "Model already exists for this brand"
    );
  }

  return await updateModel(
    id,
    name,
    brandId
  );
};

export const removeModel = async (
  id
) => {

  const model =
    await getModelById(id);

  if (!model) {
    throw new Error("Model not found");
  }

  await deleteModel(id);

};