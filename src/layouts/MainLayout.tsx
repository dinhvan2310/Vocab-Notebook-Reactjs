import {
    Add,
    Additem,
    Folder,
    FolderAdd,
    HambergerMenu,
    Home,
    Logout,
    NotificationStatus
} from 'iconsax-react';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import FloatingActionButton from '../components/FloatingActionButton';
import MenuItemsComponent from '../components/MenuItemsComponent';
import SearchBoxComponent from '../components/SearchBoxComponent';
import { useAuth } from '../hooks/useAuth';
import styles from './MainLayout.module.css';
import RowComponent from '../components/comonComponent/RowComponent';
import SpaceComponent from '../components/comonComponent/SpaceComponent';
import ButtonComponent from '../components/comonComponent/ButtonComponent';

function MainLayout() {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = React.useState('');
    const { user, signOut } = useAuth();

    const [activePage, setActivePage] = React.useState(0);

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
                    <MenuItemsComponent
                        containerStyle={{
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'sticky',
                            top: '96px',
                            border: 'none',
                            flex: 0
                        }}
                        indexActive={activePage}
                        border={false}
                        menuItems={[
                            {
                                text: 'Trang chủ',
                                icon: <Home size={20} />,
                                onClick: () => {
                                    navigate('/');
                                    setActivePage(0);
                                }
                            },
                            {
                                text: 'Thư viện của bạn',
                                icon: <Folder size={20} />,
                                onClick: () => {
                                    navigate(`/user/${user?.uid}/folders`);
                                    setActivePage(1);
                                }
                            },
                            {
                                text: 'Thông báo',
                                icon: <NotificationStatus size={20} />,
                                onClick: () => {
                                    navigate('/notification');
                                    setActivePage(2);
                                }
                            }
                        ]}
                    />
                </div>
                <div className={styles.rightContainer}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default MainLayout;
