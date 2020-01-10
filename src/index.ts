import startServer from './server';

export interface IEndConfig {
  intentFilters?: IIntentFilter[];
  name: string;
}
export interface IEnd extends IEndConfig {
  ws: WebSocket;
}

export interface IIntent {
  action: string;
  data: any;
}

export interface IIntentFilter {
  action: string;
}

export default startServer;
