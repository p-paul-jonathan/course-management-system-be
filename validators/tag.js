'use strict';

const { validatePresence, validateLength } = require("./commonValidators");

module.exports.tagCreationValidator = async ({ name }) => {
  const errors = [];

  validatePresence('name', name, errors);
  validateLength('name', name, { min: 5, max: 15 }, errors);

  return errors;
}

module.exports.tagUpdationValidator = async ({ id, name }) => {
  const errors = [];

  validatePresence('id', id, errors);

  validatePresence('name', name, errors);
  validateLength('name', name, { min: 5, max: 15 }, errors);

  return errors;
}
