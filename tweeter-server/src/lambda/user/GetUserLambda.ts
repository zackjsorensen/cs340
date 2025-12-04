import { UserInfoRequest, GetUserResponse, UserDto } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { AuthToken } from "tweeter-shared";
import { S3ImagesDAO } from "../../DAO/S3ImagesDAO";
import { DynamoUserDAO } from "../../DAO/DynamoUserDAO";
import { AuthService } from "../../model/service/AuthService";
import { DynamoAuthDAO } from "../../DAO/DynamoAuthDAO";

export const handler = async (request: UserInfoRequest): Promise<GetUserResponse> => {
    const userService = new UserService(new S3ImagesDAO(), new DynamoUserDAO(), new AuthService(new DynamoAuthDAO(), new DynamoUserDAO()));
    const userDto: UserDto | null = await userService.getUser(request.token, request.userAlias);
    return {
        success: true,
        message: null,
        user: userDto
    }
}