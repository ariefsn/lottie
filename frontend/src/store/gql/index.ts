import { graphql } from 'overmind-graphql'
import * as mutations from './mutations'
import * as queries from './queries'

export const gql = graphql({ queries, mutations })