import { Buffer } from "buffer";
import { AuthToken, User, FakeData, AuthTokenDto } from "tweeter-shared";
import { UserDto } from "tweeter-shared";
import { ServerService } from "./ServerService";
import { ImageDAO } from "../../DAO/ImagesDAO";
import { UserDAO } from "../../DAO/UserDAO";
import { AuthService } from "./AuthService";
import { IncorrectPasswordError, UserNotFoundError } from "../../errors/Errors";

export class UserService extends ServerService{  // Service is a "marker interface"
  imageDao: ImageDAO;
  userDao: UserDAO;
  authService: AuthService;

  constructor(imageDao: ImageDAO, userDao: UserDAO, authService: AuthService){
    super();
    this.imageDao = imageDao;
    this.userDao = userDao;
    this.authService = authService;
  }

  public async getUser(
    token: string,
    alias: string
  ): Promise<UserDto | null> {
    // TODO: Replace with the result of calling server
    const userDto: UserDto | null = await this.userDao.getUser(alias);

    // let user: User | null = FakeData.instance.findUserByAlias(alias);
    // let userDto = null;
    // if (user != null){
    //   userDto = user.dto;
    // }
    return userDto;
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {     // should this be the full authToken??? >>Q<<
    /* 
      - retrieve user's password: Use userDAO.getUser()?
      - Verify password (use AuthService?)  -- note that AuthService will have to access userDAO anyways to check PWs
      - Create AuthToken (use AuthService?)                    -- only alternative is to retreive the hashed versions
      - Put AuthToken
      - Return AuthToken
      ~~~~ Keep separate for now
      - authService.authenticate(userALias, password): boolean;
      - authService.startSession(userAlias): AuthToken --> this would put the token in the DB as well?
      - return authToken

    */
    const userDto: UserDto = await this.getUser("", alias);
    if (userDto == null){
      // bad userAlias
      throw new UserNotFoundError(`User not found: ${alias}`);
    }


    const authenticated = await this.authService.authenticate(alias, password);
    if (authenticated == true){
      const authToken: AuthToken = await this.authService.startSession(alias);
      return [userDto, authToken];
    } else {
      throw new IncorrectPasswordError("Incorrect Password");
    }


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

      const imageUrl: string = await this.imageDao.putImage(alias, userImageBytes, imageFileExtension);
      const hashed: string = await this.authService.hashPassword(password);
      const result = await this.userDao.putUser(
        firstName,
        lastName, 
        alias,
        hashed,
        imageUrl
      );
      const authToken: AuthToken =  await this.authService.startSession(alias);
      return [await this.getUser("", alias), authToken];
    
  
      // TODO: Replace with the result of calling the server
      const user = FakeData.instance.firstUser.dto;
  
      if (user === null) {
        throw new Error("Invalid registration");
      }
  
      return [user, FakeData.instance.authToken];
    };

  public async logout(token: string){
    // deleteAuthToken
    // const alias: string = await this.authService.getUserByToken(token);
    return await this.authService.endSession(token);
  }

}
