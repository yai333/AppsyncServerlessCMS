import gql from "graphql-tag";
import { postFragement } from "./FragementPost";

export default gql(`
  subscription onPostAdded {
    onPostAdded {
      __typename
      ...post
    }
  }${postFragement.loc.source.body}`);
