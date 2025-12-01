import { AuthTokenDto } from "tweeter-shared";
import { RegisterRequest } from "tweeter-shared";
import { UserDto } from "tweeter-shared";


export interface UserDAO{
    getUser(userAlias: string): UserDto;
    putUser(
        firstName: string,
        lastName: string,
        alias: string,
        password: string, // TODO: Hash PWs
        imageUrl: string
    ): Promise<boolean>;
}