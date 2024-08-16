import React from 'react';
import SpaceComponent from './SpaceComponent';
import './TitleComponent.scss';

interface TitleComponentProps {
    title: string;
    icon?: React.ReactNode;
    containerStyle?: React.CSSProperties;
    titleStyle?: React.CSSProperties;
    fontSize?: string;
}
function TitleComponent(props: TitleComponentProps) {
    const { title, icon, containerStyle, titleStyle, fontSize } = props;

    return (
        <div
            className="title-container"
            style={{
                ...containerStyle,
                fontSize: fontSize || '1.6em'
            }}>
            {icon && <div className="iconContainer">{icon}</div>}
            {icon && <SpaceComponent width={16} />}
            <div style={titleStyle} className="title">
                {title}
            </div>
        </div>
    );
}

export default TitleComponent;
