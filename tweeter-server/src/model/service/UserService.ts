import { Buffer } from "buffer";
import { AuthToken, User, FakeData, AuthTokenDto } from "tweeter-shared";
import { UserDto } from "tweeter-shared";
import { ServerService } from "./ServerService";

export class UserService extends ServerService{  // Service is a "marker interface"
  public async getUser(
    token: string,
    alias: string
  ): Promise<UserDto | null> {
    // TODO: Replace with the result of calling server

    let user: User | null = FakeData.instance.findUserByAlias(alias);
    let userDto = null;
    if (user != null){
      userDto = user.dto;
    }
    return userDto;
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {     // should this be the full authToken??? >>Q<<
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser.dto;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, FakeData.instance.authToken.dto];
  }


  public async register(
      firstName: string,
      lastName: string,
      alias: string,
      password: string,
      userImageBytes: Uint8Array,
      imageFileExtension: string
    ): Promise<[UserDto, AuthToken]> {
      // Not neded now, but will be needed when you make the request to the server in milestone 3
      const imageStringBase64: string =
        Buffer.from(userImageBytes).toString("base64");
  
      // TODO: Replace with the result of calling the server
      const user = FakeData.instance.firstUser.dto;
  
      if (user === null) {
        throw new Error("Invalid registration");
      }
  
      return [user, FakeData.instance.authToken];
    };

  public async logout(token: string){
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    return await new Promise((res) => setTimeout(res, 1000));
  }

}
