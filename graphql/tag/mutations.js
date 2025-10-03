'use strict';

const mutations = `
  tagCreate(tag: TagCreateInput!): TagMutationResponse!
  tagUpdate(tag: TagUpdateInput!): TagMutationResponse!
  tagDelete(id: ID!): TagMutationResponse!
  cleanTags: Boolean!
`;

module.exports = mutations;
