import React from "react";

interface SpaceComponentProps {
    height?: number;
    width?: number;
}

function SpaceComponent(props: SpaceComponentProps) {
    const { height = 0, width = 0 } = props;
    return (
        <div
            style={{
                height,
                width,
            }}
        />
    );
}

export default SpaceComponent;
