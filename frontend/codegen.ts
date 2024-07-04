import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'http://localhost:3001/graphql',
  documents: ['src/**/*.{ts,tsx}'],
  generates: {
    'src/graphql.generated.ts': {
      plugins: ['typescript', 'typescript-operations'],
    },
  },
}

export default config