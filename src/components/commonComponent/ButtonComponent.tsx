import React, { ReactNode } from 'react';
import SpaceComponent from './SpaceComponent';
import './ButtonComponent.scss';
import TextComponent from './TextComponent';
interface ButtonComponentProps {
    text: string;
    textColor?: string;
    icon?: ReactNode;
    backgroundColor?: string;
    backgroundHoverColor?: string;
    backgroundActiveColor?: string;
    borderColor?: string;
    onClick: () => void;
    style?: React.CSSProperties;
    fontSize?: string;
}
function ButtonComponent(props: ButtonComponentProps) {
    const {
        text,
        onClick,
        icon,
        style,
        backgroundActiveColor,
        backgroundColor,
        backgroundHoverColor,
        borderColor,
        textColor,
        fontSize
    } = props;

    const [isHover, setIsHover] = React.useState(false);
    const [isActive, setIsActive] = React.useState(false);

    return (
        <div
            onClick={onClick}
            className={`button`}
            onMouseEnter={() => {
                setIsHover(true);
            }}
            onMouseLeave={() => {
                setIsHover(false);
                setIsActive(false);
            }}
            onMouseDown={() => setIsActive(true)}
            onMouseUp={() => setIsActive(false)}
            style={{
                ...style,
                borderColor: borderColor || 'transparent',
                borderWidth: borderColor ? '2px' : '0',
                borderStyle: borderColor ? 'solid' : 'none',

                backgroundColor: isActive
                    ? backgroundActiveColor
                    : isHover
                    ? backgroundHoverColor
                    : backgroundColor
            }}>
            {icon && icon}
            {icon && <SpaceComponent width={8} />}
            <TextComponent text={text} fontSize={fontSize} textColor={textColor} />
        </div>
    );
}

export default ButtonComponent;
