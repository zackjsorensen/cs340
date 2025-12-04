import {
    AuthTokenDto,
    StartSessionResponse,
    TweeterRequest,
} from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { UserDto } from "tweeter-shared";
import { DynamoAuthDAO } from "../../DAO/DynamoAuthDAO";
import { DynamoUserDAO } from "../../DAO/DynamoUserDAO";
import { S3ImagesDAO } from "../../DAO/S3ImagesDAO";
import { AuthService } from "../../model/service/AuthService";
import {region} from "tweeter-shared";
console.log(`Region value at lambda start: ${region}`);

export abstract class StartSessionLambda<req extends TweeterRequest> {
/* TODO: use DAO to put new user*/

    userService = new UserService(new S3ImagesDAO(), new DynamoUserDAO(), new AuthService(new DynamoAuthDAO(), new DynamoUserDAO()));
        
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

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
  };
}
