export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DOMAIN: string;
    }
  }
}