import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'http://localhost:3000/graphql',
  generates: {
    './src/gql/generated.ts': {
      plugins: ['typescript'],
      config: {
        avoidOptionals: true,
        maybeValue: 'T | null | undefined'
      },
    }
  }
}
export default config