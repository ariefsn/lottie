namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
    NEXT_PUBLIC_APP_NAME: string
    NEXT_PUBLIC_API_URL: string
    NEXT_PUBLIC_APP_ADDRESS: string
  }
}