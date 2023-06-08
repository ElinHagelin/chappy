import { atom } from "recoil";

const chatAtom = atom({
	key: 'chatAtom',
	default: [],
});

export default chatAtom