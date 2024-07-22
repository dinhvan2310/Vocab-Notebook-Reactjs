import React from 'react';

interface RowComponentProps {
    children: React.ReactNode;
}
function RowComponent(props: RowComponentProps) {
    const { children } = props;
    return <div style={{ display: 'flex', flexDirection: 'row' }}>{children}</div>;
}

export default RowComponent;
