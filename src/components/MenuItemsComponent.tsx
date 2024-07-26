import React from 'react';
import styles from './MenuItemsComponent.module.css';
import { MenuItem } from '../models/MenuItemType';
import SpaceComponent from './comonComponent/SpaceComponent';

interface MenuItemsComponentProps {
    menuItems: MenuItem[];
    border: boolean;
    indexActive?: number;
    containerStyle?: React.CSSProperties;
}

function MenuItemsComponent(props: MenuItemsComponentProps) {
    const { menuItems, containerStyle, border, indexActive } = props;

    return (
        <div
            className={`${styles.floatingContainer} ${border && styles.border}`}
            style={containerStyle}>
            {menuItems.map((item, index) => (
                <div
                    key={index}
                    className={`${styles.floatingItem} 
                    ${indexActive === index ? styles.active : ''}`}
                    onClick={item.onClick}>
                    {item.icon}
                    <SpaceComponent width={16} />
                    <div className={styles.floatingItemText}>{item.text}</div>
                </div>
            ))}
        </div>
    );
}

export default MenuItemsComponent;
