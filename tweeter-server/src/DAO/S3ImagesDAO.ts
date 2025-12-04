import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { ImageDAO } from "./ImagesDAO";
import { ParentDAO } from "./ParentDAO";
import { S3Client, PutObjectCommand, PutObjectCommandOutput, DeleteObjectCommand, DeleteObjectCommandOutput } from "@aws-sdk/client-s3";



export class S3ImagesDAO extends ParentDAO implements ImageDAO{
    s3 = new S3Client({region: "us-east-2"});
    bucketName: string = "tweeter-cs340-images";
    
    
    async putImage(userAlias: string, imageBytes: Uint8Array, imageFileExtension: string): Promise<string> {
        const key = `users/${userAlias}`;
        const params = {
            Bucket: this.bucketName,
            Key: key,
            Body: Buffer.from(imageBytes),
            ContentType: `image/${imageFileExtension}`
        };
        const command = new PutObjectCommand(params);
        const result = await this.s3.send(command);
        if (result.$metadata.httpStatusCode == 200){
            return `https://${this.bucketName}.s3.${this.s3.config.region}.amazonaws.com/${encodeURIComponent(key)}`;
            //    https://tweeter-cs340-images.s3.us-east-2.amazonaws.com/users/%40Cosmo
        } else {
            throw new Error("Failed to put image");
        }
    }

    async deleteImage(userAlias: string): Promise<boolean> {
        const key = `users/${userAlias}`;
        const params = {
            Bucket: this.bucketName,
            Key: key
        };
        const command = new DeleteObjectCommand(params);
        const result = await this.s3.send(command);
        return result.$metadata.httpStatusCode == 200 || result.$metadata.httpStatusCode == 204;
    }

    async updateImage(userAlias: string, newImageBytes: Uint8Array, newImageFileExtension: string): Promise<string> {
        await this.deleteImage(userAlias);
        return await this.putImage(userAlias, newImageBytes, newImageFileExtension);
    }
}