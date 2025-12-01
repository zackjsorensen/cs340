import { AuthToken } from "tweeter-shared";

export interface AuthDAO{
    putAuthToken(userAlias: string, authToken: AuthToken): Promise<boolean>;
    updateAuthToken(userAlias: string, newAuthToken: AuthToken): Promise<boolean>;
    deleteAuthToken(userAlias: string): Promise<boolean>;
}