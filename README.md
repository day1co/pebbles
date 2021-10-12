# Pebbles
Backend / Frontend 공통 Utility package

## 세부 설명
* HttpClient
* Logger

### HttpClient
Signature
```ts
const httpClient = new HttpClient();
httpClient.baseUrl = 'baseUrl';
httpClient.sendGetRequest<Type>(url: string, config?: IHttpReqConfig): Promise<IHttpRes<Type>>;
httpClient.sendPostRequest<Type>(url: string, data: unknown, config?: IHttpReqConfig): Promise<IHttpRes<Type>>;
httpClient.sendPutRequest<Type>(url: string, data: unknown, config?: IHttpReqConfig): Promise<IHttpRes<Type>>;
httpClient.sendDeleteRequest<Type>(url: string, config?: IHttpReqConfig): Promise<IHttpRes<Type>>;
```

Examples
```ts
import { HttpClient } from "@day1co/common-util/http-client";
import type { IHttpReqConfig, IHttpRes } from "@day1co/common-util/http-client";

const httpClient = new HttpClient();
const config: IHttpReqConfig = {}; // Optional
httpClient.baseUrl = 'baseUrl';
// The full url will be 'baseUrl' + 'url'
const getResult: IHttpRes<ResType> = await httpClient.sendGetRequest<ResType>('url', config);
const postResult: IHttpRes<ResType> = await httpClient.sendPostRequest<ResType>('url', data);
```

### Logger
Signature
```ts
LoggerFactory.getLogger(name: string);
logger.logLevel = 'deubg' | 'info' | 'warn' | 'error';
logger.debug(msgTemplate: string, ...args): void;
logger.info(msgTemplate: string, ...args): void;
logger.warn(msgTemplate: string, ...args): void;
logger.error(msgTemplate: string, ...args): void;
```

Examples

```ts
import { LoggerFactory } from "@day1co/common-util/logger";

const logger = LoggerFactory.getLogger('test');
logger.debug('test %s %d', 'message', 1);
logger.logLevel = 'error';
logger.debug('test %s %d', 'message', 2);
logger.error('test %s %d', 'message', 3);
```

This produces
```
{"level":20,"time":1631672920154,"pid":4731,"hostname":"your-server.local","name":"test","msg":"test message 1"}
{"level":50,"time":1631672920154,"pid":4731,"hostname":"your-server.local","name":"test","msg":"test message 3"}
```
