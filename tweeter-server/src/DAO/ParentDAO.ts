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

    async doOperation(command: AnyDynamoCommand, parseResult: Function, errorMessage?: string) {
        const msg = errorMessage ? `${errorMessage}\n` : "";
        const result = await this.ddb.send(command);
        if (result.$metadata.httpStatusCode == 200) {
            return parseResult(result);
        } else {
            throw new Error(`${msg}${JSON.stringify(result.$metadata)}`);
        }
    }
    
}

import { Command } from "@smithy/smithy-client";

export type AnyDynamoCommand = Command<any, any, any, any>;
