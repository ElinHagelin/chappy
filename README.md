# Project: Chappy API
This is a school project in which the aim is to build a fictional chat app that uses *REST API*-functions. It is written in *Node.js*, using *Express* as web framework and *lowdb* as database.

published site: https://chappy-chat-app.onrender.com

## API documentation
The data has 3 properties **Users**, **Channels** and **Messages**. All of these properties are arrays consisting of objects.

## Data modelling:


|  User     |        |                     |
|-----------|--------|---------------------|
| username  | String | The chosen name     |
| password  | String | The chosen password |
| id        | Number | The user ID         |

___________________________________________________

|  Channel  |         |                            |
|-----------|---------|----------------------------|
| name      | String  | The channel name           |
| locked    | Boolean | Public or locked channel   |
| id        | Number  | The channel ID             |
| creator   | Number  | The user ID of the creator |

___________________________________________________

|  Message  |         |                                      |
|-----------|---------|--------------------------------------|
| sender    | Number  | The user ID of the sender            |
| receiver  | Number  | The user ID of the receiver          |
| id        | Number  | The message ID                       |
| time      | String  | Timestamp when the message was sent  |
| message   | String  | The message                          |

__________________________________________

## Endpoints:

### Users

#### Fetch all users
```js
[GET] /users
```

#### Fetch specific user:
```js
[GET] /users/:id
```

#### Add user:
```js
[POST] /users 

REQUIRES BODY:

{
    username: 'user',       // String
    password: 'password',   // String
}
```

#### Delete user:
```js
[DELETE] /user/:id
```

#### Edit user:
```js
[PUT] /products/:id
//REQUIRES BODY (same as POST)
```
_________________________________________________________

### Channels

#### Fetch all channels
```js
[GET] /channels
```

#### Fetch specific channel:
```js
[GET] /channels/:id
```

#### Add channel:
```js
[POST] /channels

REQUIRES BODY:

{
    name: 'chat 7',      // String
    locked: true,        // Boolean
}
```

________________________________________________________
### Messages

#### Fetch all messages
```js
[GET] /messages
```

#### Fetch messages with specific user:
```js
[GET] /messages/:id
```

#### Add message:
```js
[POST] /messages

REQUIRES BODY:

{
    sender: 
	{
		username: 'user',                
		id: 'userID'                     // Object
	},                                   
    receiver: 3,                         // Number(user ID of receiver)
	message: 'This is a great message'   // String
}
```

#### Delete message:
```js
[DELETE] /messages/:id
```

#### Edit message:
```js
[PUT] /messages/:id
//REQUIRES BODY (same as POST)
```

________________________________________________

### Login

#### Login user
```js
[POST] /login 

response is a JWT-token and userId

REQUIRES BODY
{
    username: 'user',      // String
    password: 'password'   // String
}
```


________________________________________________


## Code examples

### Fetch all messages
```js
const getMessages = async () => {
	try {
		const response = await fetch('http://.../api/messages')
		const data = await response.json()
		return data

	} catch (error) {
		console.log('Get messages failed: ', error.message);
	}
}
```

### Fetch message for user with id 1
```js
const getMessagesWithId = async (1) => {
	try {
		const response = await fetch(`/api/messages/${1}`)
		let data = await response.json()
		return data

	} catch (error) {
		console.log('Get messages with userId failed: '.error.message);
	}
}
```

### Post new message
```js
const postMessage = async (receiverId, message, user) => {
	try {
		const baseUrl = "http://.../api/messages"
		let userBody = user ? user : { username: 'Anonym', id: 0 }

		const newMessage = {
			sender: userBody,
			receiver: receiverId,
			message: message
		}

		const options = {
			method: 'POST',
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newMessage)
		}

		const response = await fetch(baseUrl, options)

	} catch (error) {
		console.log('Post failed: ', error.message);
	}
}
```

### Edit Message
```js
const editMessage = async (messageId, newMessage) => {
	try {
		const url = `http://.../api/messages/${messageId}`

		let allMessages = await getMessages()
		const targetMessage = allMessages.find(message => message.id === messageId)

		targetMessage.message = newMessage
		const body = targetMessage

		const options = {
			method: 'PUT',
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body)
		}

		let response = await fetch(url, options)

	} catch (error) {
		console.log('Edit failed: ', error.message);
	}
}
```

### Delete message
```js
const deleteMessage = async (messageId) => {
	try {
		const deleteUrl = `http://.../api/messages/${messageId}`

		const options = {
			method: "DELETE",
		}
		const response = await fetch(deleteUrl, options)

	} catch (error) {
		console.log("Delete failed: ", response)
	}
}
```

### Login
```js
const login = async (username, password) => {
	try {
		let body = { username: username, password: password }
		let options = {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(body)
		}

		const response = await fetch('http://.../api/login', options)
		const data = await response.json()
		return data

	} catch (error) {
		console.log('Login failed: ', error.message);
		return false
	}
}
```

