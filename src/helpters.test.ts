import { capitalize } from "./helpers";

test("capitalize", () => {
  expect(capitalize("hello_world")).toEqual("Hello World");
});
