import React from 'react';
import cl from './input.module.css'

const MyInput = (props) => {
    return (
        <input className={cl.MyInput} {...props}/>
    );
};

export default MyInput;