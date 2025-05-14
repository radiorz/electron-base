import { createServer } from "@electron/fastify-protocol";
import fastify from "fastify";
console.log(`server is imported`);
const server = fastify();
server.get("/", () => "helloworld");
server.get("/hello", () => "helloworld");
createServer({ server }).bootstrap("app");
