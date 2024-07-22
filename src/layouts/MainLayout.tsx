import React from 'react';
import styles from './MainLayout.module.css';
import { Outlet } from 'react-router-dom';
import { Add, Additem, FolderAdd, HambergerMenu, Home } from 'iconsax-react';
import TitleComponent from '../components/TitleComponent';
import SearchBoxComponent from '../components/SearchBoxComponent';
import FloatingActionButton from '../components/FloatingActionButton';
import { FLoatingButtonItemProps } from '../models/FloatingButtonItemType';
import RowComponent from '../components/RowComponent';
import SpaceComponent from '../components/SpaceComponent';
import ButtonComponent from '../components/ButtonComponent';

function MainLayout() {
    const [searchValue, setSearchValue] = React.useState('');

    const floatingButtonList: FLoatingButtonItemProps[] = [
        {
            text: 'Học phần',
            icon: <Additem size={20} />,
            onClick: () => console.log('Học phần')
        },
        {
            text: 'Thư mục',
            icon: <FolderAdd size="20" />,
            onClick: () => console.log('Thư mục')
        }
    ];
    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.iconMenuContainer}>
                    <HambergerMenu className={styles.iconMenu} color="#586380" size="42" />
                </div>
                <SearchBoxComponent value={searchValue} onChange={setSearchValue} />

                <RowComponent>
                    <FloatingActionButton
                        icon={<Add size="32" color="#fff" />}
                        floatingButtonItems={floatingButtonList}
                        type="icon"
                    />
                    <SpaceComponent width={32} />
                    <ButtonComponent
                        type="mini"
                        text="Nâng cấp lên Plus"
                        onClick={() => console.log('Thêm')}
                    />
                    <SpaceComponent width={32} />

                    <FloatingActionButton
                        imageUrl="https://firebasestorage.googleapis.com/v0/b/plantsnap-419307.appspot.com/o/photos%2F1718478722497.jpg?alt=media&token=ee97500a-93fc-4f93-98c8-afe17ff8c3e9"
                        floatingButtonItems={floatingButtonList}
                        type="image"
                    />
                </RowComponent>
            </div>
            <div className={styles.contentContainer}>
                <div className={styles.leftContainer}>
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
        </div>
    );
}

export default MainLayout;
