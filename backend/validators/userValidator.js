const Joi = require('joi');

const updateRoleSchema = Joi.object({
  role: Joi.string().valid('viewer', 'analyst', 'admin').required().messages({
    'any.only': 'Role must be viewer, analyst, or admin',
    'any.required': 'Role is required',
  }),
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'inactive').required().messages({
    'any.only': 'Status must be active or inactive',
    'any.required': 'Status is required',
  }),
});

module.exports = { updateRoleSchema, updateStatusSchema };
