import React, { ReactNode } from 'react';
import styles from './ButtonComponent.module.css';
import SpaceComponent from './SpaceComponent';
import { colors } from '../utils/constanst';

interface ButtonComponentProps {
    text: string;
    icon?: ReactNode;
    type?: 'button' | 'submit' | 'reset' | 'mini';
    onClick: () => void;
    style?: React.CSSProperties;
}
function ButtonComponent(props: ButtonComponentProps) {
    const { text, onClick, icon, type, style } = props;

    return (
        <div
            onClick={onClick}
            className={`${styles['button']} ${type === 'submit' ? styles['primary'] : ''}
                ${type === 'mini' ? styles['mini'] : ''}
            `}
            style={style}>
            {icon && <SpaceComponent width={16} />}
            {icon}
            {text}
        </div>
    );
}

export default ButtonComponent;
