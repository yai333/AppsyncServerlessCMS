import gql from "graphql-tag";
import { postFragement } from "./FragementPost";

export default gql(`
  subscription onPostDeleted {
    onPostDeleted {
      __typename
      ...post
    }
  }${postFragement.loc.source.body}`);
