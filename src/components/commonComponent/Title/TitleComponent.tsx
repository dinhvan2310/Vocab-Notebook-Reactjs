import React from 'react';
import './TitleComponent.scss';
import SpaceComponent from '../Space/SpaceComponent';

interface TitleComponentProps {
    title?: string;
    icon?: React.ReactNode;
    containerStyle?: React.CSSProperties;
    titleStyle?: React.CSSProperties;
    fontSize?: string;
    fontWeight?: number;
    color?: string;
    className?: string;
    children?: React.ReactNode;
}
function TitleComponent(props: TitleComponentProps) {
    const {
        title,
        icon,
        containerStyle,
        titleStyle,
        fontSize,
        color,
        className,
        fontWeight,
        children
    } = props;

    return (
        <div
            style={{
                color: color || 'var(--text-color)',
                fontWeight: fontWeight || 600,
                overflowY: 'auto',
                ...containerStyle
            }}
            className={`title-component ${className || ''}`}>
            {icon && <div className="iconContainer">{icon}</div>}
            {icon && <SpaceComponent width={16} />}
            <div
                style={{
                    fontSize: fontSize || '1.6em',
                    ...titleStyle
                }}
                className="title">
                {children || title}
            </div>
        </div>
    );
}

export default TitleComponent;
