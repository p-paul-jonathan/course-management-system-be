'use strict';

const { validatePresence, validateLength } = require('./commonValidators');
const db = require('../config/database');
const { dbLogger } = require('../services/db');

module.exports.courseCreationValidator = async ({ name, description, tagIds = [] }) => {
  const errors = [];

  validatePresence('name', name, errors);

  validatePresence('description', description, errors);
  validateLength('description', description, { min: 10, max: 2000 }, errors);

  await validateTagPresence(tagIds, errors);

  return errors;
}

module.exports.courseUpdationValidator = async ({ id, name, description, userId, tagIds = [] }) => {
  const errors = [];

  validatePresence('id', id, errors);

  validatePresence('name', name, errors);

  validatePresence('description', description, errors);
  validateLength('description', description, { min: 10, max: 2000 }, errors);

  await validateUserIsOwner(id, userId, errors)

  await validateTagPresence(tagIds, errors);

  return errors;
}

module.exports.courseDeletionValidator = async ({ id, userId }) => {
  const errors = [];

  await validateUserIsOwner(id, userId, errors);

  return errors
}

async function validateUserIsOwner(id, userId, errors) {
  const query = `
    SELECT user_id
    FROM courses
    WHERE courses.id = $1
  `;
  const variables = [id];

  dbLogger(query, variables, 'Validate User is course Owner');

  const result = await db.query(query, variables);
  const dbUserId = parseInt(result.rows[0].user_id, 10);

  if (userId === dbUserId) { return; }


  errors.push({
    code: 403,
    message: 'you are not authorized to edit this course',
    location: 'name'
  })
}

async function validateTagPresence(tagIds = [], errors) {
  const query = `
    SELECT id from tags
    WHERE id = ANY($1)
  `;
  const variables = [tagIds];

  dbLogger(query, variables, 'Validating Tags for Course Create / Update');

  const result = await db.query(query, variables);
  const dbTagIds = result.rows.map((row) => row.id.toString());
  const missing = tagIds.filter(id => !dbTagIds.includes(id));

  if (missing.length > 0) {
    errors.push({
      code: 404,
      message: 'the tag is not found',
      location: 'tags'
    })
  }
}
