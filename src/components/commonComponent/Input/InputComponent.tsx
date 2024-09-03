import TextareaAutosize from 'react-textarea-autosize';
import TextComponent from '../Text/TextComponent';
import './InputComponent.scss';
import TitleComponent from '../Title/TitleComponent';

interface InputComponentProps {
    type: 'text' | 'textarea' | 'password' | 'email';
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    style?: React.CSSProperties;
    inputStyle?: React.CSSProperties;

    borderType?: 'none' | 'bottom' | 'all';
    label?: string;
    width?: string;
    fontSize?: string;
    // effect only borderType = 'bottom'
    animationType?: 'none' | 'slideInLeft' | 'slideCenter';
    tabindex?: number;
    errorText?: string;
}

function InputComponent(props: InputComponentProps) {
    const {
        type,
        placeholder,
        value,
        onChange,
        className,
        inputStyle,
        style,
        borderType = 'none',
        label,
        width = '100%',
        fontSize = '1.6em',
        animationType = 'none',
        tabindex,
        errorText
    } = props;

    return (
        <div
            className={`input-container ${className ?? ''}`}
            style={{
                width,
                ...style
            }}>
            <div
                className={`input-component ${animationType}`}
                style={{
                    width
                }}>
                {type === 'textarea' ? (
                    <TextareaAutosize
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={`text-area ${borderType}`}
                        placeholder={placeholder}
                        style={{
                            width: width,
                            fontSize: fontSize,
                            resize: 'none',
                            ...inputStyle
                        }}
                    />
                ) : (
                    <input
                        tabIndex={tabindex}
                        type={type}
                        className={`input ${borderType}`}
                        style={{
                            width,
                            fontSize: fontSize,
                            ...inputStyle
                        }}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                )}
                <span
                    style={{
                        width
                    }}
                    className="bar"></span>
            </div>
            {errorText ? (
                <TitleComponent
                    title={errorText?.toUpperCase() ?? ''}
                    fontSize="1.1em"
                    className="label mt-1"
                    color="var(--red-color)"
                />
            ) : (
                <TitleComponent
                    title={label?.toUpperCase() ?? ''}
                    fontSize="1.1em"
                    className="label mt-1"
                />
            )}
        </div>
    );
}

export default InputComponent;
