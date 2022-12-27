import { IShishoService } from 'shisho-integration/interface';

export class AppViewModel {
  constructor(private readonly shishoService: IShishoService) {}

  public async loadBooks(): Promise<void> {
    const command = await this.shishoService.getAllBooks();
    console.log(command);
  }
}
