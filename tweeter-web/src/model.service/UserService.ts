import { Buffer } from "buffer";
import { AuthToken, User, FakeData } from "tweeter-shared";
import { Service } from "./Service";

export class UserService extends Service{  // Service is a "marker interface"
  
  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    this.serve
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, FakeData.instance.authToken];
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
      const imageStringBase64: string =
        Buffer.from(userImageBytes).toString("base64");
  
      // TODO: Replace with the result of calling the server
      const user = FakeData.instance.firstUser;
  
      if (user === null) {
        throw new Error("Invalid registration");
      }
  
      return [user, FakeData.instance.authToken];
    };

  public async logout(authToken: AuthToken){
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    return await new Promise((res) => setTimeout(res, 1000));
  }

}
