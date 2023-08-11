import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getAll } from "../db-service/sampleTableService";
import { getInitializedAppDataSource } from "../db-service/appDataSource";

const httpTrigger: AzureFunction = async function (
  context: Context
): Promise<void> {
  const appDataSource = await getInitializedAppDataSource();
  try {
    const samples = await getAll(appDataSource);
    context.res = {
      status: 200,
      body: samples,
    };
  } catch (error) {
    console.log(error);
  } finally {
    appDataSource.destroy();
  }
};

export default httpTrigger;
