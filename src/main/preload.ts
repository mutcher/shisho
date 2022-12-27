import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { IShishoService } from 'shisho-integration/interface';

export type Channels = 'ipc-example';

contextBridge.exposeInMainWorld('electron', {
  shishoService: {
    getAllBooks() {
      ipcRenderer.invoke("shiso-service-get-all-books").then(data => console.log(data));
    },
  } as IShishoService
});
