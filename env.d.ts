declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_ENVIRONMENT: 'development' | 'test' | 'acceptance' | 'production';
    NEXT_PUBLIC_CORE_API_URL: string;
  }
}
