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
test("ファイルダウンロード成功", async () => {
  const context = mock<Context>();
  const containerName = "container1";
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
  const containerName = "container1";
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
