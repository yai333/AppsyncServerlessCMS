import gql from "graphql-tag";
import { postFragement } from "./FragementPost";

export default gql(`
  mutation deletePost($id:Int!) {
      deletePost (id: $id){
        ...post
      }
  }${postFragement.loc.source.body}`);
