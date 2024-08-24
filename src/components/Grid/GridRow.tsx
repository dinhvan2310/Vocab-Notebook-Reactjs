/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

interface GridRowProps {
    children: React.ReactNode;

    wrap?: boolean;
    justify?: 'start' | 'end' | 'center' | 'between' | 'around';
    align?: 'top' | 'middle' | 'bottom';
    gutter?: number | number[];

    className?: string;
    style?: React.CSSProperties;
}

function GridRow(props: GridRowProps) {
    const {
        children,
        wrap = true,
        justify = 'start',
        align = 'top',
        gutter = 0,
        className,
        style
    } = props;

    const gutterX = Array.isArray(gutter) ? gutter[0] : gutter;
    const gutterY = Array.isArray(gutter) ? gutter[1] : 0;

    return (
        <div
            className={`grid-row ${className ?? ''}`}
            style={{
                display: 'flex',
                flexWrap: wrap ? 'wrap' : 'nowrap',
                justifyContent: justify ? `flex-${justify}` : 'flex-start',
                alignItems: align ? `flex-${align}` : 'stretch',
                marginLeft: gutterX ? `${gutterX / -2}px` : 0,
                marginRight: gutterX ? `${gutterX / -2}px` : 0,
                marginTop: gutterY ? `${gutterY / -2}px` : 0,
                marginBottom: gutterY ? `${gutterY / -2}px` : 0,
                ...style
            }}>
            {React.Children.toArray(children).map((child: any) => {
                return child && React.cloneElement(child, { gutter });
            })}
        </div>
    );
}

export default GridRow;
