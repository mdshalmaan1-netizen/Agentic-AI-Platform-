export class ApiResponse {
  static success(res, data = null, message = 'Success', statusCode = 200, meta = undefined) {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
      ...(meta && { meta }),
    });
  }

  static created(res, data = null, message = 'Resource created successfully') {
    return ApiResponse.success(res, data, message, 201);
  }

  static error(res, message = 'Internal Server Error', statusCode = 500, errors = []) {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors: errors.length ? errors : undefined,
    });
  }
}

export default ApiResponse;
