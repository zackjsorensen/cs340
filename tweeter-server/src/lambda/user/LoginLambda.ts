import { AuthTokenDto, CountRequest, LoginRequest, RegisterRequest, StartSessionResponse, UserDto } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { StartSessionLambda } from "./StartSessionLambda";

export class LoginLambda extends StartSessionLambda<LoginRequest> {
    async operation(request: LoginRequest): Promise<[UserDto, AuthTokenDto]> {
        return await this.userService.login(request.alias, request.password);
    }
}

const handlerInstance = new LoginLambda();

export const handler = async (request: LoginRequest): Promise<StartSessionResponse> => {
    return await handlerInstance.handleRequest(request);
}

// can I sub-class and just pass functions as params then?

