import { StatusDto } from "tweeter-shared";
import { ParentDAO } from "./ParentDAO";
import { PostMessage, QueueDAO } from "./QueueDAO";
import { SQSClient, SendMessageCommand, SendMessageBatchCommand } from "@aws-sdk/client-sqs";


export class SqsDAO extends ParentDAO implements QueueDAO{
    sqsClient = new SQSClient({region: "us-east-2"});
    postq1_url = "https://sqs.us-east-2.amazonaws.com/241877114920/postq1";
    postq2_url = "https://sqs.us-east-2.amazonaws.com/241877114920/postq2";

    async sendMessage(key: number, feed_owner_handle: string, statusDto: StatusDto): Promise<boolean> {
        const messageBody = {feed_owner_handle: feed_owner_handle, statusDto: statusDto};
        const messageString = JSON.stringify(messageBody);
        const url: string = (key == 1) ? this.postq1_url : this.postq2_url;
        const params = {
            QueueUrl: url,
            MessageBody: messageString
        };

        try {
            const data = await this.sqsClient.send(new SendMessageCommand(params));
            return true;
        } catch (err){
            return false;
        }
    }


    async sendMessageBatch(key: number, messages: PostMessage[]): Promise<boolean> {
        const url: string = (key == 1) ? this.postq1_url : this.postq2_url;
        const entries = messages.map((m, i)=>({
            Id: `msg-${i}`,
            MessageBody: JSON.stringify(m)
        }));

        const params = {
            QueueUrl: url, 
            Entries: entries
        };

        const command = new SendMessageBatchCommand(params);
        const result = await this.sqsClient.send(command);
        if (result.Failed && result.Failed.length) {
            console.error("Some entries failed", result.Failed);
            return false;
        } else {
            return true;
        }
        
    }
}