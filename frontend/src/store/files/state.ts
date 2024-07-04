import { FileItemLocal } from "@/entities"
import { FileOptionsResult, FileSearchInput } from "@/graphql.generated"
import { derived } from "overmind"

type TState = {
  items: FileItemLocal[]
  total: number
  page: number
  pageTotal: number
  skip: number
  limit: number
  searchPayload: FileSearchInput
  options: FileOptionsResult
}

const defaultLimit = 10

export const state: TState = {
  items: [],
  total: 0,
  skip: derived((state: TState) => Math.floor(state.searchPayload.skip ?? 0)),
  limit: derived((state: TState) => Math.floor(state.searchPayload.limit ?? defaultLimit)),
  page: derived((state: TState) => Math.floor(state.skip / state.limit) + 1),
  pageTotal: derived((state: TState) => Math.ceil(state.total / state.limit)),
  searchPayload: {
    skip: 0,
    limit: defaultLimit,
  },
  options: {
    tags: [],
    versions: [],
    framerates: [],
  }
}