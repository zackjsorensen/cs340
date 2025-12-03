import { UserDto } from "tweeter-shared";
import { ParentDAO } from "./ParentDAO";
import { UserDAO } from "./UserDAO";
import { GetCommand, GetCommandOutput, PutCommand, PutCommandOutput, QueryCommand } from "@aws-sdk/lib-dynamodb";


export class DynamoUserDAO extends ParentDAO implements UserDAO{
    tableName: string = "users";

    async putUser(firstName: string, lastName: string, alias: string, password: string, imageUrl: string): Promise<boolean> {
        const params = {
            TableName: this.tableName,
            Item: {
                user_handle: alias,
                first_name: firstName,
                last_name: lastName, 
                password: password,
                image_url: imageUrl
            }
        };
        const command = new PutCommand(params);
        return await this.doOperation(command, (result: PutCommandOutput) => {
            return true;
        }, "Failed to put user");
    }


    async getUser(userAlias: string): Promise<UserDto> {
        const params = {
            TableName: this.tableName,
            Key: {user_handle: userAlias}
        };
        const command = new GetCommand(params);
        return await this.doOperation(command, (result: GetCommandOutput) => {
            if (result.Item){
                const userDto: UserDto = {
                    alias: result.Item.user_handle,
                    firstName: result.Item.first_name,
                    lastName: result.Item.last_name,
                    imageUrl: result.Item.image_url
                };
                return userDto;
            } else {
                throw new Error(`Could not retrieve user info. Metadata: ${JSON.stringify(result.$metadata)}`);
            }
        })
    }


    async getPassword(userAlias: string): Promise<string> {
        const params = {
            TableName: this.tableName,
            Key: {user_handle: userAlias}
        };
        const command = new GetCommand(params);
        return await this.doOperation(command, (result: GetCommandOutput) => {
            if (result.Item){
                return result.Item.password;
            } else {
                throw new Error("Unable to retrieve password");
            }
        })
    }

}

/*
 Table: users
    - PK: user_handle
    - Attrs
        - firstName
        - lastName
        - password (hashed)
        - imageUrl

 */