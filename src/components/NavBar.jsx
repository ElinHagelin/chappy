import { useState, useEffect } from "react";
import { getChannels } from "../utils/ajax/ajaxChannels"



const NavBar = () => {
	const [channels, setChannels] = useState(null)
	const [errorMessage, setErrorMessage] = useState("");

	async function getAllChannels() {
		console.log("Inuti getAllChannels");
		setErrorMessage("");
		try {
			let data = await getChannels()
			console.log('Hämtat kanaler');
			setChannels(data)
		} catch (error) {
			setErrorMessage(error.message)
		}
	}

	useEffect(() => {
		getAllChannels()
	}, [])

	return (

		<nav>
			<ul>
				<li> [Kanaler] </li>
				{channels ? (
					channels.map(channel => (
						<li key={channel.id}>{channel.name}</li>
					))

				) : <p>Channels loading....</p>}
				{/* 
			// <li><a href="#"> #koda </a></li>
			// <li><a href="#"> #random </a> <span class="unread">3</span> </li>
			// <li class="locked"><a href="#"> #grupp1 🔒 </a></li>
			// <li class="selected"><a href="#"> #grupp2 🔑 </a></li>
			// <li class="locked"><a href="#"> #grupp3 🔒 </a></li>
				<li> <hr /> </li>
			// <li title="Direktmeddelanden"> [DM] </li>
			// <li><a href="#">PratgladPelle</a></li>
			// <li><a href="#">SocialaSara</a></li>
			// <li><a href="#">TrevligaTommy</a></li>
			// <li><a href="#">VänligaVera</a></li>
			// <li><a href="#">GladaGustav</a></li> */}
			</ul>
		</nav>
	)
}

export default NavBar