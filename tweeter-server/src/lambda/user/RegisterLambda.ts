import { AuthTokenDto, RegisterRequest, StartSessionResponse, UserDto } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { StartSessionLambda } from "./StartSessionLambda";

export class RegisterLambda extends StartSessionLambda<RegisterRequest> {
    async operation(request: RegisterRequest): Promise<[UserDto, AuthTokenDto]> {
        return await this.userService.register(
            request.firstName,
            request.lastName,
            request.alias,
            request.password,
            request.userImageBytes,
            request.imageFileExtension
        )
    }
}

const handlerInstance = new RegisterLambda();

export const handler = async (request: RegisterRequest): Promise<StartSessionResponse> => {
    return await handlerInstance.handleRequest(request);
}