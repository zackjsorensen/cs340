import { Buffer } from "buffer";
import { UserService } from "src/model.service/UserService";
import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { AuthPresenter, AuthView, MyRequest } from "./AuthPresenter";

export interface RegisterView extends View {}

export interface RegisterRequest extends MyRequest {
  firstName: string;
  lastName: string;
  alias: string;
  password: string;
  userImageBytes: Uint8Array;
  imageFileExtension: string;
}

export class RegisterPresenter extends AuthPresenter<RegisterRequest> {
  public getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }

  public async processImageFile(file: File | undefined): Promise<Uint8Array> {
    
    return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      try {
        const imageStringBase64 = event.target?.result as string;
        const imageStringBase64BufferContents = imageStringBase64.split("base64,")[1];
        const bytes: Uint8Array = Buffer.from(imageStringBase64BufferContents, "base64");
        resolve(bytes); // ✅ resolve the promise with the bytes
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

    
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

  protected operation_description(): string {
    return "register user";
  }

  protected doNavigation(url: string, data: RegisterRequest): void {
      this.view.navigate(url);
  }

  public async sumbit(data: RegisterRequest): Promise<[User, AuthToken]> {
    return await this.service.register(
      data.firstName,
      data.lastName,
      data.alias,
      data.password,
      data.userImageBytes,
      data.imageFileExtension
    );
  }
}
