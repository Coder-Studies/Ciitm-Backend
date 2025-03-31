import Frontend from '../models/Frontend.model.js';
import { Created_Frontend } from '../Service/admin.service.js';

export let Create_Frontend_Controller = async (req, res) => {
  try {
    let Find_Frontend = await Frontend.findOne();

    if (Find_Frontend) {
      return res
        .status(200)
        .json({ message: 'Frontend already exists', data: Find_Frontend });
    }

    let frontend = await Created_Frontend();

    if (!frontend) {
      return res.status(400).json({
        message: 'Failed to create Frontend',
      });
    }
    return res.status(200).json({ message: 'Created', data: frontend });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || 'Failed to create Frontend',
      error: true,
    });
  }
};

export let Find_Frontend_Controller = async (req, res) => {
  try {
    let Find_Frontend = await Frontend.find();

    if (!Find_Frontend) {
      res.status(200).json({
        message: 'No Frontend Found',
      });
    }

    return res.status(200).json({
      message: 'Frontend Found',
      data: Find_Frontend,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || 'Failed to create Frontend',
      error: true,
    });
  }
};
