export interface IStoragePort {
  upload(file: Express.Multer.File, folder: string): Promise<string>;
  generateUploadUrl(
    fileName: string,
    folder: string,
    contentType: string,
  ): Promise<{ uploadUrl: string; fileUrl: string }>;
  delete(fileUrl: string): Promise<void>;
}

export const I_STORAGE_PORT = Symbol('IStoragePort');
