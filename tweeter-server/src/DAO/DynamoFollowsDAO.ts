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

export class DynamoFollowsDAO extends ParentDAO implements FollowsDAO {
    readonly tableName = "follows";
    readonly follower_handle_attr = "follower_handle";
    readonly followee_handle_attr = "followee_handle";

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

    async doOperation(command: AnyDynamoCommand, parseResult: Function) {
        const result = await this.ddb.send(command);
        if (result.$metadata.httpStatusCode == 200) {
            return parseResult(result);
        } else {
            throw new Error(JSON.stringify(result.$metadata));
        }
    }

    async getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<any> {
        return this.getPage(followeeHandle, pageSize, lastFollowerHandle, false);
    }

    async getPageOfFollowees(
        followerHandle: string,
        pageSize: number,
        lastFolloweeHandle: string | undefined
    ): Promise<any> {

        return this.getPage(followerHandle, pageSize, lastFolloweeHandle, true);
        // let KeyConditionExpression = `${this.follower_handle_attr} = :pk`;
        // let ExpressionAttributeValues = lastFolloweeHandle
        //     ? { ":pk": `${followerHandle}`, ":last": lastFolloweeHandle ?? 0 }
        //     : { ":pk": `${followerHandle}` };

        // if (lastFolloweeHandle) {
        //     KeyConditionExpression += `AND ${this.followee_handle_attr} > :last`;
        // }

        // const params = {
        //     TableName: this.tableName,
        //     KeyConditionExpression: KeyConditionExpression,
        //     ExpressionAttributeValues: ExpressionAttributeValues,
        //     Limit: pageSize,
        // };
        // const command = new QueryCommand(params);
        // return this.doOperation(command, (result: any) => {
        //     return result.Items;
        // });
    }

    async getPage(
        pkHandle: string,
        pageSize: number,
        lastFolloweeHandle: string | undefined,
        getFollowees: boolean
    ): Promise<any> {
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
            KeyConditionExpression += `AND ${sk} > :last`;
        }

        const params = {
            TableName: this.tableName,
            KeyConditionExpression: KeyConditionExpression,
            ExpressionAttributeValues: ExpressionAttributeValues,
            Limit: pageSize,
        };
        const command = new QueryCommand(params);
        return this.doOperation(command, (result: any) => {
            return result.Items;
        });
    }
}
