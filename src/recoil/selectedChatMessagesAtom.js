import { atom } from "recoil";

const selectedChatMessagesAtom = atom({
	key: 'selectedChatMessagesAtom',
	default: [],
});

export default selectedChatMessagesAtom