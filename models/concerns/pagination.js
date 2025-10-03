'use strict';

const db = require('../../config/database');
const { PER_PAGE, MAX_PER_PAGE, DEFAULT_PAGE } = require('../../constants');
const { validateTableName, dbLogger } = require('../../services/db');

module.exports.findWithPagination = async (
  table,
  conditionString = 'deleted_at IS NULL',
  conditionVars = [],
  page = DEFAULT_PAGE,
  per = PER_PAGE,
  orderClause = 'id ASC',
  joinClause = ''
) => {
  per = Math.min(per, MAX_PER_PAGE);

  const query = `
    SELECT DISTINCT ${validateTableName(table)}.* from ${validateTableName(table)}
    ${joinClause}
    WHERE ${conditionString}
    ORDER BY ${orderClause}
    LIMIT ${per}
    OFFSET ${(page - 1) * per}
  `;

  dbLogger(query, conditionVars, `Fetch Paginated Data from ${table}`);

  const result = await db.query(query, conditionVars);
  const pageInfo = await this.pageInfo(
    table, conditionString, conditionVars, page, per, orderClause, joinClause
  );

  return { [table]: result.rows, pageInfo };
};

module.exports.pageInfo = async (
  table,
  conditionString = 'deleted_at IS NULL',
  conditionVars = [],
  page = DEFAULT_PAGE,
  per = PER_PAGE,
  orderClause = 'id ASC',
  joinClause = ''
) => {
  const query = `
    SELECT COUNT(DISTINCT ${validateTableName(table)}.id) from ${validateTableName(table)}
    ${joinClause}
    WHERE ${conditionString}
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
