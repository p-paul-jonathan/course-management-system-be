'use strict';

const courseResolvers = require('./course/resolvers');
const userResolvers = require('./user/resolvers');
const chapterResolvers = require('./chapter/resolvers');
const tagResolvers = require('./tag/resolvers.js');

module.exports.rootValue = {
	...courseResolvers,
	...userResolvers,
  ...chapterResolvers,
  ...tagResolvers
};
