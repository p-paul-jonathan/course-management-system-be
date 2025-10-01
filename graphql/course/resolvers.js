'use strict';

const Course = require('../../models/course');
const { getAuthenticatedUser } = require('../../services/auth');
const { containsSelection } = require('../helpers');

const courses = async ({ page, per, searchTerm, userIds, tagIds }, _context, info) => {
  const withUser = containsSelection(info, 'user');
  const withTags = containsSelection(info, 'tags');

  return await Course.findAll(page, per, withUser, searchTerm, userIds, withTags, tagIds);
};

const createdCourses = async ({ page, per, searchTerm, tagIds }, context, info) => {
  getAuthenticatedUser(context);
  const withUser = containsSelection(info, 'user');
  const withTags = containsSelection(info, 'tags');

  return await Course.findByUserId(context.user.id, page, per, withUser, searchTerm, withTags, tagIds);
}

const course = async ({ id }, _context, info) => {
  const withUser = containsSelection(info, 'user');
  const withTags = containsSelection(info, 'tags');

  return await Course.find(id, withUser, withTags);
};

const courseCreate = async ({ course }, context) => {
  getAuthenticatedUser(context);
  return await Course.create(course, context.user.id);
};

const courseUpdate = async ({ course }, context) => {
  getAuthenticatedUser(context);
  return await Course.update(course, context.user.id);
};

const courseDelete = async ({ id }, context) => {
  getAuthenticatedUser(context);
  return await Course.destroy(id, context.user.id);
};

const updateChapterOrder = async ({ id, chapterOrder }, context) => {
  getAuthenticatedUser(context);
  return await Course.updateChapterOrder(id, chapterOrder);
}

const resolvers = {
  courses,
  createdCourses,
  course,
  courseCreate,
  courseUpdate,
  courseDelete,
  updateChapterOrder
}

module.exports = resolvers;
