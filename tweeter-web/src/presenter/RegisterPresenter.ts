import { Buffer } from "buffer";
import { UserService } from "src/model.service/UserService";
import { User, AuthToken, FakeData } from "tweeter-shared";

export class RegisterPresenter {
  service: UserService;

  public constructor() {
    this.service = new UserService();
  }

  public getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  } // is it worth it to refactor and move this into here?

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    try {
      return await this.service.register(
        firstName,
        lastName,
        alias,
        password,
        userImageBytes,
        imageFileExtension
      );
    } catch (error) {
      throw error;
    }
  }
}

// how to do errors and setting?
// leave in View?
// Or do we change things so rather than returning, we set them
//      through an interface like we did with addItems?
