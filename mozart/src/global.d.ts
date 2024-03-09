export {}; 

declare global {
  interface Window {
    ethereum?: {
      request: ({ method, params }: { method: string; params?: Array<any> }) => Promise<any>;
    };
  }
}