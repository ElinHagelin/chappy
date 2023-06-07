import { atom } from "recoil";

const loggedInAtom = atom({
	key: 'loggedIn',
	default: false,
});

export default loggedInAtom