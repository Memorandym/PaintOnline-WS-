import React, {useEffect, useRef, useState} from "react";
import "./style/app.scss";
import ToolBar from "./components/ToolBar";
import SettingBar from "./components/SettingBar";
import Canvas from "./components/Canvas";
import Chat from "./components/Chat";

import ModalWindow from "./components/ModalWindow";


function App() {
    const [name, setName] = useState('')

    const login = (name) => {
        setName(name)
    }

    return (
        <div className="app">
            <ModalWindow onClick={login}/>
            <ToolBar/>
            <SettingBar/>
            <Chat username={name}/>
            <Canvas username={name}/>
        </div>
    );
}

export default App;
