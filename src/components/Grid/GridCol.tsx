interface GridColProps {
    children: React.ReactNode;

    span: number;
    flex?: number | string;

    offset?: number;
    order?: number;
    gutter?: number;

    style?: React.CSSProperties;
}
function GridCol(props: GridColProps) {
    const { children, span, flex, offset, order, gutter, style } = props;

    const gutterX = Array.isArray(gutter) ? gutter[0] : gutter;
    const gutterY = Array.isArray(gutter) ? gutter[1] : 0;

    return (
        <div
            className="grid-col"
            style={{
                flex: flex || `0 0 ${(span / 12) * 100}%`,
                maxWidth: flex ? 'none' : `${(span / 12) * 100}%`,
                marginLeft: offset ? `${(offset / 12) * 100}%` : 0,
                order: order || 0,
                paddingLeft: gutterX ? `${gutterX / 2}px` : 0,
                paddingRight: gutterX ? `${gutterX / 2}px` : 0,
                paddingTop: gutterY ? `${gutterY / 2}px` : 0,
                paddingBottom: gutterY ? `${gutterY / 2}px` : 0,
                ...style
            }}>
            {children}
        </div>
    );
}

export default GridCol;
