import React from 'react';
import cl from './button.module.css'

const MyButton = ({children , ...props}) => {
    return (
        <div>
            <button {...props} className={cl.MyButton} >
                {children}
            </button>
        </div>
    );
};

export default MyButton;