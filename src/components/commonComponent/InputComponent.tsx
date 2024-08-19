import { Eye, EyeSlash } from 'iconsax-react';
import React from 'react';
import './InputComponent.scss';
import RowComponent from './RowComponent';
import SpaceComponent from './SpaceComponent';
import TextComponent from './TextComponent';
interface InputComponentProps {
    label?: string;
    type?: 'email' | 'password' | 'text' | 'switch' | 'textarea';
    placeholder?: string;
    fontSize?: number | string;
    isShowPassword?: boolean;
    paddingHorizontal?: number;
    paddingVertical?: number;
    value?: string;
    style?: React.CSSProperties;
    className?: string;
    onChange?: (value: string) => void;
    onSwitchChange?: (checked: boolean) => void;
}

function InputComponent(props: InputComponentProps) {
    const {
        label,
        type,
        isShowPassword = true,
        placeholder,
        fontSize = '1.4em',
        value,
        onChange,
        className,
        style,
        onSwitchChange,
        paddingHorizontal = 12,
        paddingVertical = 12
    } = props;

    const [showPass, setShowPass] = React.useState(false);

    return (
        <div
            className={`input-container ${className}`}
            style={{
                ...style
            }}>
            {type === 'switch' ? (
                <>
                    <RowComponent justifyContent="space-between">
                        <RowComponent>
                            <TextComponent text={label ?? ''} />
                            <SpaceComponent width={4} />
                            <TextComponent text={`:  ${value}`} textColor="var(--text-color)" />
                        </RowComponent>
                        <label className="switch">
                            <input
                                type="checkbox"
                                onChange={(e) => {
                                    if (onSwitchChange) {
                                        onSwitchChange(e.target.checked);
                                    }
                                }}
                            />
                            <span className="slider"></span>
                        </label>
                    </RowComponent>
                    <SpaceComponent height={4} />
                </>
            ) : (
                <>
                    <TextComponent style={{}} text={label ?? ''} />
                    <SpaceComponent height={4} />
                    <RowComponent
                        style={{
                            position: 'relative'
                        }}>
                        <input
                            className="input"
                            style={{
                                padding: `${paddingVertical}px ${paddingHorizontal}px`,
                                fontSize
                            }}
                            type={showPass ? 'text' : type}
                            placeholder={placeholder}
                            value={value}
                            onChange={(e) => {
                                if (onChange) {
                                    onChange(e.target.value);
                                }
                            }}
                        />
                        {type === 'password' && isShowPassword && showPass && (
                            <EyeSlash
                                style={{
                                    color: 'var(--secondary-text-color)',
                                    cursor: 'pointer',
                                    position: 'absolute',
                                    right: 10,
                                    top: '50%',
                                    transform: 'translateY(-50%)'
                                }}
                                size={20}
                                className="icon"
                                onClick={() => setShowPass(!showPass)}
                            />
                        )}
                        {type === 'password' && isShowPassword && showPass == false && (
                            <Eye
                                style={{
                                    color: 'var(--secondary-text-color)',
                                    cursor: 'pointer',
                                    position: 'absolute',
                                    right: 10,
                                    top: '50%',
                                    transform: 'translateY(-50%)'
                                }}
                                size={20}
                                className="icon"
                                onClick={() => setShowPass(!showPass)}
                            />
                        )}
                    </RowComponent>
                </>
            )}
        </div>
    );
}

export default InputComponent;
