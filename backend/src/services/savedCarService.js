import {
  deleteSavedCar,
  getSavedCar,
  getSavedCarById,
  getUserCars,
  saveCar,
  updateSavedCar,
} from "../repositories/savedCarRepository.js";

import {
  getVariantById,
} from "../repositories/variantRepository.js";

export const addSavedCar = async (
  userId,
  variantId,
  nickname
) => {

  const variant =
    await getVariantById(variantId);

  if (!variant) {
    throw new Error("Variant not found");
  }

  const existing =
    await getSavedCar(
      userId,
      variantId
    );

  if (existing) {
    throw new Error(
      "Vehicle already saved"
    );
  }

  return await saveCar(
    userId,
    variantId,
    nickname
  );
};

export const fetchUserCars = async (
  userId
) => {

  return await getUserCars(
    userId
  );

};

export const editSavedCar = async (
  userId,
  id,
  variantId,
  nickname
) => {

  const savedCar =
    await getSavedCarById(id);

  if (!savedCar) {
    throw new Error("Saved car not found");
  }

  if (savedCar.user_id !== userId) {
    throw new Error("Unauthorized");
  }

  const variant =
    await getVariantById(
      variantId
    );

  if (!variant) {
    throw new Error("Variant not found");
  }

  const duplicate =
    await getSavedCar(
      userId,
      variantId
    );

  if (
    duplicate &&
    duplicate.id !== Number(id)
  ) {
    throw new Error(
      "Vehicle already saved"
    );
  }

  return await updateSavedCar(
    id,
    variantId,
    nickname
  );

};

export const removeSavedCar = async (
  userId,
  id
) => {

  const car =
    await getSavedCarById(id);

  if (!car) {
    throw new Error(
      "Saved car not found"
    );
  }

  if (car.user_id !== userId) {
    throw new Error(
      "Unauthorized"
    );
  }

  await deleteSavedCar(id);

};