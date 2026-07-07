import {
  getCatalog,
  getCatalogBySavedCar,
} from "../repositories/catalogRepository.js";

import {
  getSavedCarById,
} from "../repositories/savedCarRepository.js";

export const fetchCatalog = async (
  userId
) => {

  return await getCatalog(userId);

};

export const fetchCatalogForCar = async (
  userId,
  savedCarId
) => {

  const car =
    await getSavedCarById(savedCarId);

  if (!car) {
    throw new Error("Saved car not found");
  }

  if (car.user_id !== userId) {
    throw new Error("Unauthorized");
  }

  return await getCatalogBySavedCar(
    userId,
    savedCarId
  );

};