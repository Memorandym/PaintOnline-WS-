import React, {useRef, useState} from 'react';
import '../style/toolbar.scss'
import Brush from "../tools/Brush";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Rect from "../tools/Rect";
import Circle from "../tools/Circle";
import Eraser from "../tools/Eraser";
import Line from "../tools/Line";
import FillCanvas from "../tools/FillCanvas";
import {Button} from "react-bootstrap";
import {useParams} from "react-router-dom";
import * as Icon from "react-bootstrap-icons"


const ToolBar = () => {
    const params = useParams()
    const [hrefURL,setHrefURL] = useState(params.id)

    const buffURL = () => {
        navigator.clipboard.writeText(hrefURL)
            .then(() => {
            })
    }

    const changeColor = e => {
        toolState.setFillColor(e.target.value)
    }

    const download = () => {
        const dataUrl = canvasState.canvas.toDataURL()
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = canvasState.sessionid + ".jpg"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    return (
        <div className="toolbar">
            <button className="toolbar__btn brush" onClick={() => toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionid))} />
            <button className="toolbar__btn rect"  onClick={() => toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionid))}/>
            <button className="toolbar__btn circ"  onClick={() => toolState.setTool(new Circle(canvasState.canvas, canvasState.socket, canvasState.sessionid))}/>
            <button className="toolbar__btn erase" onClick={() => toolState.setTool(new Eraser(canvasState.canvas, canvasState.socket, canvasState.sessionid))}/>
            <button className="toolbar__btn line"  onClick={() => toolState.setTool(new Line(canvasState.canvas, canvasState.socket, canvasState.sessionid))}/>
            <button className="toolbar__btn fill"  onClick={() => toolState.setTool(new FillCanvas(canvasState.canvas, canvasState.socket, canvasState.sessionid))}/>
            <div className="mx-2">Цвет заливки</div>  <input onChange={e => changeColor(e)} style={{marginLeft: 10}} type="color"/>
            <div className="stateURL">
                <Button variant="primary" size="sm" className="btnCopy" onClick={()=>buffURL()}><Icon.Clipboard size="16px"/></Button>
                <input value={hrefURL} onChange={(e)=>setHrefURL(e.target.value)} style={{marginRight: 10}} type="text"/>
                <Button variant="primary" size="sm" ><a style={{textDecoration: "none",color:"white"}} href={"/"+hrefURL}>Перейти в комнату</a></Button >
            </div>
            {/*<button className="toolbar__btn undo" onClick={() => canvasState.undo()}/>*/}
            {/*<button className="toolbar__btn redo" onClick={() => canvasState.redo()}/>*/}
            <button className="toolbar__btn save" onClick={() => download()}/>
        </div>
    );
};

export default ToolBar;