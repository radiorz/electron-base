# @electron-plugins/express-protocol

在后端处理中，不少开发者会起一个服务器，然后用获取随机端口的方式启动一个服务器。
这样会暴露一个端口，增加安全风险。并且,前端需要通过 preload 接口的方式获取这个端口，增加代码量。
而这个库主要就是将服务器注册为私有协议，这样就不需要 listen 到某个端口，直接可以让前端使用 fetch 等手段获取 main 进程的接口数据

## 使用

```javascript
import { createServer } from "@electron/express-protocol";
import express from "express";
const server = express();
server.get("/", () => "helloworld");
server.get("/hello", () => "helloworld");
createServer({ server }).bootstrap("app");
```
