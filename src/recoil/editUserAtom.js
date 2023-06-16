import { atom } from "recoil";

const editUserAtom = atom({
	key: 'editUser',
	default: null,
});

export default editUserAtom