import gql from "graphql-tag";

export const postFragement = gql(`
  fragment post on Post {
    id
    title
    content
    createdAt
    notificationEmails
  }
`);
