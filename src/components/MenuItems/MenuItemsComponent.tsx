import { ReactNode } from 'react';
import SpaceComponent from '../commonComponent/SpaceComponent';
import './MenuItemsComponent.scss';
import { MenuItemInterface } from '../../types/MenuItemType';

interface MenuItemsComponentProps {
    headerComponent?: ReactNode;
    menuItems: MenuItemInterface[];
    border: boolean;
    selectedKey?: string;
    width?: number;
    containerStyle?: React.CSSProperties;
    onSelectedKeyChange?: (key: string) => void;
}

function MenuItemsComponent(props: MenuItemsComponentProps) {
    const {
        menuItems,
        containerStyle,
        border,
        selectedKey,
        headerComponent,
        width,
        onSelectedKeyChange
    } = props;

    return (
        <div
            className={`menu-items`}
            style={{
                ...containerStyle,
                border: border ? '1px solid var(--border-color)' : 'none',
                width: width ? `${width}px` : '200px'
            }}>
            {headerComponent && <div className="menu-items-header">{headerComponent}</div>}
            {menuItems.map((item, index) => (
                <div
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
                        onClick={() => {
                            onSelectedKeyChange?.(item.key);
                            item.onClick?.();
                        }}>
                        {item.icon}
                        {item.icon && <SpaceComponent width={16} />}
                        <div className={'menu-item-text'}>{item.text}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MenuItemsComponent;
