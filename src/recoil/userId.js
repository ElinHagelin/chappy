import { atom } from "recoil";

const userId = atom({
	key: 'userId',
	default: null,
});

export default userId