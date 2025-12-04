import { AuthToken } from "tweeter-shared";
import { AuthDAO } from "../../DAO/AuthDAO";
import { UserDAO } from "../../DAO/UserDAO";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { AuthTokenDto } from "tweeter-shared";


// export interface AuthService{
//     // TODO: replace with functioning class
//     getUserByToken(token: string): Promise<string>; 
//     hashPassword(password: string): Promise<string>;
//     authenticate(userAlias: string, password: string): Promise<boolean>;
//     /* return true if password is correct, throws error otherwise*/
//     startSession(userAlias: string): Promise<AuthToken>;
//     /* Creates an AuthToken, puts it in the AuthToken DB, and returns it*/
//     endSession(userAlias: string): Promise<void>;
//     /* calld delete on the AuthToken DB to delete the current authToken*/

// }

export class AuthService{
    // authDAO, userDAO
    authDao: AuthDAO;
    userDao: UserDAO;

    constructor(authDao: AuthDAO, userDao: UserDAO){
        this.authDao = authDao;
        this.userDao = userDao;
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    }

    private async verifyPassword(password: string, dbPassword: string): Promise<boolean>{
        return await bcrypt.compare(password, dbPassword);
    }

    async authenticate(userAlias: string, password: string): Promise<boolean> {
        let dbPassword: string = await this.userDao.getPassword(userAlias);
        const valid: boolean = await this.verifyPassword(password, dbPassword);
        return valid;
    }

    async startSession(userAlias: string): Promise<AuthToken> {
        const token: string = uuidv4();
        const authToken: AuthToken = new AuthToken(token, Date.now());
        const success: boolean = await this.authDao.putAuthToken(userAlias, {token: token, timestamp: authToken.timestamp});
        if (success == true){
            return authToken;
        } else {
            throw new Error("Failed to put AuthToken\n");
        }
    }

    async endSession(token: string): Promise<void> {
        const success: boolean = await this.authDao.deleteAuthToken(token);
        if (success != true){
            throw new Error("Failed to delete authToken\n");
        }
    }

    async getUserByToken(token: string): Promise<string> {
        const [userAlias, info] = await this.authDao.getUserByAuthToken(token);
        return userAlias;
    }



}