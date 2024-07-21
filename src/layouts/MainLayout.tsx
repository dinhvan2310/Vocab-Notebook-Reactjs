import React from 'react';
import styles from './MainLayout.module.css';
import { Outlet } from 'react-router-dom';
import { HambergerMenu, Home } from 'iconsax-react';
import TitleComponent from '../components/TitleComponent';

function MainLayout() {
    return (
        <div className={styles.container}>
            <div className={styles.leftContainer}>
                <div className={styles.iconMenuContainer}>
                    <HambergerMenu className={styles.iconMenu} color="#586380" size="42" />
                </div>

                <div className={styles.menuContainer}>
                    <div className={styles.menuItem}>
                        <TitleComponent title="Trang chủ" icon={<Home size={24} />} />
                    </div>
                    <div className={styles.menuItem}>
                        <TitleComponent title="Trang chủ" icon={<Home size={24} />} />
                    </div>
                    <div className={styles.menuItem}>
                        <TitleComponent title="Trang chủ" icon={<Home size={24} />} />
                    </div>
                </div>
            </div>
            <div className={styles.rightContainer}>
                <Outlet />
            </div>
        </div>
    );
}

export default MainLayout;
