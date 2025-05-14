import { protocol } from "electron";
import express, { type Express, type Request, type Response } from "express";
import supertestRequest from "supertest"; // 重命名导入的 supertest

// 扩展express的Express类型，添加bootstrap方法
declare module "express" {
  interface Express {
    bootstrap: (name: string) => void;
  }
}

// 服务器启动选项接口
export interface BootstrapOptions {
  app?: Express;
}

// 创建服务器函数
export async function createServer(options: BootstrapOptions) {
  // 获取传入的express实例，如果没有则创建一个新的
  const app = options.app || express();

  // 为express实例添加bootstrap方法
  (app as any).bootstrap = (scheme: string = "app") => {
    // 注册私有协议，这里以传入的name作为协议名
    protocol.registerSchemesAsPrivileged([
      {
        scheme: scheme,
        privileges: {
          bypassCSP: true, // 绕过内容安全策略
          standard: true, // 标准协议
          secure: true, // 安全协议
          supportFetchAPI: true, // 支持fetch API
        },
      },
    ]);

    // 处理私有协议的请求
    protocol.handle(scheme, async (request: Request) => {
      // 将请求的URL从私有协议格式转换为普通路径格式
      let url = request.url.replace(`${scheme}://`, "/");
      if (url.endsWith("/")) {
        url = url.slice(0, -1);
      }

      // 构造请求选项
      const options: any = {
        method: request.method.toLowerCase(),
        url: url,
        body: request.body,
      };
      console.log(options);
      const res = {
        send: (body: any) => {
          console.log(`body`, body);
        },
        statusCode: 200,
        setHeader: () => {},
      };
      //@ts-ignore
      const response = await app.handle(req, res);
      // 使用express实例处理请求，这里假设express实例有一个inject方法用于处理请求
      // 注：实际的express实例并没有inject方法，这里是为了示例方便，你可以根据实际情况替换为其他处理请求的方法
      // const response = await
      console.log(`response`, response);
      // // 返回响应
      return new Response(response.body, {
        status: response.statusCode,
      });
    });
  };

  // 返回express实例
  return app;
}
