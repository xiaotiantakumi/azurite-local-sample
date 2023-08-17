import { Context } from "@azure/functions";
import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";

/**
 * 指定されたコンテナとファイル名に対応するBlobクライアントを取得します。コンテナが存在しない場合はエラーを返します。
 * @param context
 * @param containerName
 * @param fileName
 * @returns
 */
async function getContainerClient(containerName: string) {
  const STORAGE_CONNECTION_STRING = process.env.STORAGE_CONNECTION_STRING || "";
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    STORAGE_CONNECTION_STRING
  );
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const hasContainer = await containerClient.exists();
  if (!hasContainer) {
    return null;
  }
  return containerClient;
}

/**
 * getBlobClientを使用してBlobクライアントを取得し、ファイルが存在するか確認します。ファイルが存在しない場合はエラーを返します。
 * @param context
 * @param containerName
 * @param fileName
 * @returns
 */
async function getBlockBlob(
  context: Context,
  containerName: string,
  fileName: string
): Promise<BlockBlobClient | null> {
  const blobClient = await getContainerClient(containerName);
  if (!blobClient) {
    context.res = {
      status: 500,
      body: `コンテナが存在しません`,
    };
    return null;
  }
  const blockBlob = blobClient.getBlockBlobClient(fileName);

  const hasItem = await blockBlob.exists();
  if (!hasItem) {
    context.res = {
      status: 404,
      body: `ファイルが存在しません`,
    };
    return null;
  }
  return blockBlob;
}

/**
 * 指定されたファイル名でファイルを作成します。
 * @param context
 * @param containerName
 * @param fileName
 * @returns
 */
export async function createBlockBlob(
  context: Context,
  containerName: string,
  fileName: string,
  buffer: Buffer
): Promise<BlockBlobClient | null> {
  const blobClient = await getContainerClient(containerName);
  if (!blobClient) {
    context.res = {
      status: 500,
      body: `コンテナが存在しません`,
    };
    return null;
  }
  // ここでファイルを作成する
  const blockBlob = blobClient.getBlockBlobClient(fileName);
  await blockBlob.upload(buffer, buffer.length);
  return blockBlob;
}

/**
 * getBlobClientを使用してBlobクライアントを取得し、ファイルが存在するか確認する。
 * @param context
 * @param containerName
 * @param fileName
 * @returns
 */
export async function hasFile(
  context: Context,
  containerName: string,
  fileName: string
): Promise<boolean> {
  const blockBlob = await getBlockBlob(context, containerName, fileName);
  if (!blockBlob) return false;

  return await blockBlob.exists();
}
/**
 * 指定されたコンテナとファイル名からファイルをダウンロードし、バッファとして返します。
 * @param context
 * @param containerName
 * @param fileName
 * @returns
 */
export async function downloadStorageItemWithBuffer(
  context: Context,
  containerName: string,
  fileName: string
) {
  try {
    const blobClient = await getBlockBlob(context, containerName, fileName);
    if (!blobClient) return;

    const buffer = await blobClient.downloadToBuffer();
    return buffer;
  } catch (error) {
    context.res = {
      status: 500,
      body: error,
    };
  }
}

/**
 * 指定されたコンテナとファイル名にバッファをアップロードします。成功時には成功メッセージを返します。
 * @param context
 * @param containerName
 * @param fileName
 * @param buffer
 * @returns
 */
export async function uploadStorageItemWithBuffer(
  context: Context,
  containerName: string,
  fileName: string,
  buffer: Buffer
) {
  try {
    const blobClient = await getBlockBlob(context, containerName, fileName);
    if (!blobClient) return;

    await blobClient.upload(buffer, buffer.length);

    context.res = {
      status: 200,
      body: `ファイルが正常にアップロードされました`,
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: error,
    };
  }
}

/**
 * 指定されたコンテナとファイル名のファイルを削除します。成功時には成功メッセージを返します。
 * @param context
 * @param containerName
 * @param fileName
 */

export async function deleteStorageItem(
  context: Context,
  containerName: string,
  fileName: string
) {
  try {
    const blobClient = await getBlockBlob(context, containerName, fileName);
    if (!blobClient) return;

    await blobClient.delete();

    context.res = {
      status: 200,
      body: `ファイルが正常に削除されました`,
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: error,
    };
  }
}
