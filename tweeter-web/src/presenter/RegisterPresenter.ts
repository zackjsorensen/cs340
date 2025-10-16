import { Buffer } from "buffer";
import { UserService } from "src/model.service/UserService";
import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface RegisterView extends View {
  authenticated: (user: User, authToken: AuthToken) => void;
  navigate: (url: string) => void;
}

export class RegisterPresenter extends Presenter<RegisterView> {
  service: UserService;

  public constructor(view: RegisterView) {
    super(view);
    this.service = new UserService();
  }

  public getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }

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
  ) {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    this.doFailureReportingOperation(async() => {
      const [user, authToken] = await this.service.register(
        firstName,
        lastName,
        alias,
        password,
        userImageBytes,
        imageFileExtension
      );
      this.view.authenticated(user, authToken);
      this.view.navigate(`/feed/${user.alias}`);
    }, "register user");
  }
}