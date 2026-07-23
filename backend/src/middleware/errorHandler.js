import ApiResponse from '../shared/utils/ApiResponse.js';

export const errorHandler = (err, req, res, next) => {
  console.error('💥 Error Stack:', err);

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'An unexpected error occurred on the server';
  const errors = err.errors || [];

  return ApiResponse.error(res, message, statusCode, errors);
};

export default errorHandler;
