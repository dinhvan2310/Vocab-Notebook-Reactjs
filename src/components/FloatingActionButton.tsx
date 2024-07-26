import React from 'react';
import styles from './FloatingActionButton.module.css';
import { MenuItem } from '../models/MenuItemType';
import MenuItemsComponent from './MenuItemsComponent';

interface FloatingActionButtonProps {
    floatingButtonItems: MenuItem[];
    type: 'image' | 'icon';
    imageUrl?: string;
    icon?: React.ReactNode;
}

function FloatingActionButton(props: FloatingActionButtonProps) {
    const { floatingButtonItems, icon, type, imageUrl } = props;
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <div
            className={`${styles.container} 
                        ${type === 'icon' && styles.typeIcon}`}>
            {type === 'icon' && (
                <div
                    className={styles.floatingButton}
                    onClick={(event) => {
                        event.stopPropagation();
                        handleClick();
                    }}>
                    {icon}
                </div>
            )}
            {type === 'image' && (
                <div
                    className={styles.imageContainer}
                    onClick={(event) => {
                        event.stopPropagation();
                        handleClick();
                    }}>
                    <img className={styles.image} src={imageUrl} alt="" />
                </div>
            )}
            {open && <MenuItemsComponent border={true} menuItems={floatingButtonItems} />}
        </div>
    );
}

export default FloatingActionButton;
