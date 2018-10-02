import { gql } from "apollo-boost";

// Queries para publicaciones

export const GET_POSTS = gql`
  query {
    getPosts {
      _id
      title
      imageUrl
      description
      likes
    }
  }
`;
