import { UserInfoRequest, GetUserResponse, UserDto } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { AuthToken } from "tweeter-shared";

export const handler = async (request: UserInfoRequest): Promise<GetUserResponse> => {
    const userService = new UserService();
    const userDto: UserDto | null = await userService.getUser(request.token, request.userAlias);
    return {
        success: true,
        message: null,
        user: userDto
    }
}