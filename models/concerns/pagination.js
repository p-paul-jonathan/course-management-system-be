'use strict';

const db = require('../../config/database');
const { PER_PAGE, MAX_PER_PAGE, DEFAULT_PAGE } = require('../../constants');
const { validateTableName, dbLogger } = require('../../services/db');

module.exports.findWithPagination = async (
  table,
  conditionString = null,
  conditionVars = [],
  page = DEFAULT_PAGE,
  per = PER_PAGE,
  orderClause = null,
  joinClause = null
) => {
  per = Math.min(per, MAX_PER_PAGE);
  const tableName = validateTableName(table);
  let selectionQuery = '';

  if (joinClause) {
    selectionQuery = `SELECT DISTINCT ${tableName}.* from ${tableName}`
  } else {
    selectionQuery = `SELECT ${tableName}.* from ${tableName}`
  }

  const query = `
    ${selectionQuery}
    ${joinClause || ''}
    WHERE ${conditionString || `${tableName}.deleted_at IS NULL`}
    ORDER BY ${orderClause || `${tableName}.id ASC`}
    LIMIT ${per}
    OFFSET ${(page - 1) * per}
  `;

  dbLogger(query, conditionVars, `Fetch Paginated Data from ${table}`);

  const result = await db.query(query, conditionVars);
  const pageInfo = await this.pageInfo(
    table, conditionString, conditionVars, page, per, joinClause
  );

  return { [table]: result.rows, pageInfo };
};

module.exports.pageInfo = async (
  table,
  conditionString = null,
  conditionVars = [],
  page = DEFAULT_PAGE,
  per = PER_PAGE,
  joinClause = null
) => {
  const tableName = validateTableName(table);
  let selectionQuery = '';

  if (joinClause) {
    selectionQuery = `SELECT COUNT(DISTINCT ${tableName}.id) from ${tableName}`
  } else {
    selectionQuery = `SELECT COUNT(${tableName}.id) from ${tableName}`
  }

  const query = `
    ${selectionQuery}
    ${joinClause || ''}
    WHERE ${conditionString || `${tableName}.deleted_at IS NULL`}
  `;

  dbLogger(query, conditionVars, 'fetching pageInfo');

  const result = await db.query(query, conditionVars);

  const count = parseInt(result.rows[0].count, 10);

  return {
    page: page,
    per: per,
    totalRecords: count,
    totalPages: Math.max(1, Math.ceil(count / per))
  };
};
