import net from 'net';
import { IShishoService } from './interface';

class AsyncShishoSocket {
  private isConnected: boolean = false;
  private socket?: net.Socket = undefined;

  constructor(
    private readonly host: string = '127.0.0.1',
    private readonly port: number = 6673
  ) {}

  private handleGenericError(error: string) {
    console.log(`handleGenericError: ${error}`);
    this.socket!!.end();
    this.isConnected = false;
    this.socket = undefined;
  }

  async connect() {
    return new Promise<void>((resolve, reject) => {
      if (this.isConnected) {
        resolve();
        return;
      }

      this.socket = net.connect(this.port, this.host, () => {
        console.log(`connected to ${this.host}:${this.port}`);
        this.isConnected = true;

        this.socket!!.on('error', (error) => {
          this.handleGenericError(error.message);
        });

        resolve();
      });
    });
  }

  async write(buffer: string) {
    await this.connect();

    return new Promise<void>((resolve, reject) => {
      let writeResult = this.socket!!.write(buffer, (error) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve();
        }
      });
    });
  }

  async readCommand(): Promise<string> {
    await this.connect();

    return new Promise<string>((resolve, reject) => {
      let response: string = '';
      let chunk = '';
      let commandIsRead = false;

      let onSocketEnd = () => {
        if (!commandIsRead) {
          reject('Stream unexpectedly ends');
        }
      };

      this.socket!!.once('end', onSocketEnd);

      do {
        response = [response, chunk].join();
        console.log(response.length);

        if (
          response.length > 2 &&
          response[-2] == '\n' &&
          response[-1] == '\n'
        ) {
          commandIsRead = true;
        }
      } while (!commandIsRead && null != (chunk = this.socket!!.read(1)));
      this.socket?.removeListener('end', onSocketEnd);
      resolve(response);
    });
  }
}

export class ShishoService implements IShishoService {
  private socket: AsyncShishoSocket = new AsyncShishoSocket();

  async getAllBooks(): Promise<string> {
    await this.socket.write('all\n\n');
    return this.socket.readCommand();
  }
}
