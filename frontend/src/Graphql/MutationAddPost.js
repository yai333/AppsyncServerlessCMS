import gql from "graphql-tag";
import { postFragement } from "./FragementPost";

export default gql(`
  mutation addPost($post:PostInput!) {
      addPost (post: $post){
        ...post
      }
  }${postFragement.loc.source.body}`);
