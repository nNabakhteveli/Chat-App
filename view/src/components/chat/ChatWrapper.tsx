import { useState, useEffect } from "react";
import { MessageInterface } from "../interfaces";
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { DisplayMessages } from "./DisplayMessages";
import Url from 'url-parse';



const client = new W3CWebSocket('ws://127.0.0.1:8000')

export default function ChatWrapper() {
	const [messages, setMessages] = useState<MessageInterface[]>([]);
	const [username, setUsername] = useState('');
	const [inputValue, setInputValue] = useState('');

	useEffect(() => {
		client.onopen = () => {
			console.log("Connected to WebSocket successfuly")
		}

		client.onmessage = (msg: any) => {
			const dataFromServer = JSON.parse(msg.data);

			const obj: MessageInterface = {
				type: dataFromServer.type,
				userWhoSent: dataFromServer.userWhoSent,
				msg: dataFromServer.msg
			};

			if (dataFromServer.recentMessages.length === 0) {
				const arr: Array<MessageInterface> = messages.concat(obj);
				setMessages(arr);
			} else {
				const arr: Array<MessageInterface> = messages.concat(...dataFromServer.recentMessages, obj);
				setMessages(arr)
			}
		}

		interface QueryInterface {
			firstName?: String,
			lastName?: String,
			username?: String
		}
		const queryFromUrl: QueryInterface = new Url(window.location.href, true).query;

		if ('username' in queryFromUrl) {
			setUsername(String(queryFromUrl.username));
		} else {
			setUsername(queryFromUrl.firstName + ' ' + queryFromUrl.lastName);
		}
	}, []);

	const sendMessage = (value: string): void => {
		if (value.length === 0) {
			return;
		}

		client.send(JSON.stringify({
			recentMessages: messages,
			type: "message",
			userWhoSent: username,
			msg: value
		}));
	}

	const getValueFromInputField = (event: any) => {
		setInputValue(event.target.value);
	}

	return (
		<div className="App">
			<DisplayMessages messagesData={messages} />
			<input type='text' className="messageInput" onChange={(event) => getValueFromInputField(event)} />
			<br />
			<button onClick={() => sendMessage(inputValue)}>Send message</button>
		</div>
	);
}