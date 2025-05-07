import { response } from 'express';

class SendResponse {
  success(res = response, statusCode, message, data) {
    return res.status(statusCode).json({
      message,
      data,
      success: true,
    });
  }

  error(res = response, statusCode, message) {
    return res.status(statusCode).json({
      message,
      error: true,
    });
  }
}

export default new SendResponse();
