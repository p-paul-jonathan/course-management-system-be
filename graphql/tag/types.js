'use strict';

const tagType = `
  type Tag {
    id: ID!
    name: String
  }
`

const tagMutationResponseType = `
  type TagMutationResponse {
    tag: Tag
    errors: [Error]
  }
`

const types =
  tagType +
  tagMutationResponseType
;


module.exports = types;
