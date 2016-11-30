import * as request from 'request';

export type reqOptions = request.Options;

export interface IHttpReqOptions {
  method?: string;
  parameters?: any;
  json?: boolean;
  files?: any;
  body?: string | Buffer | Object;
  headers?: any;
  cookies?: any;
  auth?: string;
  binary?: boolean;
  allowRedirects?: boolean;
  maxRedirects?: number;
  encodePostParameters?: boolean;
  timeout?: number;
  url?: string;
  proxy?: any;
  rejectUnauthorized?: boolean;
  agent?: any;
  ca?: any;
}

export interface INtlmOptions {
  username?: string;
  password?: string;
  domain?: string;
  hostname?: string;
}
