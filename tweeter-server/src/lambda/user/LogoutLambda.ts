import { TweeterRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoAuthDAO } from "../../DAO/DynamoAuthDAO";
import { DynamoUserDAO } from "../../DAO/DynamoUserDAO";
import { S3ImagesDAO } from "../../DAO/S3ImagesDAO";
import { AuthService } from "../../model/service/AuthService";


export const handler = async (request: TweeterRequest): Promise<TweeterResponse> => {
    const userService = new UserService(new S3ImagesDAO(), new DynamoUserDAO(), new AuthService(new DynamoAuthDAO(), new DynamoUserDAO()));
        
    await userService.logout(request.token);
    return{
        message: null,
        success: true
    }
}