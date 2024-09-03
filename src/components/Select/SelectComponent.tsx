import { ArrowDown2 } from 'iconsax-react';
import { ReactNode, useState } from 'react';
import SpaceComponent from '../commonComponent/Space/SpaceComponent';
import TextComponent from '../commonComponent/Text/TextComponent';
import './SelectComponent.scss';

interface Data<T> {
    label: string;
    value: T;
    icon?: ReactNode;
    disable?: boolean;
}

interface SelectComponentProps<T> {
    title?: string;
    defaultValue?: string;
    value: string | undefined;
    options: Data<T>[];
    onChange: (value: T) => void;

    width?: string;
    color?: string;
    positionPopup?: 'top' | 'bottom';
    hoverColor?: string;
    disabled?: boolean;
    style?: React.CSSProperties;
    optionStyle?: React.CSSProperties;
}
function SelectComponent(props: SelectComponentProps<string>) {
    const {
        title,
        defaultValue,
        value,
        options = [],
        onChange,
        width = '100%',
        color = 'var(--secondary-text-color)',
        hoverColor = 'var(--primary-color)',
        style,
        positionPopup = 'bottom',
        disabled = false,
        optionStyle
    } = props;

    const [isHover, setIsHover] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleClickOutside = (event: MouseEvent) => {
        if ((event?.target as HTMLElement)?.closest('.select-container') === null) {
            setIsOpen(false);
        }
    };

    return (
        <div
            onClick={() => {
                setIsOpen(!isOpen);
                document.addEventListener('click', handleClickOutside);
            }}
            className="select-container"
            style={{
                minWidth: width,
                borderColor: isHover ? hoverColor : color,
                opacity: disabled ? 0.5 : 1,
                ...style
            }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => {
                setIsHover(false);
            }}>
            <div className="select cursor-pointer">
                <TextComponent
                    text={
                        value === undefined
                            ? title
                            : options.find((option) => option.value === value)?.label
                    }
                    textColor={color}
                />
                <SpaceComponent width={16} />
                <ArrowDown2 size="20" color={isHover ? hoverColor : color} />
            </div>

            {isOpen && (
                <div
                    className={`options ${positionPopup === 'top' ? 'top' : 'bottom'}`}
                    style={optionStyle}>
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className={`
                                option 
                                ${
                                    value === undefined
                                        ? defaultValue === option.value && 'selected'
                                        : value === option.value && 'selected'
                                }
                                ${option.disable && 'pointer-events-none'}
                                ${option.disable && 'opacity-50'}
                                `}
                            style={{}}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}>
                            <div className="flex-row flex items-center">
                                {option.icon}
                                <TextComponent className="ml-2" text={option.label} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SelectComponent;
