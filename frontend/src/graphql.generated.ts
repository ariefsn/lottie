export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  ObjectId: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type Query = {
  __typename?: 'Query';
  fileOptions: FileOptionsResult;
  fileSearch: FileSearchResult;
  ping: Scalars['String']['output'];
  userGet?: Maybe<User>;
};


export type QueryFileSearchArgs = {
  input: FileSearchInput;
};


export type QueryUserGetArgs = {
  input: Scalars['String']['input'];
};

export type FileOptionsResult = {
  __typename?: 'FileOptionsResult';
  framerates: Array<Scalars['String']['output']>;
  tags: Array<Scalars['String']['output']>;
  versions: Array<Scalars['String']['output']>;
};

export type FileSearchInput = {
  colors?: InputMaybe<Array<Scalars['String']['input']>>;
  framerate?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  version?: InputMaybe<Scalars['String']['input']>;
};

export type FileSearchResult = {
  __typename?: 'FileSearchResult';
  items: Array<FileItem>;
  total: Scalars['Int']['output'];
};

export type FileItem = {
  __typename?: 'FileItem';
  _id: Scalars['ObjectId']['output'];
  colors: Array<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  createdBy: User;
  downloads: Scalars['Int']['output'];
  fileSize: FileItemSize;
  framerate: Scalars['Int']['output'];
  frames: Scalars['Int']['output'];
  generator: Scalars['String']['output'];
  height: Scalars['Int']['output'];
  inPoint: Scalars['Int']['output'];
  likes?: Maybe<Array<Scalars['ObjectId']['output']>>;
  name: Scalars['String']['output'];
  outPoint: Scalars['Int']['output'];
  tags: Array<Scalars['String']['output']>;
  version: Scalars['String']['output'];
  width: Scalars['Int']['output'];
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ObjectId']['output'];
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
};

export type FileItemSize = {
  __typename?: 'FileItemSize';
  bytes: Scalars['Int']['output'];
  formated: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  fileCreate: FileItem;
  userCreate?: Maybe<User>;
};


export type MutationFileCreateArgs = {
  input: FileCreateInput;
};


export type MutationUserCreateArgs = {
  input: UserInput;
};

export type FileCreateInput = {
  creator: Scalars['ObjectId']['input'];
  file: Scalars['Upload']['input'];
  name: Scalars['String']['input'];
  tags: Array<Scalars['String']['input']>;
};

export type UserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
};

export type FileCreateMutationVariables = Exact<{
  input: FileCreateInput;
}>;


export type FileCreateMutation = { __typename?: 'Mutation', fileCreate: { __typename?: 'FileItem', _id: any, name: string, tags: Array<string>, generator: string, colors: Array<string>, framerate: number, frames: number, height: number, width: number, fileSize: { __typename?: 'FileItemSize', bytes: number, formated: string } } };

export type UserCreateMutationVariables = Exact<{
  input: UserInput;
}>;


export type UserCreateMutation = { __typename?: 'Mutation', userCreate?: { __typename?: 'User', _id: any, firstName: string, lastName: string, email: string } | null };

export type PingQueryVariables = Exact<{ [key: string]: never; }>;


export type PingQuery = { __typename?: 'Query', ping: string };

export type FileSearchQueryVariables = Exact<{
  input: FileSearchInput;
}>;


export type FileSearchQuery = { __typename?: 'Query', fileSearch: { __typename?: 'FileSearchResult', total: number, items: Array<{ __typename?: 'FileItem', _id: any, name: string, tags: Array<string>, generator: string, colors: Array<string>, framerate: number, frames: number, height: number, width: number, version: string, downloads: number, fileSize: { __typename?: 'FileItemSize', bytes: number, formated: string }, createdBy: { __typename?: 'User', _id: any, firstName: string, lastName: string, email: string } }> } };

export type UserGetQueryVariables = Exact<{
  input: Scalars['String']['input'];
}>;


export type UserGetQuery = { __typename?: 'Query', userGet?: { __typename?: 'User', _id: any, firstName: string, lastName: string, email: string } | null };

export type FileOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type FileOptionsQuery = { __typename?: 'Query', fileOptions: { __typename?: 'FileOptionsResult', tags: Array<string>, framerates: Array<string>, versions: Array<string> } };
