import {
  createVariant,
  deleteVariant,
  getAllVariants,
  getVariantById,
  getVariantByNameAndModel,
  getVariantsByModel,
  updateVariant,
} from "../repositories/variantRepository.js";

import { getModelById } from "../repositories/modelRepository.js";

export const addVariant = async (
  name,
  modelId
) => {

  const model =
    await getModelById(modelId);

  if (!model) {
    throw new Error("Model not found");
  }

  const existingVariant =
    await getVariantByNameAndModel(
      name,
      modelId
    );

  if (existingVariant) {
    throw new Error(
      "Variant already exists for this model"
    );
  }

  return await createVariant(
    name,
    modelId
  );
};

export const fetchVariants = async () => {
  return await getAllVariants();
};

export const fetchVariant = async (id) => {

  const variant =
    await getVariantById(id);

  if (!variant) {
    throw new Error("Variant not found");
  }

  return variant;
};

export const fetchVariantsByModel = async (
  modelId
) => {

  return await getVariantsByModel(
    modelId
  );
};

export const editVariant = async (
  id,
  name,
  modelId
) => {

  const variant =
    await getVariantById(id);

  if (!variant) {
    throw new Error("Variant not found");
  }

  const model =
    await getModelById(modelId);

  if (!model) {
    throw new Error("Model not found");
  }

  const existingVariant =
    await getVariantByNameAndModel(
      name,
      modelId
    );

  if (
    existingVariant &&
    existingVariant.id !== Number(id)
  ) {
    throw new Error(
      "Variant already exists for this model"
    );
  }

  return await updateVariant(
    id,
    name,
    modelId
  );
};

export const removeVariant = async (
  id
) => {

  const variant =
    await getVariantById(id);

  if (!variant) {
    throw new Error("Variant not found");
  }

  await deleteVariant(id);

};