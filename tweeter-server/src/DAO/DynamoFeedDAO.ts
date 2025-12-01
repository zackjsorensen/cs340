import { StatusDto } from "tweeter-shared";
import { StatusDAO } from "./FeedDAO";
import { ParentDAO } from "./ParentDAO";
import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

export class DynamoFeedDAO extends ParentDAO implements StatusDAO {
    readonly tableName = "feed";
    readonly gsiName = "stories";
    readonly pkAttr = "feed_owner";
    readonly skAttr = "timestamp";
    readonly gsiPkAttr = "status_author";

    async getFeedPage(userAlias: string, pageSize: number, lastItem: StatusDto | undefined): Promise<[StatusDto[], boolean]> {
        return await this.getPageOfStatuses(this.pkAttr, userAlias, pageSize, lastItem, true);

        // if no lastItem, no additional condition needed
        // let keyConditionExpression = `${this.pkAttr} = :pk`;
        // if (lastItem){
        //     keyConditionExpression += `AND ${this.skAttr} > :last`;
        // }
        // let expressionAttributeValues = lastItem ? {":pk": `${userAlias}`, ":last": `${lastItem.timestamp}`} : {":pk": `${userAlias}`};

        // const params = {
        //     TableName: this.tableName,
        //     KeyConditionExpression: keyConditionExpression, // TODO: replace condition with ExlucsiveStartKey
        //     ExpressionAttributeValues: expressionAttributeValues,
        //     Limit: pageSize
        // };
        // const command = new QueryCommand(params);
        // const result = await this.ddb.send(command);
        // if (result.$metadata.httpStatusCode == 200){
        //     const hasMore: boolean = result.LastEvaluatedKey ? true : false;
        //     const items = result.Items;
        //     if (items){
        //         const statusDtos = this.itemsToDtos(items);
        //         return [statusDtos, hasMore];
        //     } else {
        //         return [[], false]; // >>Q<< is this right? Or should it be null rather than []?
        //     }
        // }
    }

        
    async getStoriesPage(userAlias: string, pageSize: number, lastItem: StatusDto | undefined): Promise<[StatusDto[], boolean]> {
        // just need to query the index
        return await this.getPageOfStatuses(this.gsiPkAttr, userAlias, pageSize, lastItem, false);
    }


    async getPageOfStatuses(pkAttr: String, userAlias: string, pageSize: number, lastItem: StatusDto | undefined, getFeed: boolean): Promise<[StatusDto[], boolean]> {
        // if no lastItem, no additional condition needed
        let keyConditionExpression = `${pkAttr} = :pk`;
        if (lastItem){
            keyConditionExpression += `AND ${this.skAttr} > :last`;
        }
        let expressionAttributeValues = lastItem ? {":pk": `${userAlias}`, ":last": `${lastItem.timestamp}`} : {":pk": `${userAlias}`};
        let params;
        if (getFeed == true){
            params = {
                TableName: this.tableName,
                KeyConditionExpression: keyConditionExpression, // TODO: replace condition with ExlucsiveStartKey
                ExpressionAttributeValues: expressionAttributeValues,
                Limit: pageSize
            };
        } else {
            params = {
                TableName: this.tableName,
                IndexName: this.gsiName,
                KeyConditionExpression: keyConditionExpression, // TODO: replace condition with ExlucsiveStartKey
                ExpressionAttributeValues: expressionAttributeValues,
                Limit: pageSize
            }
        }


        const command = new QueryCommand(params);
        const result = await this.ddb.send(command);
        if (result.$metadata.httpStatusCode == 200){
            const hasMore: boolean = result.LastEvaluatedKey ? true : false;
            const items = result.Items;
            if (items){
                const statusDtos = this.itemsToDtos(items);
                return [statusDtos, hasMore];
            } else {
                return [[], false]; // >>Q<< is this right? Or should it be null rather than []?
            }
        }
    }


    async putPost(authorAlias: string, statusDto: StatusDto, destAlias: string): Promise<boolean> {
        // simple: Just puts the post in the followerAlias's feed
        // can use to put in story by passing in followerAlias with same val as authorAlias
        const params = {
            TableName: this.tableName,
            Item: {
                feed_owner_handle: destAlias,
                timestamp: statusDto.timestamp,
                author_handle: authorAlias,
                authorDto: statusDto.userDto,
                segments: statusDto.segments
            },
        };
        
        const command = new PutCommand(params);
        const result = await this.ddb.send(command);
        if (result.$metadata.httpStatusCode == 200){
            return true;
        } else {
            throw new Error(`Failed to send post to user ${destAlias}\nMetadata: ${JSON.stringify(result.$metadata)}`);;
        }
    }

    async putStory(userAlias: string, statusDto: StatusDto): Promise<boolean> {
        return await this.putPost(userAlias, statusDto, userAlias);
    }


    private itemsToDtos(items: Record<string, any>[]): StatusDto[]{
        const statuses: StatusDto[] = (items.map(item=> (
            {
            post: item.post,
            userDto: item.authorDto,
            timestamp : item.timestamp,
            segments: item.segments
        })));
        return statuses;
    }
}

/* feed table
    - table name: feed
    - PK: feed_owner_handle, SK: timestamp
        - rest of statusDtoAttrs
    - GSI: stories
        - PK: author_handle
        - SK: timestamp
*/
 