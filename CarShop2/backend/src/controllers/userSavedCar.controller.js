import {
  saveUserCar,
  fetchUserCars,
  removeUserCar,
} from "../services/userSavedCar.service.js";

const addSavedCar = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    const {
      variantId,
      nickname,
      isPrimary,
    } = req.body;

    const savedCar =
      await saveUserCar(
        userId,
        variantId,
        nickname,
        isPrimary
      );

    res.status(201).json({
      success: true,
      data: savedCar,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSavedCars = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    const cars =
      await fetchUserCars(userId);

    res.status(200).json({
      success: true,
      data: cars,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeSavedCar = async (
  req,
  res
) => {
  try {
    const { savedCarId } = req.params;

    const deletedCar =
      await removeUserCar(
        savedCarId
      );

    res.status(200).json({
      success: true,
      data: deletedCar,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  addSavedCar,
  getSavedCars,
  removeSavedCar,
};