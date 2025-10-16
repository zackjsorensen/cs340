import { Buffer } from "buffer";
import { UserService } from "src/model.service/UserService";
import { User, AuthToken } from "tweeter-shared";

export class RegisterPresenter {
  service: UserService;

  public constructor() {
    this.service = new UserService();
  }

  public getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  } // is it worth it to refactor and move this into here?

  public async processImageFile(file: File | undefined): Promise<Uint8Array> {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const imageStringBase64 = event.target?.result as string;

      // Remove unnecessary file metadata from the start of the string.
      const imageStringBase64BufferContents =
        imageStringBase64.split("base64,")[1];

      const bytes: Uint8Array = Buffer.from(
        imageStringBase64BufferContents,
        "base64"
      );

      return bytes;
      // now the question is, do I return the bytes or keep them here?
      // It's more efficient to just keep them here
      // But feels safer to return them
    };
    reader.readAsDataURL(file!);
    return new Uint8Array();

  }

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
