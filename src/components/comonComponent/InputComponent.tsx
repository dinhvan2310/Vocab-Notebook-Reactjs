import React from 'react';
import styles from './InputComponent.module.css';
interface InputComponentProps {
    label?: string;
    type?: 'email' | 'password' | 'text';
    placeholder?: string;
    value?: string;
    propStyles?: React.CSSProperties;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputComponent(props: InputComponentProps) {
    const { label, type, placeholder, value, onChange, propStyles } = props;

    return (
        <div className={styles['container']} style={propStyles}>
            <label className={styles['label']}>{label}</label>
            <input
                className={styles['input']}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

export default InputComponent;
