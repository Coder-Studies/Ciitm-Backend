import mongoose from 'mongoose';

const validateTeacherId = (req, res, next) => {
  const { id } = req.params;
  
  // Check if ID is valid MongoDB ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid teacher ID format'
    });
  }
  
  next();
};

const validateUpdateData = (req, res, next) => {
  const { body } = req;
  
  // Check if body is empty
  if (!body || Object.keys(body).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No update data provided'
    });
  }
  
  // Validate email format if email is being updated
  if (body.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
  }
  
  next();
};

export { validateTeacherId, validateUpdateData };