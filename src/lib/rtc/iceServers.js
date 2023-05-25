import freeice from 'freeice';

const TURN = {
	url: import.meta.env.VITE_TURN_URI,
	urls: [import.meta.env.VITE_TURN_URI],
	username: import.meta.env.VITE_TURN_USER,
	credential: import.meta.env.VITE_TURN_PASSWORD,
};

export default [...freeice(), TURN];
