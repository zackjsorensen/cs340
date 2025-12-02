import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { ImageDAO } from "./ImagesDAO";
import { ParentDAO } from "./ParentDAO";
import { S3Client, PutObjectCommand, PutObjectCommandOutput, DeleteObjectCommand, DeleteObjectCommandOutput } from "@aws-sdk/client-s3";



export class S3ImagesDAO extends ParentDAO implements ImageDAO{
    s3 = new S3Client({region: "us-east-2"});
    bucketName: string = "user_profile_images";
    
    
    async putImage(userAlias: string, imageBytes: Uint8Array, imageFileExtension: string): Promise<string> {
        const key = `users/${userAlias}`;
        const params = {
            Bucket: this.bucketName,
            Key: key,
            Body: imageBytes,
            ContentType: `image/${imageFileExtension}`
        };
        const command = new PutObjectCommand(params);
        return await this.doOperation(command, (result: PutObjectCommandOutput) => {
             // Return a permanent URL if the bucket/object is public:
            return `https://${this.bucketName}.s3.${this.s3.config.region}.amazonaws.com/${key}`;
        });
    }

    async deleteImage(userAlias: string): Promise<boolean> {
        const key = `users/${userAlias}`;
        const params = {
            Bucket: this.bucketName,
            Key: key
        };
        const command = new DeleteObjectCommand(params);
        return await this.doOperation(command, (result: DeleteObjectCommandOutput) => {
            return true;
        });
    }

    async updateImage(userAlias: string, newImageBytes: Uint8Array, newImageFileExtension: string): Promise<string> {
        await this.deleteImage(userAlias);
        return await this.putImage(userAlias, newImageBytes, newImageFileExtension);
    }
}