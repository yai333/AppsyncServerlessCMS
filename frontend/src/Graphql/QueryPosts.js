import gql from "graphql-tag";
import { postFragement } from "./FragementPost";

export default gql(`
  query {
    getPosts {
      __typename
      ...post
    }
  }${postFragement.loc.source.body}`);
