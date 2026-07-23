import { body, validationResult } from 'express-validator';
import ApiResponse from '../../shared/utils/ApiResponse.js';

export const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return ApiResponse.error(res, 'Validation failed', 400, errors.array());
  };
};

export const registerValidation = validate([
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name').notEmpty().withMessage('Name is required'),
]);

export const loginValidation = validate([
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
]);
