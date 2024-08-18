import React, { ReactNode } from 'react';
import SpaceComponent from './SpaceComponent';
import './ButtonComponent.scss';
import TextComponent from './TextComponent';
import LoadingAnimation from '../../assets/animation/loadingAnimation.json';
import Lottie from 'react-lottie';
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
    isLoading?: boolean;
    isBorder?: boolean;
    buttonWidth?: number;
}
function ButtonComponent(props: ButtonComponentProps) {
    const {
        text,
        onClick,
        icon,
        style,
        backgroundActiveColor = 'var(--primary-active-color)',
        backgroundColor = 'var(--primary-color)',
        backgroundHoverColor = 'var(--primary-hover-color)',
        borderColor = 'var(--border-color)',
        isBorder = true,
        textColor = 'var(--text-color)',
        fontSize = '1.4em',
        isLoading = false,
        buttonWidth = 200
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
                backgroundColor: isHover
                    ? backgroundHoverColor
                    : isActive
                    ? backgroundActiveColor
                    : backgroundColor,
                border: isBorder ? '1px solid' : 'none',
                borderColor: borderColor,
                cursor: 'pointer',
                minWidth: buttonWidth,
                pointerEvents: isLoading ? 'none' : 'auto'
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
        </div>
    );
}

export default ButtonComponent;
