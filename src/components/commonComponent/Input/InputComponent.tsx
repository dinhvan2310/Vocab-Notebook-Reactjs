import TextareaAutosize from 'react-textarea-autosize';
import TextComponent from '../Text/TextComponent';
import './InputComponent.scss';

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
        animationType = 'none'
    } = props;

    // const textareaRef = useRef<HTMLTextAreaElement>(null);

    // useEffect(() => {
    //     const event = textareaRef.current?.addEventListener('input', (e) => {
    //         const target = e.target as HTMLTextAreaElement;
    //         target.style.height = 'auto';
    //         if (target.scrollHeight > 92) {
    //             target.style.height = target.scrollHeight + 'px';
    //         } else {
    //             target.style.height = '43px';
    //         }
    //     });
    // }, [textareaRef]);

    return (
        <div
            className={`input-container ${className ?? ''}`}
            style={{
                width
            }}>
            <div
                className={`input-component ${animationType}`}
                style={{
                    width,
                    ...style
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
                            resize: 'none'
                        }}
                    />
                ) : (
                    // <textarea
                    //     ref={textareaRef}
                    //     value={value}
                    //     onChange={(e) => onChange(e.target.value)}
                    //     className={`text-area ${borderType}`}
                    //     placeholder={placeholder}
                    //     style={{
                    //         width: width,
                    //         height: '43px',
                    //         fontSize: fontSize,

                    //         ...inputStyle
                    //     }}
                    // />
                    <input
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
            <TextComponent text={label?.toUpperCase() ?? ''} fontSize="1.2em" className="label" />
        </div>
    );
}

export default InputComponent;
