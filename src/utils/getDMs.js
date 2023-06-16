import { getMessagesWithId } from "./ajax/ajaxMessages.js";
import { getUserName } from "../components/Header.jsx";


async function getDMs(userId, setChats) {
	try {
		let data = await getMessagesWithId(userId);
		let filteredData = data.filter((m) => m.receiver < 1000);

		let DMList = [];

		await Promise.all(
			filteredData.map(async (message) => {
				let id, name;
				if (message.sender.id == userId) {
					id = message.receiver;
					name = await getUserName(message.receiver);
				} else if (message.receiver == userId) {
					id = message.sender.id;
					name = await getUserName(message.sender.id);
				}

				if (id && name) {
					const existingDM = DMList.find((DM) => DM.id === id);
					if (!existingDM) {
						DMList.push({ id, name });
					}
				}
			})
		);

		setChats(DMList);
	} catch (error) {
		console.log('getDMs error: ', error.message);
	}
}

export default getDMs