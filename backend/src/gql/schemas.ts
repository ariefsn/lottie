const scalars = `
  scalar Upload
  scalar ObjectId
  scalar DateTime
`

const inputs = `
  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
  }

  input FileSearchInput {
    name: String
    tags: [String!]
    colors: [String!]
    version: String
    framerate: Int
    skip: Int
    limit: Int
  }

  input FileCreateInput {
    creator: ObjectId!
    name: String!
    tags: [String!]!
    file: Upload!
  }
`

const types = `
  type User {
    _id: ObjectId!
    firstName: String!
    lastName: String!
    email: String!
    createdAt: DateTime!
  }

  type FileItemSize {
    bytes: Int!
    formated: String!
  }

  type FileItem {
    _id: ObjectId!
    name: String!
    tags: [String!]!
    colors: [String!]!,
    framerate: Int!
    frames: Int!
    inPoint: Int!
    outPoint: Int!
    generator: String!
    version: String!
    width: Int!
    height: Int!
    fileSize: FileItemSize!
    likes: [ObjectId!]
    downloads: Int!
    createdAt: DateTime!
    createdBy: User!
  }

  type FileSearchResult {
    total: Int!
    items: [FileItem!]!
  }

  type FileOptionsResult {
    tags: [String!]!
    framerates: [String!]!
    versions: [String!]!
  }
`

const query = `
  type Query {
    ping: String!
    fileSearch(input: FileSearchInput!): FileSearchResult!
    userGet(input: String!): User
    fileOptions: FileOptionsResult!
  }
`

const mutations = `
  type Mutation {
    fileCreate(input: FileCreateInput!): FileItem!
    userCreate(input: UserInput!): User
  }
`

const subscription = `
  type Subscription {
    ping: DateTime
  }
`

export const schema = [
  scalars,
  inputs,
  types,
  query,
  mutations,
  subscription,
]