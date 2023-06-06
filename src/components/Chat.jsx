

const Chat = () => {

	return (
		<div className="chat-area">
			<section className="heading">
				Chattar i <span className="chat-name"> #grupp2 </span>
			</section>
			<section className="history">


				{/* Kolla vilka meddelanden som användaren är avsändare till och sätt className="align-right" på dom.
				className={sender === id ? "align-right" : null} */}
				<section className="align-right">
					<p> VänligaVera: hejsan </p>
					<p> 17:46 </p>
				</section>

				<section>
					<p> MunterMoa: tjena! </p>
					<p> 17:47 </p>
				</section>

			</section>
			<section>
				<input type="text" placeholder="Ditt meddelande..." />
				<button> Skicka </button>
			</section>
		</div>
	)
}

export default Chat