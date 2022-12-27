import { Channels } from 'main/preload';
import { IShishoService } from 'shisho-integration/interface';

declare global {
  interface Window {
    electron: {
      shishoService: IShishoService,
    };
  }
}

export {};
