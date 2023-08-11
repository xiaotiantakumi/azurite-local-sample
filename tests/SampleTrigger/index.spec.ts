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
      name: "aaa",
    },
  };
  await httpTrigger(context, req);
  expect(context.res?.status).toBe(200);
});
