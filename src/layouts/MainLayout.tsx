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
import RowComponent from '../components/comonComponent/RowComponent';
import SpaceComponent from '../components/comonComponent/SpaceComponent';
import ButtonComponent from '../components/comonComponent/ButtonComponent';
import { useAuth } from '../hooks/useAuth';
import './MainLayout.scss';
import FloatingActionButtonComponent from '../components/FloatingActionButton/FloatingActionButtonComponent';
import SearchBoxComponent from '../components/SearchBox/SearchBoxComponent';
import MenuItemsComponent from '../components/MenuItems/MenuItemsComponent';
import ColumnComponent from '../components/comonComponent/ColumnComponent';
import TitleComponent from '../components/comonComponent/TitleComponent';
import TextComponent from '../components/comonComponent/TextComponent';

function MainLayout() {
    const navigate = useNavigate();

    const { user, signOut } = useAuth();

    const [searchValue, setSearchValue] = React.useState('');
    const [activePage, setActivePage] = React.useState(0);

    const menuItemsAdd = [
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

    const menuItemsSetting = [
        {
            text: 'Log out',
            icon: <Logout size={20} />,
            onClick: () => {
                signOut();
            }
        }
    ];

    const menuItemsSideBar = [
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
    ];

    const menuItemsSettingHeader = (
        <RowComponent alignItems="center">
            <img
                src={user?.photoURL || ''}
                alt="avatar"
                style={{
                    objectFit: 'cover',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%'
                }}
            />
            <SpaceComponent width={16} />
            <ColumnComponent alignItems="flex-start">
                <TitleComponent title={user?.displayName || ''} fontSize="1.5em" />
                <SpaceComponent height={4} />
                <TextComponent text={user?.email || ''} fontSize="1.3em" />
            </ColumnComponent>
        </RowComponent>
    );

    return (
        <div className="main-layout">
            {/* Header ------------------------------------------------------------------------------ */}
            <header className="headerContainer">
                <div className="iconMenuContainer">
                    <HambergerMenu className="iconMenu" color="#586380" size="42" />
                </div>
                <SearchBoxComponent value={searchValue} onChange={setSearchValue} />

                <RowComponent alignItems="center" style={{}}>
                    <FloatingActionButtonComponent
                        backgroundColor="var(--primary-color)"
                        backgroundHoverColor="var(--primary-hover-color)"
                        backgroundActiveColor="var(--primary-active-color)"
                        icon={<Add size="32" color="#fff" />}
                        menuItems={menuItemsAdd}
                    />
                    <SpaceComponent width={32} />
                    <ButtonComponent
                        text="Nâng cấp lên Plus"
                        onClick={() => console.log('Thêm')}
                        backgroundColor="var(--secondary-color)"
                        backgroundHoverColor="var(--secondary-hover-color)"
                        backgroundActiveColor="var(--secondary-active-color)"
                        style={{
                            height: '40px'
                        }}
                    />
                    <SpaceComponent width={32} />

                    <FloatingActionButtonComponent
                        headerComponent={menuItemsSettingHeader}
                        icon={
                            <img
                                src={user?.photoURL || ''}
                                alt="avatar"
                                style={{
                                    objectFit: 'cover',
                                    width: '100%',
                                    borderRadius: '50%'
                                }}
                            />
                        }
                        menuItems={menuItemsSetting}
                        menuItemWidth={312}
                    />
                </RowComponent>
            </header>
            {/* Content -------------------------------------------------------------------------------------- */}
            <section className="contentContainer">
                {/* Left container - left menu -------------------------------------------------------------- */}
                <div className="leftContainer">
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
                        menuItems={menuItemsSideBar}
                    />
                </div>
                {/* Right container - main content --------------------------------------------------------- */}
                <main className="rightContainer">
                    <Outlet />
                </main>
            </section>
        </div>
    );
}

export default MainLayout;
