const Joi = require('joi');

const createRecordSchema = Joi.object({
  amount: Joi.number().positive().required().messages({
    'number.positive': 'Amount must be a positive number',
    'any.required': 'Amount is required',
  }),
  type: Joi.string().valid('income', 'expense').required().messages({
    'any.only': 'Type must be income or expense',
    'any.required': 'Type is required',
  }),
  category: Joi.string().trim().max(50).required().messages({
    'string.max': 'Category cannot exceed 50 characters',
    'any.required': 'Category is required',
  }),
  date: Joi.date().iso().required().messages({
    'date.format': 'Date must be a valid ISO date',
    'any.required': 'Date is required',
  }),
  description: Joi.string().trim().max(500).allow('').optional().messages({
    'string.max': 'Description cannot exceed 500 characters',
  }),
});

const updateRecordSchema = Joi.object({
  amount: Joi.number().positive().optional(),
  type: Joi.string().valid('income', 'expense').optional(),
  category: Joi.string().trim().max(50).optional(),
  date: Joi.date().iso().optional(),
  description: Joi.string().trim().max(500).allow('').optional(),
}).min(1).messages({
  'object.min': 'At least one field must be provided to update',
});

module.exports = { createRecordSchema, updateRecordSchema };
