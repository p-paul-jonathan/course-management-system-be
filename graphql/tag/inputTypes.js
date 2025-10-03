'use strict';

const tagCreateInputType = `
  input TagCreateInput {
    name: String!,
  }
`;

const tagUpdateInputType = `
  input TagUpdateInput {
    id: ID!,
    name: String!,
  }
`;

const inputTypes =
  tagCreateInputType +
  tagUpdateInputType;

module.exports = inputTypes;
