export interface ImageDAO{
    putImage(userAlias: string, imageBytes: Uint8Array, imageFileExtension: string): Promise<string>;
    getImage(userALias: string): Promise<Uint8Array>;
    updateImage(userAlias: string, newImageBytes: Uint8Array): Promise<string>;
    deleteImage(userAlias: string): Promise<boolean>;
}