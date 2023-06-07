import { atom } from "recoil";

const userIdAtom = atom({
	key: 'userIdAtom',
	default: null,
});

export default userIdAtom