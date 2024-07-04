export interface IMap {
  [key: string]: any
}

export interface IMapStr {
  [key: string]: string
}

export interface IMapBool {
  [key: string]: boolean
}

export interface IMapNum {
  [key: string]: number
}

export type TOpr = 'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte' | 'in' | 'nin' | 'startsWith' | 'endsWith' | 'contains'
