import { StatusDto } from "tweeter-shared";
import { FeedDAO } from "./FeedDAO";
import { ParentDAO } from "./ParentDAO";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

export class DynamoFeedDAO extends ParentDAO implements FeedDAO {
    readonly tableName = "follows";
    readonly follower_handle_attr = "follower_handle";
    readonly followee_handle_attr = "followee_handle";

    getFeed(userAlias: string): StatusDto[] {
        const params = {
            TableName: this.tableName,
            Key: {
                userAlias: userAlias
            },
        };
        const command = new GetCommand(params);
    }
}
