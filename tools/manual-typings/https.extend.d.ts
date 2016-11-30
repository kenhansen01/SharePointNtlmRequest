/// <reference path="../../node_modules/@types/node/index.d.ts" />

declare module "https" {
  export interface Agent {
    options: AgentOptions;
  }
}
