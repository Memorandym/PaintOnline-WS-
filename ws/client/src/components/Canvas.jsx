import React, {useEffect, useRef, useState} from 'react';
import "../style/canvas.scss"
import {observer} from "mobx-react-lite";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import {useParams} from "react-router-dom";
import Rect from "../tools/Rect";
import axios from "axios";
import Circle from "../tools/Circle";
import Eraser from "../tools/Eraser";
import Line from "../tools/Line";
import FillCanvas from "../tools/FillCanvas";


const Canvas = observer(({username})=> {
    const canvasRef = useRef(username)
    const params = useParams()

    useEffect(() =>{
        canvasState.setUsername(username)
    }, [canvasRef])

    useEffect(()=>{
            canvasState.setUsername(username)
        }
        ,[username])

    const gettes = () => {
        canvasState.setCanvas(canvasRef.current)
        let ctx = canvasRef.current.getContext('2d')
        axios.get(`http://176.51.220.80:5000/image?id=${params.id}`)
            .then(response => {
                const img = new Image()
                img.src = response.data
                img.onload = () => {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                    ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
                }
            }).catch(err => {
            console.log(err)})
    }

    useEffect(() =>{
        gettes()
    }, [])

    useEffect(() => {
        if (canvasState.username) {
            const socket = new WebSocket(`ws://176.51.220.80:5000/`);
            canvasState.setSocket(socket)
            canvasState.setSessionId(params.id)
            toolState.setTool(new Brush(canvasRef.current, socket, params.id))
            socket.onopen = () => {
                console.log('Подключение установлено')
                socket.send(JSON.stringify({
                    id: params.id,
                    username: canvasState.username,
                    method: "connection"
                }))
            }
            socket.onmessage = (event) => {
                let msg = JSON.parse(event.data)
                switch (msg.method) {
                    case "connection":
                        console.log(`пользователь ${msg.username} присоединился`)
                        break
                    case "draw":
                        drawHandler(msg)
                        break
                    case "get":
                        gettes()
                        break
                }
            }
        }
    }, [canvasState.username])

    const drawHandler = (msg) => {
        const figure = msg.figure
        const ctx = canvasRef.current.getContext('2d')
        switch (figure.type) {
            case "brush":
                Brush.draw(ctx, figure.x, figure.y,figure.lineWidth,figure.strokeStyle)
                break
            case "rect":
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color, figure.lineWidth, figure.strokeStyle)
                break
            case "circle":
                Circle.staticDraw(ctx, figure.x, figure.y, figure.r, figure.color, figure.lineWidth, figure.strokeStyle)
                break
            case "erase":
                Eraser.draw(ctx, figure.x, figure.y,figure.lineWidth)
                break
            case "line":
                Line.staticDraw(ctx, figure.x, figure.y,figure.cx,figure.cy,figure.lineWidth,figure.strokeStyle)
                console.log(figure)
                break
            case "fillCanvas":
                FillCanvas.staticDraw(ctx, figure.x, figure.y,figure.r,figure.color)
                console.log(figure)
                break
            case "undo":
                canvasState.undo()
                break
            case "finish":
                ctx.beginPath()
                break
        }
    }

    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL())
        axios.post(`http://176.51.220.80:5000/image?id=${params.id}`,{img: canvasRef.current.toDataURL()})

    }

    const mouseUpHandler = () => {
        axios.post(`http://176.51.220.80:5000/image?id=${params.id}`,{img: canvasRef.current.toDataURL()})
    }


    return (
        <div className="canvas">
            <canvas onMouseDown={() => mouseDownHandler()}
                    onMouseUp={() => mouseUpHandler()}
                    ref={canvasRef}
                    width={831}
                    height={560}/>
        </div>
    );
});

export default Canvas;