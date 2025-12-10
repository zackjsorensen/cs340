import { FollowsDAO } from "./FollowsDAO";
import {
    BatchWriteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    UpdateCommand,
    DeleteCommand,
    QueryCommand,
    PutCommand,
    QueryCommandInput,
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
        if (result.Item){
            return true;
        } else{
            return false;
        }
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


     async putBatchOfFollowers(items: FollowsDto[]): Promise<boolean>{
        const params = {
            RequestItems: {
                [this.tableName]: items.map((item: FollowsDto) => ({
                    PutRequest: {Item: {
                        follower_handle: item.follower_handle,   // bandaid fix: Change later
                        followee_handle: item.followee_handle
                    }}
                }))
            }
        };
        const command = new BatchWriteCommand(params);
        return await this.doOperation(command, () => {return true;});
    }



    async addFollower(followeeAlias: string, followerAlias: string): Promise<boolean> {
        const params = {
            TableName: this.tableName,
            Item: { // bandaid fix: change later
                follower_handle: followeeAlias,
                followee_handle: followerAlias,
            },
        };

        const command = new PutCommand(params);
        console.log(`DynamoFollowsDAO: follow request: ${followeeAlias} <-- ${followerAlias}\n\n`);

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
        console.log(`GET_PAGE_OF_FOLLOWERS in DynamoFollowersDAO was passed this ARGUMENT for lastFollowerHandle: ${lastFollowerHandle}\n`);
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
        console.log(`GET_PAGE in DynamoFollwsDAO was passed this value for lastFolloweeHandle: ${lastFolloweeHandle}\n`);
        let pk: string;
        let sk: string;
        let startKey;
        if (getFollowees == true) {
            pk = this.follower_handle_attr;
            sk = this.followee_handle_attr;
            startKey = {
                follower_handle: pkHandle,
                followee_handle: lastFolloweeHandle
            };
        } else {
            pk = this.followee_handle_attr;
            sk = this.follower_handle_attr;
            startKey = {
                followee_handle: pkHandle,
                follower_handle: lastFolloweeHandle
            }
        }

        let KeyConditionExpression = `${pk} = :pk`;
        let ExpressionAttributeValues = { ":pk": `${pkHandle}` };
        

        let params: QueryCommandInput;
        if (getFollowees == true){
            params = {
                TableName: this.tableName,
                KeyConditionExpression: KeyConditionExpression,
                ExpressionAttributeValues: ExpressionAttributeValues,
                Limit: pageSize
            };
        } else {
            params = {
                TableName: this.tableName,
                IndexName: this.indexName,
                KeyConditionExpression: KeyConditionExpression,
                ExpressionAttributeValues: ExpressionAttributeValues,
                Limit: pageSize
            };
        }
        console.log(`START KEY: ${JSON.stringify(startKey)}`);
        if (lastFolloweeHandle) {
            params.ExclusiveStartKey = startKey;
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

/* 

We get an error when we try to fan the story out to followers, bc 
LIMIT has to be >0, and if we have a user with no followers, we set LIMIT = 0

*/
