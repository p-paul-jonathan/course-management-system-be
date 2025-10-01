'use strict';

const queries = `
  tags(page: Int, per: Int, searchTerm: String): PaginationResponse!
  tag(id: ID): Tag
  tagsByIds(page: Int, per: Int, ids: [Int!]!): PaginationResponse!
`;

module.exports = queries;
