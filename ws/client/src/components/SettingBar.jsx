import React, {useState} from 'react';
import toolState from "../store/toolState";

const SettingBar = () => {
    const [range, setRange] = useState('1');
    const [color, setColor] = useState('#000000');

    return (
        <div className="settingbar">
            <div className="brushInfo">
                <div style={{width: parseInt(range), height: parseInt(range), borderRadius: 50, background: color}}/>
            </div>


            <input
                onChange={e => {toolState.setLineWidth(e.target.value);setRange(e.target.value); }}
                id="line-width"
                type="range" min={1} max={25} defaultValue={1}
                style={{margin: '0rem 1rem 0rem 2.8rem'}}
            />

            <label htmlFor="stroke-color">Цвет обводки</label>
            <input
                onChange={e => {toolState.setStrokeColor(e.target.value);setColor(e.target.value)}}
                style={{margin: '1%'}}
                id="stroke-color"
                type="color"
            />
        </div>
    );
};

export default SettingBar;