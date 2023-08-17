import { mock } from "jest-mock-extended";
import { Context } from "@azure/functions";
import {
  deleteStorageItem,
  downloadStorageItemWithBuffer,
  uploadStorageItemWithBuffer,
  createBlockBlob,
  hasFile,
  searchFiles,
  getContainerClient,
} from "../../SampleTrigger/blobHelper";

beforeAll(() => {
  jest.clearAllMocks();
});

const containerName = "container1";
const deleteContainerName = "container2";

test("ファイルダウンロード失敗 - ファイルが存在しない", async () => {
  const context = mock<Context>();
  const fileName = "nonexistent-file.txt";
  const container = await getContainerClient(containerName);
  if (!container) {
    throw new Error("コンテナが存在しません");
  }
  const buffer = await downloadStorageItemWithBuffer(
    context,
    container,
    fileName
  );
  expect(buffer).toBeUndefined();
  expect(context.res?.status).toBe(404);
});

test("ファイルアップロード失敗 - コンテナが存在しない", async () => {
  const container = await getContainerClient("nonexistent-container");
  expect(container).toBeNull();
});

test("ファイル削除失敗 - ファイルが存在しない", async () => {
  const context = mock<Context>();
  const fileName = "nonexistent-file.txt";
  const container = await getContainerClient(containerName);
  if (!container) {
    throw new Error("コンテナが存在しません");
  }
  await deleteStorageItem(context, container, fileName);
  expect(context.res?.status).toBe(404);
});

test("ファイルダウンロード成功", async () => {
  const context = mock<Context>();
  const fileName = "sample.txt";
  const container = await getContainerClient(containerName);
  if (!container) {
    throw new Error("コンテナが存在しません");
  }
  const buffer = await downloadStorageItemWithBuffer(
    context,
    container,
    fileName
  );
  expect(buffer).toBeDefined();
});

test("ファイル存在チェック - ファイルが存在する場合", async () => {
  const context = mock<Context>();
  const fileName = "sample.txt";
  const container = await getContainerClient(containerName);
  if (!container) {
    throw new Error("コンテナが存在しません");
  }
  const result = await hasFile(context, container, fileName);
  expect(result).toBe(true);
});

test("ファイル存在チェック - ファイルが存在しない場合", async () => {
  const context = mock<Context>();
  const fileName = "nonexistent-file.txt";
  const container = await getContainerClient(containerName);
  if (!container) {
    throw new Error("コンテナが存在しません");
  }
  const result = await hasFile(context, container, fileName);
  expect(result).toBe(false);
});

test("ファイルアップロード成功", async () => {
  const context = mock<Context>();
  const fileName = "sample-file.txt";
  const buffer = Buffer.from("Hello, World!");
  const container = await getContainerClient(containerName);
  if (!container) {
    throw new Error("コンテナが存在しません");
  }
  await uploadStorageItemWithBuffer(context, container, fileName, buffer);
  expect(context.res?.status).toBe(200);
});

test("ファイル検索確認が正しく行われるか", async () => {
  const context = mock<Context>();
  const files = [
    "search-1.txt",
    "search-2.txt",
    "search-3.txt",
    "hogesearch4.txt",
    "search.txt",
  ];
  const buffer = Buffer.from("Hello, World!");
  const container = await getContainerClient(deleteContainerName);
  if (!container) {
    throw new Error("コンテナが存在しません");
  }
  for (const file of files) {
    await createBlockBlob(context, container, file, buffer);
  }
  // search
  const searchResult = await searchFiles(context, container, "search");
  if (!searchResult) {
    throw new Error("検索結果が存在しません");
  }
  expect(searchResult.length).toBe(5);
  for (const file of files) {
    await deleteStorageItem(context, container, file);
  }
});

test("ファイル削除成功", async () => {
  const context = mock<Context>();
  const fileName = "sample-file.txt";
  const buffer = Buffer.from("Hello, World!");
  const container = await getContainerClient(deleteContainerName);
  if (!container) {
    throw new Error("コンテナが存在しません");
  }
  await createBlockBlob(context, container, fileName, buffer);
  console.log("uploadStorageItemWithBuffer", context.res);
  const checkExist = await downloadStorageItemWithBuffer(
    context,
    container,
    fileName
  );
  if (!checkExist) {
    throw new Error("ファイルが存在しません");
  }
  await deleteStorageItem(context, container, fileName);
  expect(context.res?.status).toBe(200);
});
