export {};

declare global {
  interface Window {
    API_URL: string;
    USER: string;
    PASSWORD: string;
  }
}