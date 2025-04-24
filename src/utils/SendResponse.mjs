import { response } from 'express';

class SendResponse {
  success(res = response, statusCode, message, data) {
    return res.status(statusCode).json({
      message,
      data,
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
