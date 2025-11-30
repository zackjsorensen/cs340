import { AuthTokenDto } from "tweeter-shared";
import { RegisterRequest } from "tweeter-shared";
import { UserDto } from "tweeter-shared";


export interface UserDAO{
    getUser(userAlias: string): UserDto;
    putUser(req: RegisterRequest): AuthTokenDto;    // should this take a registerRequest or individual args?
}