interface SpaceComponentProps {
    height?: number | string;
    width?: number | string;
}

function SpaceComponent(props: SpaceComponentProps) {
    const { height = 0, width = 0 } = props;
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
