'use strict';

const courseCreateInputType = `
  input CourseCreateInput {
    name: String!,
    description: String!,
    live: Boolean!,
    tagIds: [ID]
	}
`;

const courseUpdateInputType = `
  input CourseUpdateInput {
    id: ID!,
    name: String!,
    description: String!,
    live: Boolean,
    chapter_order: [Int],
    tagIds: [ID]
  }
`;

const inputTypes =
  courseCreateInputType +
  courseUpdateInputType;

module.exports = inputTypes;
