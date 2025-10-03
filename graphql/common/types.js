'use strict';

const pageInfoType = `
  type PageInfo {
    page: Int!
    per: Int!
    totalPages: Int
    totalRecords: Int
  }
`;

const paginationResponseType = `
  type PaginationResponse {
    courses: [Course]
    chapters: [Chapter]
    users: [User]
    tags: [Tag]
    pageInfo: PageInfo!
  }
`;

const ErrorType = `
  type Error {
    code: String
    message: String
    location: String
  }
`

const types =
    pageInfoType +
    paginationResponseType +
    ErrorType;

module.exports = types;
