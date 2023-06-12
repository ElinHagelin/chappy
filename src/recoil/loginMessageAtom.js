import { atom } from "recoil";

const loginMessageAtom = atom({
	key: 'loginMessage',
	default: '',
});

export default loginMessageAtom