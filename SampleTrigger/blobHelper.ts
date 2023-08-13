import { Context } from "@azure/functions";
import { BlobServiceClient } from "@azure/storage-blob";

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
 * ストレージからファイル削除を実行
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
