import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { downloadStorageItemWithBuffer } from "./blobHelper";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const fileName = req.query.fileName || (req.body && req.body.fileName);
  const blobData = await downloadStorageItemWithBuffer(
    context,
    "container1",
    fileName
  );
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: blobData,
  };
};

export default httpTrigger;
