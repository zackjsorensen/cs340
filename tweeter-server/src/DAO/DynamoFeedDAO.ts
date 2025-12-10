import { StatusDto } from "tweeter-shared";
import { StatusDAO } from "./FeedDAO";
import { ParentDAO } from "./ParentDAO";
import { BatchWriteCommand, GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { PostMessage } from "./QueueDAO";

export class DynamoFeedDAO extends ParentDAO implements StatusDAO {
    readonly tableName = "feed";
    readonly gsiName = "stories";
    readonly pkAttr = "feed_owner_handle";
    readonly skAttr = "timestamp";
    readonly gsiPkAttr = "author_handle";
    readonly skAttrAlias = "#tstamp";

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

        
    async OldgetStoriesPage(userAlias: string, pageSize: number, lastItem: StatusDto | undefined): Promise<[StatusDto[], boolean]> {
        
        // just need to query the index
        // temp log
        const [vals, hasMore] = await this.getPageOfStatuses(this.gsiPkAttr, userAlias, pageSize, lastItem, false);
        for (let val in vals){
            console.log(`DYNAMO_FEED_DAO recieved this first story: ${JSON.stringify(val)}`);
            break;
        }
        return [vals, hasMore];
        // return await this.getPageOfStatuses(this.gsiPkAttr, userAlias, pageSize, lastItem, false);

    }

    async getStoriesPage(userAlias: string, pageSize: number, lastItem: StatusDto | undefined): Promise<[StatusDto[], boolean]> {
        let params;
        if (lastItem){
            params = {
                TableName: "stories",
                KeyConditionExpression: `author_handle = :pk AND #tstamp > :tstamp`,
                ExpressionAttributeNames: { "#tstamp": "timestamp" },
                ExpressionAttributeValues: {
                        ":pk": `${userAlias}`,
                        ":tstamp": Number(lastItem.timestamp)
                },
                Limit: pageSize
            };
        } else {
            params = {
                TableName: "stories",
                KeyConditionExpression: `author_handle = :pk`,
                ExpressionAttributeValues: {
                        ":pk": `${userAlias}`
                },
                Limit: pageSize
            };
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


    async getPageOfStatuses(pkAttr: string, userAlias: string, pageSize: number, lastItem: StatusDto | undefined, getFeed: boolean): Promise<[StatusDto[], boolean]> {
        // if no lastItem, no additional condition needed
        // let keyConditionExpression = `${pkAttr} = :pk`;
        // if (lastItem){
        //     keyConditionExpression += ` AND ${this.skAttrAlias} > :last`;
        // }
        // let expressionAttributeValues = lastItem ? {":pk": `${userAlias}`, ":last": `${lastItem.timestamp}`} : {":pk": `${userAlias}`};
        let params;
        if (getFeed == true){
            // get feed without worrying about timestamps
            if (lastItem){
                params = {
                    TableName: this.tableName,
                    KeyConditionExpression: `feed_owner_handle = :pk AND #tstamp > :tstamp`,
                    ExpressionAttributeNames: { "#tstamp": "timestamp" },
                    ExpressionAttributeValues: {
                        ":pk": `${userAlias}`,
                        ":tstamp": Number(lastItem.timestamp)
                    },
                    Limit: pageSize
                }
            } else {
                params = {
                    TableName: this.tableName,
                    KeyConditionExpression: "feed_owner_handle = :pk", // TODO: replace condition with ExlucsiveStartKey
                    ExpressionAttributeValues: {":pk": userAlias},
                    Limit: pageSize
                };
        }
        } else { // get stories
            if (lastItem){
                // need additional condition with timestamp
                params = {
                    TableName: this.tableName,
                    IndexName: this.gsiName,
                    KeyConditionExpression: `author_handle = :pk AND #tstamp > :tstamp`,
                    ExpressionAttributeNames: { "#tstamp": "timestamp" },
                    ExpressionAttributeValues: {
                        ":pk": `${userAlias}`,
                        ":tstamp": Number(lastItem.timestamp)
                    },
                    Limit: pageSize
                }
            } else { // don't need timestamp condition
                params = {
                    TableName: this.tableName,
                    IndexName: this.gsiName,
                    KeyConditionExpression: `author_handle = :pk`,
                    ExpressionAttributeValues: {
                        ":pk": `${userAlias}`
                    },
                    Limit: pageSize
                }
            }
        }

        // let's create a stories table
        /* 
        pk: author_handle
        sk: timestamp
        
        */


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
                segments: statusDto.segments,
                post: statusDto.post
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


    async putPostBatch(messages: PostMessage[]): Promise<boolean>{
        let tableName = "feed";
        let requestItems = {
            ["feed"]: messages.map(item => ({
                 PutRequest: { 
                    Item: {
                        feed_owner_handle: item.feed_owner_handle,
                        timestamp: item.statusDto.timestamp,
                        author_handle: item.statusDto.userDto.alias,
                        authorDto: item.statusDto.userDto,
                        segments: item.statusDto.segments,
                        post: item.statusDto.post
                    }
                } 
            }))
        };
        const cmd = new BatchWriteCommand({ RequestItems: requestItems });
        const resp = await this.ddb.send(cmd);
      // If there are unprocessed items, retry them after backoff
      const unprocessed = resp.UnprocessedItems && resp.UnprocessedItems[tableName]
        ? { [tableName]: resp.UnprocessedItems[tableName] }
        : {};

      if (Object.keys(unprocessed).length === 0) {
        // all done for this chunk
        return true;
      } else {
        return false; // need to refine this to actually retry failed ones
      }


    }


    async putStory(userAlias: string, statusDto: StatusDto): Promise<boolean> {
        const params = {
            TableName: "stories",
            Item: {
                author_handle: userAlias,
                timestamp: statusDto.timestamp,
                authorDto: statusDto.userDto,
                segments: statusDto.segments,
                post: statusDto.post
            }
        };

        const command = new PutCommand(params);
        const result = await this.ddb.send(command);
        if (result.$metadata.httpStatusCode == 200){
            return true;
        } else {
            throw new Error(`Failed to save post to story\nMetadata: ${JSON.stringify(result.$metadata)}`);;
        }
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
 