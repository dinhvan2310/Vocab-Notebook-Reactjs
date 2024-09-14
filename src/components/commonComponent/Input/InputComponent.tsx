import TextareaAutosize from 'react-textarea-autosize';
import './InputComponent.scss';
import TitleComponent from '../Title/TitleComponent';
import MenuItemsComponent from '../../MenuItems/MenuItemsComponent';
import { useEffect, useState } from 'react';
import ButtonComponent from '../Button/ButtonComponent';
import { Eye, EyeSlash } from 'iconsax-react';

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

    readonly?: boolean;

    // suggest
    suggest?: boolean;
    suggestData?: (text: string) => Promise<string[] | undefined>;
    onFocused?: () => void;
    onBlurred?: () => void;
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
        errorText,
        readonly = false,
        suggest = false,
        onFocused,
        onBlurred,
        suggestData
    } = props;

    const [suggestDataState, setSuggestDataState] = useState<string[]>();
    const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);
    useEffect(() => {
        if (suggest && suggestData) {
            suggestData(value).then((data) => {
                setSuggestDataState(data ?? []);
            });
        }
    }, [value, suggestData, suggest, isSuggestionsVisible]);

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
                        onFocus={() => {
                            onFocused && onFocused();
                            if (suggest) {
                                setIsSuggestionsVisible(true);
                            }
                        }}
                        onBlur={() => {
                            onBlurred && onBlurred();
                            if (suggest) {
                                setTimeout(() => setIsSuggestionsVisible(false), 500);
                            }
                        }}
                        value={value}
                        onChange={(e) => {
                            setIsSuggestionsVisible(true);
                            onChange(e.target.value.replace(/[\r\n]+/g, '\\n'));
                        }}
                        className={`text-area ${borderType}`}
                        placeholder={placeholder}
                        style={{
                            width: width,
                            fontSize: fontSize,
                            resize: 'none',
                            whiteSpace: 'pre-line',
                            ...inputStyle
                        }}
                        tabIndex={tabindex}
                        readOnly={readonly}
                    />
                ) : type === 'password' ? (
                    <div className="relative">
                        <input
                            onFocus={() => {
                                onFocused && onFocused();
                            }}
                            onBlur={() => {
                                onBlurred && onBlurred();
                            }}
                            tabIndex={tabindex}
                            type={isShowPassword ? 'text' : 'password'}
                            className={`input ${borderType} placeholder:text-[14px]`}
                            style={{
                                width,
                                fontSize: fontSize,
                                ...inputStyle
                            }}
                            placeholder={placeholder}
                            value={value}
                            onChange={(e) => {
                                if (suggest) setIsSuggestionsVisible(true);
                                onChange(e.target.value);
                            }}
                            readOnly={readonly}
                        />
                        <ButtonComponent
                            tabindex={-1}
                            icon={
                                !isShowPassword ? (
                                    <Eye size={16} color="var(--text-color)" />
                                ) : (
                                    <EyeSlash size={16} color="var(--text-color)" />
                                )
                            }
                            onClick={() => {
                                setIsShowPassword(!isShowPassword);
                            }}
                            backgroundColor="transparent"
                            backgroundHoverColor="transparent"
                            backgroundActiveColor="transparent"
                            textColor="var(--secondary-text-color)"
                            style={{
                                padding: 8,
                                position: 'absolute',
                                right: 0,
                                top: 0
                            }}
                        />
                    </div>
                ) : (
                    <input
                        onFocus={() => {
                            onFocused && onFocused();
                            if (suggest) {
                                setIsSuggestionsVisible(true);
                            }
                        }}
                        onBlur={() => {
                            onBlurred && onBlurred();
                            if (suggest) {
                                setTimeout(() => setIsSuggestionsVisible(false), 500);
                            }
                        }}
                        tabIndex={tabindex}
                        type={type}
                        className={`input ${borderType} placeholder:text-[14px]`}
                        style={{
                            width,
                            fontSize: fontSize,
                            ...inputStyle
                        }}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => {
                            if (suggest) setIsSuggestionsVisible(true);
                            onChange(e.target.value);
                        }}
                        readOnly={readonly}
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
                    containerStyle={{}}
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
            {suggest && isSuggestionsVisible && suggestData && (
                <MenuItemsComponent
                    width={'100%'}
                    border={true}
                    containerStyle={{
                        borderRadius: 0,
                        padding: '0'
                    }}
                    menuItems={
                        suggestDataState?.map((item, index) => {
                            return {
                                text: item,
                                onClick: () => {
                                    onChange(item);
                                    setIsSuggestionsVisible(false);
                                },
                                key: item,
                                borderType:
                                    index === suggestDataState.length - 1
                                        ? undefined
                                        : ('bottom' as 'bottom' | 'top' | 'top-bottom' | undefined)
                            };
                        }) ?? []
                    }
                />
            )}
        </div>
    );
}

export default InputComponent;
