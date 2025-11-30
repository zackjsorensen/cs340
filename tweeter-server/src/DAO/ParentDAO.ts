import {
    BatchWriteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    UpdateCommand,
    DeleteCommand,
    QueryCommand,
    PutCommand,
} from "@aws-sdk/lib-dynamodb";

import {
    DynamoDBClient,
    BatchWriteItemCommand,
    BatchWriteItemCommandInput,
} from "@aws-sdk/client-dynamodb";

import {region} from "tweeter-shared";

export class ParentDAO {
    client: DynamoDBClient = new DynamoDBClient({region: `${region}`});
    ddb = DynamoDBDocumentClient.from(this.client);
    
}

import { Command } from "@smithy/smithy-client";

export type AnyDynamoCommand = Command<any, any, any, any>;
