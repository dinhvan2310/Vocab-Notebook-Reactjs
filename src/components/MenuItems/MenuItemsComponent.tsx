import { ReactNode } from 'react';
import './MenuItemsComponent.scss';
import { MenuItemInterface } from '../../types/MenuItemType';
import SpaceComponent from '../commonComponent/Space/SpaceComponent';
import { useResponsive } from '../../hooks/useResponsive';

interface MenuItemsComponentProps {
    headerComponent?: ReactNode;
    menuItems: MenuItemInterface[];
    border: boolean;
    selectedKey?: string;
    width?: number;
    containerStyle?: React.CSSProperties;
    onSelectedKeyChange?: (key: string) => void;
    backGroundColor?: string;

    inlineCollapsed?: undefined | 'inline-collapsed' | 'popup-menu';
}

function MenuItemsComponent(props: MenuItemsComponentProps) {
    const {
        menuItems,
        containerStyle,
        border,
        selectedKey,
        headerComponent,
        width,
        backGroundColor = 'var(--bg-color)',
        onSelectedKeyChange,
        inlineCollapsed = undefined
    } = props;

    return (
        <div
            style={{
                border: border ? '1px solid var(--border-color)' : 'none',
                width: width ? `${width}px` : '200px',
                backgroundColor: backGroundColor,
                ...containerStyle
            }}
            className={`menu-items ${inlineCollapsed}`}>
            {headerComponent && <div className="menu-items-header">{headerComponent}</div>}
            {menuItems.map((item, index) => (
                <div
                    key={index}
                    style={{
                        borderBottom:
                            item.borderType === 'bottom' || item.borderType === 'top-bottom'
                                ? '1px solid var(--border-color)'
                                : 'none',
                        borderTop:
                            item.borderType === 'top' || item.borderType === 'top-bottom'
                                ? '1px solid var(--border-color)'
                                : 'none',
                        display: item.disabled ? 'none' : 'block'
                    }}>
                    <div
                        key={index}
                        className={`menu-item ${selectedKey === item.key ? 'active' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelectedKeyChange?.(item.key);
                            item.onClick?.();
                        }}>
                        <div className="menu-item-icon">{item.icon}</div>
                        <div
                            style={{
                                marginLeft: item.icon ? '16px' : '0'
                            }}
                            className={'menu-item-text'}>
                            {item.text}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MenuItemsComponent;
