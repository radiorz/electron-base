import { app, protocol } from "electron";
import Fastify, { type FastifyInstance } from "fastify";
// 扩展类型添加bootstrap方法
// 服务器启动选项接口
export interface BootstrapOptions {
  server?: FastifyInstance;
}
declare module "fastify" {
  interface FastifyInstance {
    bootstrap(name: string): Promise<void>;
  }
}

// 创建服务器函数
export function createServer(options: BootstrapOptions) {
  // 获取传入的express实例，如果没有则创建一个新的
  const server =
    options.server ||
    Fastify({
      logger: true,
    });

  // 为express实例添加bootstrap方法
  server.bootstrap = async (scheme: string = "app") => {
    await app.whenReady(); // 注册私有协议，这里以传入的name作为协议名
    console.log(`bootstrap protocol ${scheme}`);
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
        method: request.method,
        url: url,
        body: request.body,
      };
      console.log(options);

      const response = await server.inject(options);

      // 返回响应
      return new Response(response.body, {
        status: response.statusCode,
      });
    });
  };

  // 返回 fastify 实例
  return app;
}
