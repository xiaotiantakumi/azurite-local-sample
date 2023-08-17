import { Context } from "@azure/functions";
import {
  BlobServiceClient,
  BlockBlobClient,
  ContainerClient,
} from "@azure/storage-blob";

/**
 * 指定されたコンテナとファイル名に対応するBlobクライアントを取得します。コンテナが存在しない場合はエラーを返します。
 * @param context
 * @param containerName
 * @param fileName
 * @returns
 */
export async function getContainerClient(containerName: string) {
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
  container: ContainerClient,
  fileName: string
): Promise<BlockBlobClient | null> {
  const blockBlob = container.getBlockBlobClient(fileName);

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
 * getBlobClientを使用してBlobクライアントを取得し、ファイルが存在するか確認します。ファイルが存在しない場合はエラーを返します。
 * @param context
 * @param container
 * @param fileName
 * @returns
 */
export async function searchFiles(
  context: Context,
  container: ContainerClient,
  searchName: string
): Promise<string[] | null> {
  const matchingBlobs = [];
  for await (const blobItem of container.listBlobsFlat()) {
    if (blobItem.name.includes(searchName)) {
      matchingBlobs.push(blobItem.name);
    }
  }
  if (matchingBlobs.length === 0) {
    context.res = {
      status: 404,
      body: `ファイルが存在しません`,
    };
    return null;
  }
  return matchingBlobs;
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
  container: ContainerClient,
  fileName: string,
  buffer: Buffer
): Promise<BlockBlobClient | null> {
  // ファイルが存在する場合はエラーを返す
  const hasItem = await hasFile(context, container, fileName);
  if (hasItem) {
    return null;
  }
  // ここでファイルを作成する
  const blockBlob = container.getBlockBlobClient(fileName);
  await blockBlob.upload(buffer, buffer.length);
  return blockBlob;
}

/**
 * getBlobClientを使用してBlobクライアントを取得し、ファイルが存在するか確認する。
 * @param context
 * @param container
 * @param fileName
 * @returns
 */
export async function hasFile(
  context: Context,
  container: ContainerClient,
  fileName: string
): Promise<boolean> {
  const blockBlob = await getBlockBlob(context, container, fileName);
  if (!blockBlob) return false;

  return await blockBlob.exists();
}
/**
 * 指定されたコンテナとファイル名からファイルをダウンロードし、バッファとして返します。
 * @param context
 * @param container
 * @param fileName
 * @returns
 */
export async function downloadStorageItemWithBuffer(
  context: Context,
  container: ContainerClient,
  fileName: string
) {
  try {
    const blobClient = await getBlockBlob(context, container, fileName);
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
 * @param container
 * @param fileName
 * @param buffer
 * @returns
 */
export async function uploadStorageItemWithBuffer(
  context: Context,
  container: ContainerClient,
  fileName: string,
  buffer: Buffer
) {
  try {
    const blobClient = await getBlockBlob(context, container, fileName);
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
 * @param container
 * @param fileName
 */
export async function deleteStorageItem(
  context: Context,
  container: ContainerClient,
  fileName: string
) {
  try {
    const blobClient = await getBlockBlob(context, container, fileName);
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
