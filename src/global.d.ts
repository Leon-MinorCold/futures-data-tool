declare global {
  interface Window {
    electron: {
      receiveMessage: (channel: string, callback: (data: any) => void) => void;
      sendMessage: (channel: string, data: any) => void;
    };
  }
}

export {};
