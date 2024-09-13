import { ReactNode } from 'react';
import { MenuItemInterface } from '../../types/MenuItemType';
import './MenuItemsComponent.scss';

interface MenuItemsComponentProps {
    headerComponent?: ReactNode;
    menuItems: MenuItemInterface[];
    border: boolean;
    selectedKey?: string;
    width?: number | string;
    containerStyle?: React.CSSProperties;
    onSelectedKeyChange?: (key: string) => void;
    backGroundColor?: string;

    inlineCollapsed?: 'none' | 'inline-collapsed' | 'popup-menu';
    className?: string;
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
        inlineCollapsed = 'none',
        className = ''
    } = props;

    if (menuItems.length === 0) {
        return null;
    }

    return (
        <div
            style={{
                border: border ? '1px solid var(--border-color)' : 'none',
                width: width ? `${width}` : '200px',
                backgroundColor: backGroundColor,
                ...containerStyle
            }}
            className={`menu-items ${inlineCollapsed} ${className}`}>
            {headerComponent && <div className="menu-items-header">{headerComponent}</div>}
            {menuItems.length > 0 &&
                menuItems.map((item, index) => (
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
                            pointerEvents: item.disabled ? 'none' : 'auto', //  Disable pointer events if the item is disabled
                            opacity: item.disabled ? 0.5 : 1 //  Reduce the opacity if the item is disabled
                        }}>
                        <div
                            key={index}
                            className={`menu-item ${selectedKey === item.key ? 'active' : ''}
                            `}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectedKeyChange?.(item.key);
                                item.onClick?.();
                            }}>
                            <div className="menu-item-icon">{item.icon}</div>
                            <div
                                style={{
                                    marginLeft: item.icon ? '16px' : '0',
                                    whiteSpace: 'pre-line'
                                }}
                                className={'menu-item-text'}>
                                {item.text.replace(/\\n/g, '\n')}
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
}

export default MenuItemsComponent;
