import React from 'react';
import './InputComponent.scss';
import SpaceComponent from './SpaceComponent';
import TextComponent from './TextComponent';
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
        <div className="input-container" style={propStyles}>
            <TextComponent text={label ?? ''} />
            <SpaceComponent height={4} />
            <input
                className="input"
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

export default InputComponent;
