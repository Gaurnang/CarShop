import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrandById,
  getBrandByName,
  updateBrand,
} from "../repositories/brandRepository.js";

export const addBrand = async (name) => {
  const existingBrand = await getBrandByName(name);

  if (existingBrand) {
    throw new Error("Brand already exists");
  }

  return await createBrand(name);
};

export const fetchBrands = async () => {
  return await getAllBrands();
};

export const fetchBrand = async (id) => {
  const brand = await getBrandById(id);

  if (!brand) {
    throw new Error("Brand not found");
  }

  return brand;
};

export const editBrand = async (id, name) => {
  const brand = await getBrandById(id);

  if (!brand) {
    throw new Error("Brand not found");
  }

  const existingBrand = await getBrandByName(name);

  if (existingBrand && existingBrand.id !== Number(id)) {
    throw new Error("Brand already exists");
  }

  return await updateBrand(id, name);
};

export const removeBrand = async (id) => {
  const brand = await getBrandById(id);

  if (!brand) {
    throw new Error("Brand not found");
  }

  await deleteBrand(id);
};