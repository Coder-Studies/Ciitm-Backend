import Notice from '../models/Notice.model.js';
import status from '../models/Status.model.js';
import { create_Notice } from '../Service/admin.service.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.js';

export let Find_Notice_Controller = async (req, res) => {
  try {
    let { limit, skip } = req.params;
    let Find_Notice = await Notice.find()
      .limit(limit - 1)
      .skip(skip - 1)
      .exec();

    if (!Find_Notice) {
      return res
        .status(400)
        .json({ message: 'Failed to Find Notice', status: 'Failed' });
    }

    res.status(201).json({
      message: 'Notice Find',
      Find_Notice,
      status: 'success',
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || 'Error Creating Notice',
      status: 'Failed',
    });
  }
};
