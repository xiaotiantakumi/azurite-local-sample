import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import {
  getContainerClient,
  downloadStorageItemWithBuffer,
} from "./blobHelper";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const fileName = req.query.fileName || (req.body && req.body.fileName);
  const container = await getContainerClient("container1");
  if (!container) {
    throw new Error("コンテナが存在しません");
  }
  const blobData = await downloadStorageItemWithBuffer(
    context,
    container,
    fileName
  );
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: blobData,
  };
};

export default httpTrigger;
