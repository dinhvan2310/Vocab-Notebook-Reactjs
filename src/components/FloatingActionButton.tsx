import React from 'react';
import { FLoatingButtonItemProps } from '../models/FloatingButtonItemType';
import styles from './FloatingActionButton.module.css';
import SpaceComponent from './SpaceComponent';

interface FloatingActionButtonProps {
    floatingButtonItems: FLoatingButtonItemProps[];
    type: 'image' | 'icon';
    imageUrl?: string;
    icon?: React.ReactNode;
}

function FloatingActionButton(props: FloatingActionButtonProps) {
    const { floatingButtonItems, icon, type, imageUrl } = props;
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        if (!open) {
            document.addEventListener('click', handleClickOutside, {
                capture: true
            });
        }
        setOpen(!open);
    };

    const handleClickOutside = () => {
        setOpen(false);
        removeEventListener('click', handleClickOutside);
    };

    return (
        <div
            className={`${styles.container} 
        ${type === 'icon' && styles.typeIcon}`}>
            {type === 'icon' && (
                <div className={styles.floatingButton} onClick={handleClick}>
                    {icon}
                </div>
            )}
            {type === 'image' && (
                <div className={styles.imageContainer} onClick={handleClick}>
                    <img className={styles.image} src={imageUrl} alt="" />
                </div>
            )}
            {open && (
                <div className={styles.floatingContainer}>
                    {open &&
                        floatingButtonItems.map((item, index) => (
                            <div key={index} className={styles.floatingItem} onClick={item.onClick}>
                                {item.icon}
                                <SpaceComponent width={16} />
                                <div className={styles.floatingItemText}>{item.text}</div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}

export default FloatingActionButton;
