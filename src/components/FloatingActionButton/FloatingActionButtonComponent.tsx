import React from 'react';
import { MenuItem } from '../../models/MenuItemType';
import MenuItemsComponent from '../MenuItems/MenuItemsComponent';
import './FloatingActionButtonComponent.scss';
interface FloatingActionButtonProps {
    headerComponent?: React.ReactNode;
    menuItems: MenuItem[];
    menuItemWidth?: number;
    containerStyle?: React.CSSProperties;
    backgroundColor?: string;
    backgroundHoverColor?: string;
    backgroundActiveColor?: string;
    icon?: React.ReactNode;
}

function FloatingActionButtonComponent(props: FloatingActionButtonProps) {
    const {
        headerComponent,
        menuItems,
        menuItemWidth,
        icon,
        containerStyle,
        backgroundActiveColor,
        backgroundColor,
        backgroundHoverColor
    } = props;
    const [open, setOpen] = React.useState(false);

    const [isHover, setIsHover] = React.useState(false);
    const [isActive, setIsActive] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <div className="floating-action-button">
            <div
                className="button-container"
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                onMouseDown={() => setIsActive(true)}
                onMouseUp={() => setIsActive(false)}
                style={{
                    ...containerStyle,
                    backgroundColor: isActive
                        ? backgroundActiveColor
                        : isHover
                        ? backgroundHoverColor
                        : backgroundColor
                }}>
                <div className="floatingButton" onClick={handleClick}>
                    {icon}
                </div>
            </div>
            {open && (
                <MenuItemsComponent
                    headerComponent={headerComponent}
                    border={true}
                    menuItems={menuItems}
                    width={menuItemWidth}
                />
            )}
        </div>
    );
}

export default FloatingActionButtonComponent;
