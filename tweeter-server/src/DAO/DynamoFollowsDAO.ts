import { FollowsDAO } from "./FollowsDAO";
import {
    BatchWriteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    UpdateCommand,
    DeleteCommand,
    QueryCommand,
    PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { ParentDAO, AnyDynamoCommand } from "./ParentDAO";
import { QueryCommandOutput } from "@aws-sdk/client-dynamodb";
import { FollowsDto, UserDto } from "tweeter-shared";
import { DynamoUserDAO } from "./DynamoUserDAO";

export class DynamoFollowsDAO extends ParentDAO implements FollowsDAO {
    readonly tableName = "follows";
    readonly indexName = "follows_index";
    readonly follower_handle_attr = "follower_handle";
    readonly followee_handle_attr = "followee_handle";
    private userDao = new DynamoUserDAO();

    async getFolloweeCount(userAlias: string): Promise<number> {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: "follower_handle = :u",
            ExpressionAttributeValues: { ":u": userAlias},
            Select: "COUNT" as const // treats it as required literal rather than string
        };
        const command = new QueryCommand(params);
        return this.doOperation(command, (result: QueryCommandOutput) => {
            return result.Count ?? 0;
        })
    }

    async getFollowerCount(userAlias: string): Promise<number> {
        const params = {
            TableName: this.tableName,
            IndexName: this.indexName,
            KeyConditionExpression: "followee_handle = :u",
            ExpressionAttributeValues: { ":u": userAlias},
            Select: "COUNT" as const // treats it as required literal rather than string
        };
        const command = new QueryCommand(params);
        return this.doOperation(command, (result: QueryCommandOutput) => {
            return result.Count ?? 0;
        });
    }

    async getFollower(followeeAlias: string, followerAlias: string) {
        const params = {
            TableName: this.tableName,
            Key: {
                follower_handle: followerAlias,
                followee_handle: followeeAlias,
            },
        };
        const command = new GetCommand(params);
        const result = await this.ddb.send(command);
        // console.log(result);
        return true;
    }

    async removeFollower(followeeAlias: string, followerAlias: string): Promise<boolean> {
        const params = {
            TableName: this.tableName,
            Key: {
                follower_handle: followerAlias,
                followee_handle: followeeAlias,
            },
        };
        const command = new DeleteCommand(params);
        return this.doOperation(command, () => {
            return true;
        });

        const result = await this.ddb.send(command);
        if (result.$metadata.httpStatusCode == 200) {
            return true;
        } else {
            throw new Error(JSON.stringify(result.$metadata)); // cusotmize errors?
        }
    }

    async addFollower(followeeAlias: string, followerAlias: string): Promise<boolean> {
        const params = {
            TableName: this.tableName,
            Item: {
                follower_handle: followerAlias,
                followee_handle: followeeAlias,
            },
        };

        const command = new PutCommand(params);

        return this.doOperation(command, () => {
            return true;
        });

        const result = await this.ddb.send(command);
        if (result.$metadata.httpStatusCode == 200) {
            return true;
        } else {
            throw new Error(JSON.stringify(result.$metadata));
        }
    }


    async getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<[UserDto[], boolean]> {
        return this.getPage(followeeHandle, pageSize, lastFollowerHandle, false);
    }

    async getPageOfFollowees(
        followerHandle: string,
        pageSize: number,
        lastFolloweeHandle: string | undefined
    ): Promise<[UserDto[], boolean]> {
        return this.getPage(followerHandle, pageSize, lastFolloweeHandle, true);
    }

    async getPage(
        pkHandle: string,
        pageSize: number,
        lastFolloweeHandle: string | undefined,
        getFollowees: boolean
    ): Promise<[UserDto[], boolean]> {
        let pk: string;
        let sk: string;
        if (getFollowees == true) {
            pk = this.follower_handle_attr;
            sk = this.followee_handle_attr;
        } else {
            pk = this.followee_handle_attr;
            sk = this.follower_handle_attr;
        }

        let KeyConditionExpression = `${pk} = :pk`;
        let ExpressionAttributeValues = lastFolloweeHandle
            ? { ":pk": `${pkHandle}`, ":last": lastFolloweeHandle ?? 0 }
            : { ":pk": `${pkHandle}` };

        if (lastFolloweeHandle) {
            KeyConditionExpression += ` AND ${sk} > :last`;
        }

        let params;
        if (getFollowees == true){
            params = {
                TableName: this.tableName,
                KeyConditionExpression: KeyConditionExpression,
                ExpressionAttributeValues: ExpressionAttributeValues,
                Limit: pageSize,
            };
        } else {
            params = {
                TableName: this.tableName,
                IndexName: this.indexName,
                KeyConditionExpression: KeyConditionExpression,
                ExpressionAttributeValues: ExpressionAttributeValues,
                Limit: pageSize,
            };
        }

        const command = new QueryCommand(params);
        return await this.doOperation(command, async (result: QueryCommandOutput) => {
            let hasMore: boolean = false;
            if (result.LastEvaluatedKey){
                hasMore = true;
            }
            if (result.Items){
                // const items = result.Items as unknown as FollowsDto[]; // hopefully this doesn't break things... >>Q<< 
                const userDtos: UserDto[] = [];
                // construct UserDtos - is there a better place for this?
                let target;
                if (getFollowees == true){
                    target = this.followee_handle_attr;
                } else {
                    target = this.follower_handle_attr;
                }

                for (const item of result.Items){
                    const raw = item[target];
                    if (typeof raw !== "string") {
                        console.error("Unexpected type for alias:", raw);
                        continue;
                    }
                    const target_alias: string = item[target] as unknown as string;
                    const singleDto: UserDto = await this.userDao.getUser(target_alias);
                    userDtos.push(singleDto);
                }
                
                return [userDtos, hasMore];
            }
        });
    }
}
