import { Minus } from 'iconsax-react';
import CardComponent from '../../components/CardComponent/CardComponent';
import RowComponent from '../../components/commonComponent/RowComponent';
import { MenuItemInterface } from '../../types/MenuItemType';

function FoldersLayout() {
    const menuItems: MenuItemInterface[] = [
        {
            key: 'remove',
            text: 'Remove',
            icon: <Minus fontSize={20} />,
            onClick() {
                console.log('Remove');
            }
        },
        {
            key: 'edit',
            text: 'Edit',
            icon: <Minus fontSize={20} />,
            onClick() {
                console.log('Edit');
            }
        }
    ];

    return (
        <RowComponent justifyContent="flex-start" flexWrap="wrap">
            <CardComponent
                hoverable={true}
                style={{
                    cursor: 'pointer',
                    width: '280px'
                }}
                title="Lesson 23"
                subTitle="6 thuật ngữ"
                haveFloatingButton={true}
                menuItems={menuItems}
            />
            <CardComponent
                hoverable={true}
                style={{
                    cursor: 'pointer',
                    width: '280px'
                }}
                title="Lesson 23"
                subTitle="6 thuật ngữ"
                haveFloatingButton={true}
                menuItems={menuItems}
            />
            <CardComponent
                hoverable={true}
                style={{
                    cursor: 'pointer',
                    width: '280px'
                }}
                title="Lesson 23"
                subTitle="6 thuật ngữ"
                haveFloatingButton={true}
                menuItems={menuItems}
            />
            <CardComponent
                hoverable={true}
                style={{
                    cursor: 'pointer',
                    width: '280px'
                }}
                title="Lesson 23"
                subTitle="6 thuật ngữ"
                haveFloatingButton={true}
                menuItems={menuItems}
            />
            <CardComponent
                hoverable={true}
                style={{
                    cursor: 'pointer',
                    width: '280px'
                }}
                title="Lesson 23"
                subTitle="6 thuật ngữ"
                haveFloatingButton={true}
                menuItems={menuItems}
            />
        </RowComponent>
    );
}

export default FoldersLayout;
