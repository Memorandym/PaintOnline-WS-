import React, {useEffect, useRef, useState} from 'react';
import '../style/chat.scss'
import MyInput from "./UI/input/MyInput";
import MyButton from "./UI/button/MyButton";
import {useParams} from "react-router-dom";

const Chat = ({username}) => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const socket = useRef()
    const [connected, setConnected] = useState(false);
    const [usernameChat, setUsernameChat] = useState(username);
    const params = useParams()

    useEffect(() => {
            setUsernameChat(username)
        }
        , [username])

    useEffect(() => {
            if (usernameChat) {
                connect()
            }
        }
        , [usernameChat])


    function connect() {
        socket.current = new WebSocket(`ws://176.51.220.80:5000/chat`)

        socket.current.onopen = () => {
            setConnected(true)
            const message = {
                method: 'connectionChat',
                username: usernameChat,
                id: params.id + "chat",
                key: Date.now()
            }
            socket.current.send(JSON.stringify(message))

        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(prev => [message, ...prev])
        }
        socket.current.onclose= () => {
            console.log('Socket закрыт')
        }
        socket.current.onerror = () => {
            console.log('Socket произошла ошибка')
        }
    }

    const onFormSubmit = e => {
        e.preventDefault();
        sendMessage().then()
    }

    const sendMessage = async () => {
        if (value.trim().length !== 0){
            const message = {
                username: usernameChat,
                message: value,
                id: params.id + "chat",
                key: Date.now(),
                method: 'messageChat'
            }
            socket.current.send(JSON.stringify(message));
            setValue('')
        }
    }

    const scroll = () => {
        let block = document.getElementById("scrollId");
        block.scrollTop = block.scrollHeight;
    }

    return (
        <div className="chatWindow">
            <div className="chatView" id="scrollId">
                {messages.map(mess =>
                    <div key={mess.key}>
                        {mess.method === 'connectionChat'
                            ? <div className="chatEnter">
                                Пользователь {mess.username} подключился
                            </div>
                            : <div className="chatBody">
                                <div className="chatPersona">
                                    {mess.username}
                                </div>
                                <div className="chatMessage">
                                    {mess.message}
                                </div>
                                {scroll()}
                            </div>
                        }
                    </div>
                )}
            </div>
            <form onSubmit={onFormSubmit}>
                <div className="chatSend">
                    <MyInput value={value}
                             onChange={e => setValue(e.target.value)}
                             placeholder=" Ваше сообщение..."
                             type="text"/>
                    <MyButton
                        type="submit"
                        onClick={sendMessage}>Отправить
                    </MyButton>
                </div>
            </form>
        </div>

    )
};

export default Chat;