import React, { ReactNode } from 'react';
import './ButtonComponent.scss';
import Lottie from 'react-lottie';
import SpaceComponent from '../Space/SpaceComponent';
import LoadingAnimation from '../../../assets/animation/loadingAnimation.json';
import TextComponent from '../Text/TextComponent';
interface ButtonComponentProps {
    text: string;
    textColor?: string;
    icon?: ReactNode;
    backgroundColor?: string;
    backgroundHoverColor?: string;
    backgroundActiveColor?: string;
    disabled?: boolean;
    borderColor?: string;
    onClick?: () => void;
    style?: React.CSSProperties;
    fontSize?: string;
    isLoading?: boolean;
    isBorder?: boolean;
    type?: 'submit' | 'button' | 'reset';
    buttonWidth?: number | 'auto' | '100%';
}
function ButtonComponent(props: ButtonComponentProps) {
    const {
        text,
        onClick = () => {},
        type = 'button',
        icon,
        style,
        backgroundActiveColor = 'var(--primary-active-color)',
        backgroundColor = 'var(--primary-color)',
        backgroundHoverColor = 'var(--primary-hover-color)',
        borderColor = 'var(--border-color)',
        isBorder = false,
        textColor = 'var(--white-color)',
        fontSize = '1.2em',
        isLoading = false,
        buttonWidth = 'auto',
        disabled = false
    } = props;

    const [isHover, setIsHover] = React.useState(false);
    const [isActive, setIsActive] = React.useState(false);

    let backGroundColor = isActive
        ? backgroundActiveColor
        : isHover
        ? backgroundHoverColor
        : backgroundColor;

    backGroundColor = isLoading || disabled ? 'var(--disabled-color)' : backGroundColor;

    return (
        <button
            type={type}
            onClick={onClick}
            className={`button`}
            disabled={disabled || isLoading}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => {
                setIsHover(false);
                setIsActive(false);
            }}
            onMouseDown={() => setIsActive(true)}
            onMouseUp={() => setIsActive(false)}
            style={{
                backgroundColor: backGroundColor,
                border: isBorder ? `2px solid ${borderColor}` : 'none',
                pointerEvents: isLoading || disabled ? 'none' : 'auto',
                width: buttonWidth,
                ...style
            }}>
            {icon && (
                <div
                    style={{
                        visibility: isLoading ? 'hidden' : 'visible'
                    }}>
                    {icon}
                </div>
            )}
            {icon && <SpaceComponent width={8} />}
            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                }}>
                <TextComponent
                    text={text}
                    textColor={textColor}
                    fontSize={fontSize}
                    isVisible={!isLoading}
                />
                <Lottie
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: isLoading ? 'block' : 'none'
                    }}
                    options={{ loop: true, autoplay: true, animationData: LoadingAnimation }}
                    height={80}
                    width={80}
                />
            </div>
        </button>
    );
}

export default ButtonComponent;
