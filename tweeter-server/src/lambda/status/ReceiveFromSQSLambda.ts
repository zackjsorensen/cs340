import { BatchWriteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

interface PostMessage{
    feed_owner_handle: string,
    statusDto: StatusDto
}

interface StatusDto{
    readonly post: string,
    readonly userDto: UserDto,
    readonly timestamp : number,
    readonly segments: PostSegmentDto[];
}

interface UserDto{
    readonly firstName: string,
    readonly lastName: string,
    readonly alias: string,
    readonly imageUrl: string  // links to image in S3
}

interface PostSegmentDto{
    readonly text: string,
    readonly startPosition: number,
    readonly endPosition: number,
    readonly type: string
}

const client: DynamoDBClient = new DynamoDBClient({region: `us-east-2`});
const ddb = DynamoDBDocumentClient.from(client);


    const putPostBatch = async (messages: PostMessage[]): Promise<boolean> => {
        
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
        const resp = await ddb.send(cmd);
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




export const handler = async (event: any): Promise<void> => {
    let messages = [];
    for (let i = 0; i < event.Records.length; ++i) {
        const { body } = event.Records[i];
        console.log(JSON.stringify(body));
        // putPost();
        // group into batches of 25 for writing
        messages.push(JSON.parse(body));
        if(messages.length == 25){
            const response = await putPostBatch(messages);
            console.log(`Response from putting batch of statuses: ${JSON.stringify(response)}`);
            messages = [];
        }
    }
    // get any stragglers
    await putPostBatch(messages);
    return;
};

