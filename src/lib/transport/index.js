class Transport {
	_ws = null;
	_handlers = new Map();

	constructor(ws_url) {
		this._ws = new WebSocket(ws_url);

		window.addEventListener('beforeunload', () => this._ws.close());

		this._ws.onmessage = (message) => {
			const data = JSON.parse(message.data);
			console.info('Received message: ' + message.data);

			const handler = this._handlers.get(data.id);

			if (handler) {
				handler(data);
			} else {
				console.error('Unrecognized message', data);
			}
		};
	}

	on(message, callback) {
		this._handlers.set(message, callback);
	}

	off(message) {
		this._handlers.delete(message);
	}

	send(message) {
		const jsonMessage = JSON.stringify(message);
		console.log('Sending message: ' + jsonMessage);
		this._ws.send(jsonMessage);
	}
}

export default new Transport(import.meta.env.VITE_WS_URI);
