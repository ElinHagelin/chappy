import { getMessagesWithId } from "./ajax/ajaxMessages";
import { getUserName } from "../components/Header";

async function getDMs(userId, setChats) {
	try {
		let data = await getMessagesWithId(userId)
		let filteredData = data.filter(m => m.receiver < 1000)
		console.log(`messages are: `, filteredData);
		// setDMs(filteredData)

		let DMList = []

		await Promise.all(
			filteredData.map(async (message) => {
				// console.log('Inne i forEach, DMList är: ', DMList);
				if (message.sender == userId) {
					// console.log('Användaren är avsändare');
					const name = await getUserName(message.receiver)
					if (DMList.indexOf(name) === -1) {
						// console.log(`${name} finns inte med i listan`);
						DMList = [...DMList, name]
						// console.log(`Lagt till ${name}, DMList är: `, DMList);
					}

				} else if (message.receiver == userId) {
					// console.log('Användaren är mottagare');
					const name = await getUserName(message.sender)
					if (DMList.indexOf(name) === -1) {
						// console.log(`${name} finns inte med i listan`);
						DMList = [...DMList, name]
						// console.log(`Lagt till ${name}, DMList är: `, DMList);
					}
				}
			})
		)
		// console.log('Utanför forEach, DMList är: ', DMList);
		setChats(DMList)

	} catch (error) {
		console.log('getDMs error: ', error.message);
	}
}

export default getDMs