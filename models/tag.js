'use strict';

const db = require('../config/database');
const { PER_PAGE } = require('../constants');
const { dbLogger } = require('../services/db');
const { tagCreationValidator, tagUpdationValidator } = require('../validators/tag');
const { findWithPagination } = require('./concerns/pagination');
const { calculateCurrentTime } = require('./concerns/time');

module.exports.findAll = async (
  page = 1,
  per = PER_PAGE,
  searchTerm = ''
) => {
  let searchQuery = `
    deleted_at IS NULL
  `;
  const searchVariables = [];
  let varIndex = 1;

  if (searchTerm) {
    searchQuery += `AND (name ILIKE $${varIndex})`;
    searchVariables.push(`%${searchTerm}%`);
    varIndex++;
  }

  const tagData = await findWithPagination(
    'tags',
    searchQuery,
    searchVariables,
    page,
    per
  );

  return tagData;
};

module.exports.find = async (id) => {
  const query = `
    SELECT * from tags
    WHERE id = $1;
  `;
  const variables = [id];

  dbLogger(query, variables, 'Find Tag');

  const result = await db.query(query, variables);
  const tag = result.rows[0] || null;

  return tag;
};

module.exports.create = async ({ name }) => {
  const errors = await tagCreationValidator({ name });

  if (errors.length != 0) {
    return { errors };
  }

  const currentTime = calculateCurrentTime();

  const query = `
    INSERT into tags (name, created_at, updated_at)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const variables = [name, currentTime, currentTime];

  dbLogger(query, variables, 'Create Tag');

  const result = await db.query(query, variables);
  const tag = result.rows[0];

  return { tag, errors };
};

module.exports.update = async ({ id, name }) => {
  const errors = await tagUpdationValidator({ id, name });

  if (errors.length != 0) {
    return { errors };
  }

  const currentTime = calculateCurrentTime();

  const query = `
    UPDATE tags
    SET name = $1, updated_at = $2
    WHERE id = $3
    RETURNING *
  `;
  const variables = [name, currentTime, id];

  dbLogger(query, variables, 'Update Tag');

  const result = await db.query(query, variables);
  const tag = result.rows[0];

  return { tag, errors };
};

module.exports.delete = async (id) => {
  await deleteCourseAssociations(id);

  const query = `
    DELETE FROM tags
    WHERE id = $1
    RETURNING *
  `;
  const variables = [id];

  dbLogger(query, variables, 'Delete Tag');

  const result = await db.query(query, variables);
  const tag = result.rows[0] || null;


  return { tag, errors: [] };
};

const deleteCourseAssociations = async (id) => {
  const query = `
    DELETE FROM courses_tags
    WHERE tag_id = $1
    RETURNING *
  `;

  const variables = [id];

  dbLogger(query, variables, 'Delete Tag Associations to Course');

  const result = await db.query(query, variables);

  return result;
}
