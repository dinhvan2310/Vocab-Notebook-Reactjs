import { ArrowDown2 } from 'iconsax-react';
import TextComponent from '../commonComponent/Text/TextComponent';
import './SelectComponent.scss';
import SpaceComponent from '../commonComponent/Space/SpaceComponent';
import { useEffect, useState } from 'react';

interface Data<T> {
    label: string;
    value: T;
}

interface SelectComponentProps<T> {
    defaultValue: string;
    options: Data<T>[];
    onChange: (value: T) => void;

    width?: string;
    color?: string;
    positionPopup?: 'top' | 'bottom';
    hoverColor?: string;
    disabled?: boolean;
    style?: React.CSSProperties;
}
function SelectComponent(props: SelectComponentProps<string>) {
    const {
        defaultValue,
        options = [],
        onChange,
        width = '100%',
        color = 'var(--secondary-text-color)',
        hoverColor = 'var(--primary-color)',
        style,
        positionPopup = 'bottom',
        disabled = false
    } = props;

    const [isHover, setIsHover] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [selectedValue, setSelectedValue] = useState(() => {
        if (options.filter((opt) => opt.value === defaultValue).length === 0) {
            return options[0].value;
        }
        return defaultValue;
    });

    return (
        <div
            onClick={() => {
                setIsOpen(!isOpen);
            }}
            className="select-container"
            style={{
                minWidth: width,
                borderColor: isHover ? hoverColor : color,
                pointerEvents: disabled ? 'none' : 'auto',
                opacity: disabled ? 0.5 : 1,
                ...style
            }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => {
                setIsHover(false);
            }}>
            <div className="select">
                <TextComponent
                    text={options.filter((opt) => opt.value === selectedValue)[0].label}
                    textColor={color}
                />
                <SpaceComponent width={16} />
                <ArrowDown2 size="20" color={isHover ? hoverColor : color} />
            </div>

            {isOpen && (
                <div className={`options ${positionPopup === 'top' ? 'top' : 'bottom'}`}>
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className={`option ${option.value === defaultValue ? 'selected' : ''}`}
                            style={{}}
                            onClick={() => {
                                onChange(option.value);
                                setSelectedValue(option.value);
                                setIsOpen(false);
                            }}>
                            <TextComponent text={option.label} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SelectComponent;
