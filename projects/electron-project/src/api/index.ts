import { createServer } from "@tikkhun/fastify-protocal";

export async function bootstrap() {
  console.log(`bootstrap`);
  const app = await createServer({});
  app.get("/hello", () => "hello world");
  // @ts-ignore
  app.bootstrap("app");
  console.log(`app bootstraped`);
}
