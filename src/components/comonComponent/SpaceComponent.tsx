import React from 'react';

interface SpaceComponentProps {
    height?: number;
    width?: number;
    fullWidth?: boolean;
}

function SpaceComponent(props: SpaceComponentProps) {
    const { height = 0, width = 0, fullWidth } = props;
    if (fullWidth) {
        return (
            <div
                style={{
                    width: '100%'
                }}
            />
        );
    }
    return (
        <div
            style={{
                height,
                width
            }}
        />
    );
}

export default SpaceComponent;
