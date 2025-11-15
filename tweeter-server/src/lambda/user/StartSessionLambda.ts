import {
    AuthTokenDto,
    StartSessionResponse,
    TweeterRequest,
} from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { UserDto } from "tweeter-shared";

export abstract class StartSessionLambda<req extends TweeterRequest> {
    userService = new UserService();
    abstract operation(request: req): Promise<[UserDto, AuthTokenDto]>;
    async handleRequest(request: req): Promise<StartSessionResponse> {
        const [userDto, authTokenDto] = await this.operation(request);
        return {
            success: true,
            message: null,
            user: userDto,
            authToken: authTokenDto,
        };
    }
}
