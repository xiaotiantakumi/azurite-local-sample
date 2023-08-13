import { mock } from "jest-mock-extended";
import { Context } from "@azure/functions";
import {
  deleteStorageItem,
  downloadStorageItemWithBuffer,
  uploadStorageItemWithBuffer,
} from "../../SampleTrigger/blobHelper";

beforeAll(() => {
  jest.clearAllMocks();
});

const containerName = "container1";
const deleteContainerName = "container2";

test("ファイルダウンロード失敗 - ファイルが存在しない", async () => {
  const context = mock<Context>();
  const fileName = "nonexistent-file.txt";

  const buffer = await downloadStorageItemWithBuffer(
    context,
    containerName,
    fileName
  );
  expect(buffer).toBeUndefined();
  expect(context.res?.status).toBe(404);
});

test("ファイルアップロード失敗 - コンテナが存在しない", async () => {
  const context = mock<Context>();
  const fileName = "sample-file.txt";
  const buffer = Buffer.from("Hello, World!");

  await uploadStorageItemWithBuffer(
    context,
    "nonexistent-container",
    fileName,
    buffer
  );
  expect(context.res?.status).toBe(500);
});

test("ファイル削除失敗 - ファイルが存在しない", async () => {
  const context = mock<Context>();
  const fileName = "nonexistent-file.txt";

  await deleteStorageItem(context, containerName, fileName);
  expect(context.res?.status).toBe(404);
});

test("ファイルダウンロード成功", async () => {
  const context = mock<Context>();
  const fileName = "sample.txt";

  const buffer = await downloadStorageItemWithBuffer(
    context,
    containerName,
    fileName
  );
  expect(buffer).toBeDefined();
});

test("ファイルアップロード成功", async () => {
  const context = mock<Context>();
  const fileName = "sample-file.txt";
  const buffer = Buffer.from("Hello, World!");

  await uploadStorageItemWithBuffer(context, containerName, fileName, buffer);
  expect(context.res?.status).toBe(200);
});

test("ファイル削除成功", async () => {
  const context = mock<Context>();
  const fileName = "sample-file.txt";
  const buffer = Buffer.from("Hello, World!");
  await uploadStorageItemWithBuffer(
    context,
    deleteContainerName,
    fileName,
    buffer
  );
  console.log("uploadStorageItemWithBuffer", context.res);
  const checkExist = await downloadStorageItemWithBuffer(
    context,
    deleteContainerName,
    fileName
  );
  if (!checkExist) {
    throw new Error("ファイルが存在しません");
  }
  await deleteStorageItem(context, deleteContainerName, fileName);
  expect(context.res?.status).toBe(200);
});
