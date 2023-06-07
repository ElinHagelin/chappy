import { atom } from "recoil";

const usernameAtom = atom({
	key: 'usernameAtom',
	default: null,
});

export default usernameAtom