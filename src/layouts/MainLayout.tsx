import { Add, Additem, FolderAdd, HambergerMenu, Home, Logout } from 'iconsax-react';
import React from 'react';
import { Outlet } from 'react-router-dom';
import ButtonComponent from '../components/ButtonComponent';
import FloatingActionButton from '../components/FloatingActionButton';
import RowComponent from '../components/RowComponent';
import SearchBoxComponent from '../components/SearchBoxComponent';
import SpaceComponent from '../components/SpaceComponent';
import TitleComponent from '../components/TitleComponent';
import { useAuth } from '../hooks/useAuth';
import styles from './MainLayout.module.css';

function MainLayout() {
    const [searchValue, setSearchValue] = React.useState('');

    const { user, signOut } = useAuth();

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
                        floatingButtonItems={[
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
                        ]}
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
                        imageUrl={user?.photoURL || ''}
                        floatingButtonItems={[
                            {
                                text: 'Log out',
                                icon: <Logout size={20} />,
                                onClick: () => {
                                    signOut();
                                }
                            }
                        ]}
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
