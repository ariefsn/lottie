import { FileOptionsQuery, FileOptionsQueryVariables, FileSearchQuery, FileSearchQueryVariables, PingQuery, UserGetQuery, UserGetQueryVariables } from "@/graphql.generated";
import { gql, Query } from "overmind-graphql";

export const PING: Query<PingQuery> = gql`
  query Ping {
    ping
  }
`

export const FILE_GETS: Query<FileSearchQuery, FileSearchQueryVariables> = gql`
  query FileSearch($input: FileSearchInput!) {
    fileSearch(input: $input) {
      total
      items {
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
        version
        downloads
        createdBy {
          _id
          firstName
          lastName
          email
        }
      }
    }
  }
`

export const USER_GET: Query<UserGetQuery, UserGetQueryVariables> = gql`
  query UserGet($input: String!) {
    userGet(input: $input) {
      _id
      firstName
      lastName
      email
    }
  }
`

export const FILE_OPTIONS: Query<FileOptionsQuery, FileOptionsQueryVariables> = gql`
  query FileOptions {
    fileOptions {
      tags
      framerates
      versions
    }
  }
`