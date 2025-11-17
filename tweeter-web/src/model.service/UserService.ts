import { Buffer } from "buffer";
import {
    AuthToken,
    User,
    FakeData,
    UserInfoRequest,
    LoginRequest,
    RegisterRequest,
    TweeterRequest,
} from "tweeter-shared";
import { ClientService } from "./Service";

export class UserService extends ClientService {

    public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
        const req: UserInfoRequest = {
            token: authToken.token,
            userAlias: alias,
        };
        return this.server.getUser(req);
    }

    public async login(alias: string, password: string): Promise<[User, AuthToken]> {
        const req: LoginRequest = {
            alias: alias,
            password: password,
            token: "",
        };

        return await this.server.login(req);
    }

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string
    ): Promise<[User, AuthToken]> {
        const req: RegisterRequest = {
            firstName: firstName,
            lastName: lastName,
            alias: alias,
            password: password,
            userImageBytes: userImageBytes,
            imageFileExtension: imageFileExtension,
            token: "",
        };
        return await this.server.register(req);
    }

    public async logout(authToken: AuthToken) {
        const req: TweeterRequest = {
            token: authToken.token,
        };
        return await this.server.logout(req);
    }
}
