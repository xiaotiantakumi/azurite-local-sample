import { Context } from "@azure/functions";
import { BlobServiceClient } from "@azure/storage-blob";

/**
 * 指定されたコンテナとファイル名に対応するBlobクライアントを取得します。コンテナが存在しない場合はエラーを返します。
 * @param context
 * @param containerName
 * @param fileName
 * @returns
 */
async function getBlobClient(
  context: Context,
  containerName: string,
  fileName: string
) {
  const STORAGE_CONNECTION_STRING = process.env.STORAGE_CONNECTION_STRING || "";
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    STORAGE_CONNECTION_STRING
  );
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const hasContainer = await containerClient.exists();
  if (!hasContainer) {
    context.res = {
      status: 500,
      body: `コンテナが存在しません`,
    };
    return null;
  }
  return containerClient.getBlockBlobClient(fileName);
}
/**
 * getBlobClientを使用してBlobクライアントを取得し、ファイルが存在するか確認します。ファイルが存在しない場合はエラーを返します。
 * @param context
 * @param containerName
 * @param fileName
 * @returns
 */
async function getExistingBlobClient(
  context: Context,
  containerName: string,
  fileName: string
) {
  const blobClient = await getBlobClient(context, containerName, fileName);
  if (!blobClient) return null;

  const hasItem = await blobClient.exists();
  if (!hasItem) {
    context.res = {
      status: 404,
      body: `ファイルが存在しません`,
    };
    return null;
  }

  return blobClient;
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
    const blobClient = await getExistingBlobClient(
      context,
      containerName,
      fileName
    );
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
    const blobClient = await getBlobClient(context, containerName, fileName);
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
    const blobClient = await getExistingBlobClient(
      context,
      containerName,
      fileName
    );
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
