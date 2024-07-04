import { FileCreateMutation, FileCreateMutationVariables, UserCreateMutation, UserCreateMutationVariables } from "@/graphql.generated";
import { gql, Query } from "overmind-graphql";

export const FILE_CREATE: Query<FileCreateMutation, FileCreateMutationVariables> = gql`
  mutation FileCreate($input: FileCreateInput!) {
    fileCreate(input: $input) {
      _id
      name
      tags
      generator
      colors
      fileSize {
        bytes
        formated
      }
      framerate
      frames
      height
      width
    }
  }
`

export const USER_CREATE: Query<UserCreateMutation, UserCreateMutationVariables> = gql`
  mutation UserCreate($input: UserInput!) {
    userCreate(input: $input) {
      _id
      firstName
      lastName
      email
    }
  }
`