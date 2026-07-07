import {
  addSavedCar,
  editSavedCar,
  fetchUserCars,
  removeSavedCar,
} from "../services/savedCarService.js";

export const create = async (
  req,
  res
) => {

  try {

    const {
      variantId,
      nickname,
    } = req.body;

    const car =
      await addSavedCar(
        req.user.id,
        variantId,
        nickname
      );

    res.status(201).json({
      success: true,
      data: car,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};

export const getAll = async (
  req,
  res
) => {

  try {

    const cars =
      await fetchUserCars(
        req.user.id
      );

    res.json({
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

export const update = async (
  req,
  res
) => {

  try {

    const { nickname } =
      req.body;

    const car =
      await editSavedCar(
        req.user.id,
        req.params.id,
        nickname
      );

    res.json({
      success: true,
      data: car,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};

export const remove = async (
  req,
  res
) => {

  try {

    await removeSavedCar(
      req.user.id,
      req.params.id
    );

    res.json({
      success: true,
      message:
        "Saved car deleted successfully",
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};