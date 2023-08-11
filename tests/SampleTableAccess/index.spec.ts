import httpTrigger from "../../SampleTableAccess/index";
import { mock } from "jest-mock-extended";
import { Context } from "@azure/functions";

beforeAll(() => {
  jest.clearAllMocks();
});

test("サンプルデータアクセステスト", async () => {
  const context = mock<Context>();
  const req = {
    body: {},
  };
  await httpTrigger(context, req);
  expect(context.res?.status).toBe(200);
});
