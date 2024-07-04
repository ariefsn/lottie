export type TPayload<T = null> = {
  input: T
}

export type TUpload = {
  filename: string
  mimetype: string
  encoding: string
  createReadStream: () => NodeJS.ReadableStream
}

export type TMap = {
  [key: string]: any
}

export type TResponse<T = null> = {
  success: boolean
  data: T
  message: string
}
