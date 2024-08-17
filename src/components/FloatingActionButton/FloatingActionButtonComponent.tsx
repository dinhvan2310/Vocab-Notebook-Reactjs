import React from 'react';
import MenuItemsComponent from '../MenuItems/MenuItemsComponent';
import './FloatingActionButtonComponent.scss';
import { MenuItemInterface } from '../../types/MenuItemType';
interface FloatingActionButtonProps {
    headerComponent?: React.ReactNode;
    menuItems: MenuItemInterface[];
    menuItemWidth?: number;
    containerStyle?: React.CSSProperties;
    backgroundColor?: string;
    backgroundHoverColor?: string;
    backgroundActiveColor?: string;
    icon?: React.ReactNode;
    menuItemsPosition?: 'left' | 'right' | 'center';
    menuItemsBackgroundColor?: string;
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
        backgroundHoverColor,

        menuItemsPosition = 'left'
    } = props;
    const [open, setOpen] = React.useState(false);

    const [isHover, setIsHover] = React.useState(false);
    const [isActive, setIsActive] = React.useState(false);

    const menuItemContainerClass = `menu-item-container ${menuItemsPosition}`;

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <div className="floating-action-button">
            <div
                className="button-container"
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => {
                    setIsHover(false);
                    setIsActive(false);
                }}
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
                <div className={menuItemContainerClass}>
                    <MenuItemsComponent
                        headerComponent={headerComponent}
                        border={true}
                        menuItems={menuItems}
                        width={menuItemWidth}
                        containerStyle={{
                            backgroundColor: props.menuItemsBackgroundColor ?? 'var(--bg-color)'
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default FloatingActionButtonComponent;
