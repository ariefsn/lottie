import path from 'path'
import { fileURLToPath } from 'url'
import { TMap } from '../types'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const DIRS = {
  UPLOADS: path.resolve(__dirname, '..', 'uploads'),
  JSON_SCHEMAS: path.resolve(__dirname, '..', 'validator', 'schemas'),
}

export const FILE_EXTENSIONS: TMap = {
  'application/json': 'json',
  'application/x-zip': 'lottie', // dotLottie
  // 'application/lottie+json': 'json',
  // 'application/lottie+zip': 'zip',
  // 'image/png': 'png',
}