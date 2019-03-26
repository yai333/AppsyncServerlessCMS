import gql from "graphql-tag";

export default gql(`
  query {
    myAccount @client  {
        userid
        name
        email
    }
  }`);
