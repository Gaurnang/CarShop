import {
  saveCar,
  getSavedCarsByUserId,
  deleteSavedCar,
} from "../repositories/userSavedCar.repository.js";

const saveUserCar = async (
  userId,
  variantId,
  nickname,
  isPrimary
) => {
  return await saveCar(
    userId,
    variantId,
    nickname,
    isPrimary
  );
};

const fetchUserCars = async (
  userId
) => {
  return await getSavedCarsByUserId(
    userId
  );
};

const removeUserCar = async (
  savedCarId
) => {
  return await deleteSavedCar(
    savedCarId
  );
};

export {
  saveUserCar,
  fetchUserCars,
  removeUserCar,
};