'use strict';

const Tag = require('../../models/tag');
const { getAuthenticatedUser } = require('../../services/auth');

const tags = async ({ page, per, searchTerm }, _context, _info) => {
  return await Tag.findAll(page, per, searchTerm);
};

const tag = async ({ id }, _context, _info) => {
  return await Tag.find(id);
};

const tagsByIds = async ({ page, per, ids }, _context, _info) => {
  return await Tag.findByIds(ids, page, per);
}

const tagCreate = async ({ tag }, context, _info) => {
  getAuthenticatedUser(context);
  return await Tag.create(tag);
};

const tagUpdate = async ({ tag }, context, _info) => {
  getAuthenticatedUser(context);
  return await Tag.update(tag);
};

const tagDelete = async ({ id }, context, _info) => {
  getAuthenticatedUser(context);
  return await Tag.delete(id);
};

const resolvers = {
  tags,
  tag,
  tagsByIds,
  tagCreate,
  tagUpdate,
  tagDelete
};

module.exports = resolvers;
