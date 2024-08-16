import { ReactNode } from 'react';
import { MenuItem } from '../../models/MenuItemType';
import SpaceComponent from '../comonComponent/SpaceComponent';
import './MenuItemsComponent.scss';

interface MenuItemsComponentProps {
    headerComponent?: ReactNode;
    menuItems: MenuItem[];
    border: boolean;
    indexActive?: number;
    width?: number;
    containerStyle?: React.CSSProperties;
}

function MenuItemsComponent(props: MenuItemsComponentProps) {
    const { menuItems, containerStyle, border, indexActive, headerComponent, width } = props;

    return (
        <div
            className={`menu-items`}
            style={{
                ...containerStyle,
                border: border ? '1px solid var(--text-color-light)' : 'none',
                width: width ? `${width}px` : '200px'
            }}>
            {headerComponent && <div className="menu-items-header">{headerComponent}</div>}
            {menuItems.map((item, index) => (
                <div
                    key={index}
                    className={`menu-item 
                        ${indexActive === index ? 'active' : ''}`}
                    onClick={item.onClick}>
                    {item.icon}
                    <SpaceComponent width={16} />
                    <div className={'menu-item-text'}>{item.text}</div>
                </div>
            ))}
        </div>
    );
}

export default MenuItemsComponent;
