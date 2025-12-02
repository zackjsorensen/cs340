import { AuthToken, AuthTokenDto } from "tweeter-shared";
import { AuthDAO } from "./AuthDAO";
import { ParentDAO } from "./ParentDAO";
import {  DeleteCommand, DeleteCommandOutput, PutCommand, PutCommandOutput, QueryCommand, QueryCommandOutput
} from "@aws-sdk/lib-dynamodb";

export class DynamoAuthDAO extends ParentDAO implements AuthDAO{
    readonly tableName = "authtoken";
    readonly tokenIndexName = "tokenIndex";

    async putAuthToken(userAlias: string, authTokenDto: AuthTokenDto): Promise<boolean> {
        const params = {
            TableName: this.tableName,
            Item: {
                user_handle: userAlias,
                timestamp: authTokenDto.timestamp,
                token: authTokenDto.token
            }
        };
        const command = new PutCommand(params);
        return await this.doOperation(command, (result: PutCommandOutput) => {
            return true;
        }, "Failed to put authToken");
    }

    async getUserByAuthToken(token: string): Promise<[string, number]> {
        const params = {
            TableName: this.tableName,
            IndexName: this.tokenIndexName,
            KeyConditionExpression: "token = :t",
            ExpressionAttributeValues: {":t": token},
            Limit: 1
        };
        const command = new QueryCommand(params);
        return await this.doOperation(command, (result: QueryCommandOutput) => {
            if (result && result.Items.length >= 1){
                return [result.Items[0].user_handle, result.Items[0].timestamp];
            } else {
                return null; // token not found
            }
        }, "Failed to find user by authToken");

    }



    async deleteAuthToken(token: string): Promise<boolean> {
        const [userAlias, timestamp] = await this.getUserByAuthToken(token);
        if (!userAlias || userAlias == null){
            throw new Error(`Failed to delete token because could not find user\n`);
        }
        const params = {
            TableName: this.tableName,
            Key: {
                user_handle: userAlias,
                timestamp: timestamp
            }
        };
        const command = new DeleteCommand(params);
        return await this.doOperation(command, (result: DeleteCommandOutput) => {
            return true;
        }, "Failed to delete authToken");
    }

    // async updateAuthToken(userAlias: string, newAuthToken: AuthToken): Promise<boolean> {
    //     const [user, timestamp] = this.getUserByAuthToken()
    //     await this.deleteAuthToken()
    // }

}

/* 
AUTHTOKEN TABLE
- title: authtoken
- PK: userAlias
- SK: timestamp
GSI
- title: tokenIndex
- PK: authToken
- make sure userAlias is projected attr

*/