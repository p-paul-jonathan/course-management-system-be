'use strict';

const queries = `
  courses(page: Int, per: Int, searchTerm: String, userIds: [Int], tagIds: [Int]): PaginationResponse!
  createdCourses(page: Int, per: Int, searchTerm: String, tagIds: [Int]): PaginationResponse!
  course(id: ID!): Course
`;

module.exports = queries;
