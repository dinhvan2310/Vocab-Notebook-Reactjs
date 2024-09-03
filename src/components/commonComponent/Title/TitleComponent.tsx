import React from 'react';
import './TitleComponent.scss';
import SpaceComponent from '../Space/SpaceComponent';

interface TitleComponentProps {
    title: string;
    icon?: React.ReactNode;
    containerStyle?: React.CSSProperties;
    titleStyle?: React.CSSProperties;
    fontSize?: string;
    fontWeight?: number;
    color?: string;
    className?: string;
}
function TitleComponent(props: TitleComponentProps) {
    const { title, icon, containerStyle, titleStyle, fontSize, color, className, fontWeight } =
        props;

    return (
        <div
            style={{
                ...containerStyle,
                fontSize: fontSize || '1.6em',
                color: color || 'var(--text-color)',
                fontWeight: fontWeight || 600
            }}
            className={`title-component ${className || ''}`}>
            {icon && <div className="iconContainer">{icon}</div>}
            {icon && <SpaceComponent width={16} />}
            <div style={titleStyle} className="title">
                {title}
            </div>
        </div>
    );
}

export default TitleComponent;
