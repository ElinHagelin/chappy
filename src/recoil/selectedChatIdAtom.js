import { atom } from "recoil";

const selectedChatIdAtom = atom({
	key: 'selectedChatIdAtom',
	default: null,
});

export default selectedChatIdAtom