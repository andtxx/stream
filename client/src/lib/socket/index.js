import { io } from 'socket.io-client';

const REQUEST_TIMEOUT = 5000;
const REQUEST_MAX_ATTEMPTS = 3;

const socket = io('http://192.168.1.139:3000', { transports: ['websocket'] });

socket.on('connect', () => {
  console.info('socket (id: ' + socket.id + ') connected');
});

const request = (event, data) => {
  let error = null;
  let result = null;

  return new Promise((resolve) => {
    const _request = (attempt = 1) => {
      socket.timeout(REQUEST_TIMEOUT).emit(event, data, (err, res) => {
        if (err) {
          if (++attempt <= REQUEST_MAX_ATTEMPTS) {
            return _request(attempt);
          } else {
            error = new Error('request_timeout');
          }
        } else {
          if (res.code) {
            error = res;
          } else {
            result = res;
          }
        }

        resolve({ error, result });
      });
    };

    _request();
  });
};

export { request };

export default socket;
