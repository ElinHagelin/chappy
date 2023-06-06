import { atom } from "recoil";

const loggedInAtom = atom({
	key: 'loggedIn',
	default: null,
});

export default loggedInAtom