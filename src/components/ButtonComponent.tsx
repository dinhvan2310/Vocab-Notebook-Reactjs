import React, { ReactNode } from 'react';
import styles from './ButtonComponent.module.css';
import SpaceComponent from './SpaceComponent';
import { colors } from '../utils/constanst';

interface ButtonComponentProps {
    text: string;
    icon?: ReactNode;
    type?: 'button' | 'submit' | 'reset';
    onClick: () => void;
}
function ButtonComponent(props: ButtonComponentProps) {
    const { text, onClick, icon, type } = props;

    return (
        <div
            onTouchMove={() => {}}
            onClick={onClick}
            className={`${styles['button']} ${type === 'submit' ? styles['primary'] : ''}`}>
            {icon}
            <SpaceComponent width={16} />
            {text}
        </div>
    );
}

export default ButtonComponent;
