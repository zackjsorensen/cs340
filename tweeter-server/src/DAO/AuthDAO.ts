import { AuthTokenDto } from "tweeter-shared";
import { AuthToken } from "tweeter-shared";

export interface AuthDAO{
    putAuthToken(userAlias: string, authTokenDto: AuthTokenDto): Promise<boolean>;
    updateAuthToken(userAlias: string, newAuthToken: AuthToken): Promise<boolean>;
    deleteAuthToken(token: string): Promise<boolean>;
    getUserByAuthToken(token: string): Promise<string>;
}