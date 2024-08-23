import React, { useEffect } from 'react';
import MenuItemsComponent from '../MenuItems/MenuItemsComponent';
import './FloatingActionButtonComponent.scss';
import { MenuItemInterface } from '../../types/MenuItemType';
import RowComponent from '../commonComponent/Row/RowComponent';
import SpaceComponent from '../commonComponent/Space/SpaceComponent';
import TextComponent from '../commonComponent/Text/TextComponent';
interface FloatingActionButtonProps {
    headerComponent?: React.ReactNode;
    menuItems: MenuItemInterface[];
    menuItemWidth?: number;
    containerStyle?: React.CSSProperties;
    backgroundColor?: string;
    backgroundHoverColor?: string;
    backgroundActiveColor?: string;
    icon?: React.ReactNode;
    text?: string;
    color?: string;
    menuItemsPosition?: 'left' | 'right' | 'center';
    menuItemsBackgroundColor?: string;
}

function FloatingActionButtonComponent(props: FloatingActionButtonProps) {
    const {
        headerComponent,
        color = 'var(--text-color)',
        text,
        menuItemsBackgroundColor,
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

    menuItems.forEach((item) => {
        const func = item.onClick ?? (() => {});
        item.onClick = () => {
            func();
            setOpen(false);
        };
    });

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (e.target instanceof Element) {
                if (!document.querySelector('.menu-item-container')?.contains(e.target)) {
                    setOpen(false);
                }
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="floating-action-button">
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                }}
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
                <RowComponent justifyContent="center" alignItems="center">
                    <div className="floatingButton">{icon}</div>
                    {text && <SpaceComponent width={8} />}
                    {text && <TextComponent textColor={color} text={text ?? ''} />}
                </RowComponent>
            </div>
            {open && (
                <div className={menuItemContainerClass}>
                    <MenuItemsComponent
                        headerComponent={headerComponent}
                        border={true}
                        menuItems={menuItems}
                        width={menuItemWidth}
                        containerStyle={{
                            backgroundColor: menuItemsBackgroundColor ?? 'var(--bg-color)'
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default FloatingActionButtonComponent;
