import { TResponse } from "../types"

export const JsonOk = (data: any): TResponse => {
  return {
    success: true,
    data,
    message: ''
  }
}

export const JsonError = (message: string): TResponse => {
  return {
    success: false,
    data: null,
    message
  }
}