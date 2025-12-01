import { AuthToken } from "tweeter-shared";

export interface AuthService{
    // TODO: replace with functioning class
    getUserByToken(token: string): Promise<string>; 
    hashPassword(password: string): Promise<string>;
    authenticate(userAlias: string, password: string): Promise<boolean>;
    /* return true if password is correct, throws error otherwise*/
    startSession(userAlias: string): Promise<AuthToken>;
    /* Creates an AuthToken, puts it in the AuthToken DB, and returns it*/
    endSession(userAlias: string): Promise<void>;
    /* calld delete on the AuthToken DB to delete the current authToken*/

}