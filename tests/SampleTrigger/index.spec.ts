import httpTrigger from "../../SampleTrigger/index";
import { mock } from "jest-mock-extended";
import { Context } from "@azure/functions";

beforeAll(() => {
  jest.clearAllMocks();
});

test("サンプルテスト", async () => {
  const context = mock<Context>();
  const req = {
    body: {},
    query: {
      fileName: "sample.txt",
    },
  };
  await httpTrigger(context, req);
  expect(context.res?.body).toBeDefined();
});
