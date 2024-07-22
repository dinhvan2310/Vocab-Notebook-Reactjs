import React, { ReactNode } from 'react';
import styles from './ButtonComponent.module.css';
import SpaceComponent from './SpaceComponent';

interface ButtonComponentProps {
    text: string;
    icon?: ReactNode;
    type?: 'submit' | 'mini';
    onClick: () => void;
    style?: React.CSSProperties;
}
function ButtonComponent(props: ButtonComponentProps) {
    const { text, onClick, icon, type, style } = props;

    return (
        <div
            onClick={onClick}
            className={`${styles['button']} 
                ${type === 'submit' ? styles['primary'] : ''}
                ${type === 'mini' ? styles['mini'] : ''}
            `}
            style={style}>
            {icon && icon}
            {icon && <SpaceComponent width={8} />}
            {text}
        </div>
    );
}

export default ButtonComponent;
