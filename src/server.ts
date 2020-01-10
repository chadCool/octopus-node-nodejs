import WebSocket from 'ws';
import { IEnd, IIntent, IIntentFilter } from './index';
import { removeFromArray } from './utils';

export default function startServer(port: number = 1248) {
  // 引用Server类:
  const WebSocketServer = WebSocket.Server;

  // 实例化:
  const wss = new WebSocketServer({
    port,
  });

  const ends: IEnd[] = [];

  wss.on('listening', () => {
    console.log('[SERVER] listening on ' + port);
    // require('./ends/dataLogger');
  });

  wss.on('connection', ws => {
    console.log(`[SERVER] connection()`);
    ws.on('close', close);
    ws.on('message', message);
    let current: IEnd;

    function message(msg: string) {
      console.log('[SERVER] Received', msg);
      const intent: IIntent = JSON.parse(msg);
      const { action } = intent;
      if (action) {
        if (action === 'register') {
          current = {
            ws,
            intentFilters: intent.data.intentFilters,
            name: intent.data.name,
          };
          ends.push(current);
          return;
        }
        console.log('ends', getEndsLog());
        ends
          .filter(e => {
            return (
              e.intentFilters && e.intentFilters.length > 0 && e.intentFilters.find(filter => filter.action === action)
            );
          })
          .map(e => {
            e.ws.send(msg);
          });
      }
    }

    function close() {
      console.log('[SERVER] Close', current && current.name);
      removeFromArray(ends, current);
      console.log('[SERVER] Close', 'after close', getEndsLog());
    }
  });

  function getEndsLog() {
    return JSON.stringify(ends.map(({ ws, ...others }) => others));
  }
}
