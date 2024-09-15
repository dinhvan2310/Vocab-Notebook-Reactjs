import { More } from 'iconsax-react';
import { ReactNode } from 'react';
import { MenuItemInterface } from '../../types/MenuItemType';
import ColumnComponent from '../commonComponent/Column/ColumnComponent';
import RowComponent from '../commonComponent/Row/RowComponent';
import TextComponent from '../commonComponent/Text/TextComponent';
import TitleComponent from '../commonComponent/Title/TitleComponent';
import FloatingActionButtonComponent from '../FloatButton/FloatingActionButtonComponent';
import './CardComponent.scss';

interface CardComponentProps {
    hoverable?: boolean;
    style?: React.CSSProperties;
    onClick?: () => void;
    children?: ReactNode;
    backGroundColor?: string;

    title?: string;
    visible?: boolean;
    subTitle?: string;

    haveFloatingButton?: boolean;
    menuItems?: MenuItemInterface[];
    className?: string;

    createAt?: string;

    imageSrc?: string;
    type?: 'card-image' | 'card-text';

    icon?: ReactNode;
}

function CardComponent(props: CardComponentProps) {
    const {
        hoverable,
        style,
        onClick,
        imageSrc,
        children,
        backGroundColor,
        title,
        className,
        subTitle,
        menuItems,
        haveFloatingButton,
        visible,
        createAt,
        type = 'card-text',
        icon
    } = props;
    const cardContainerClass = hoverable ? 'card-container hoverable' : 'card-container';

    if (type === 'card-image') {
        return (
            <div
                onClick={onClick}
                className="flex flex-col 
                cursor-pointer
                rounded-lg
                group
                relative
            "
                style={style}>
                <div
                    className="
                    h-2/3
                    w-full
                    group-hover:transform group-hover:scale-105
                    transition-transform
                    rounded-lg
                    bg-bgLight dark:bg-bgDark
                    
                    group-hover:shadow-dark hover:shadow-light
                ">
                    <img
                        src={imageSrc}
                        alt="card"
                        className="
                        w-full
                        h-full
                        object-cover
                        rounded-lg
                    "
                    />
                </div>
                <div
                    className={`py-4 px-2
                        h-1/3
                        rounded-b-lg
                    bg-bgLight dark:bg-bgDark
                transition-transform
                `}>
                    <div
                        className="
                        h-full flex flex-col justify-between
                    ">
                        <div>
                            <RowComponent justifyContent="space-between">
                                <TitleComponent
                                    title={title ?? ''}
                                    fontSize="1.6em"
                                    fontWeight={600}
                                />
                                {visible !== undefined && (
                                    <div
                                        className={`
                                            rounded-full
                                        bg-primary
                                        px-2
                                        py-[1px]
                                        flex items-center
                                        border-[1px] border-primary
                                        `}>
                                        <TextComponent
                                            text={visible ? 'Public' : 'Private'}
                                            fontSize="1.2em"
                                        />
                                    </div>
                                )}
                            </RowComponent>
                            <TitleComponent title={subTitle ?? ''} fontSize="1.2em" />
                        </div>

                        <RowComponent justifyContent="space-between">
                            <ColumnComponent alignItems="flex-start">
                                <TextComponent text={createAt ?? ''} fontSize="1.2em" />
                            </ColumnComponent>
                            <ColumnComponent alignItems="flex-end">
                                {haveFloatingButton && (
                                    <FloatingActionButtonComponent
                                        menuItems={menuItems ?? []}
                                        icon={<More fontSize={20} color="var(--text-color)" />}
                                        backgroundColor="var(--bg-color)"
                                        backgroundHoverColor="var(--bg-hover-color)"
                                        backgroundActiveColor="var(--bg-active-color)"
                                        containerStyle={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%'
                                        }}
                                        menuItemsPosition="left"
                                    />
                                )}
                            </ColumnComponent>
                        </RowComponent>
                    </div>
                </div>
                {icon && (
                    <div
                        className="
                            absolute
                            top-0
                            right-2
                            bg-primary
                            rounded-full
                            p-2
                            "
                        style={{}}>
                        {icon}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            className={`${cardContainerClass} 
                    px-4 py-4 lg:px-6 lg:py-6 
                    h-full w-full
                    ${className}
                    relative
                `}
            onClick={onClick}
            style={{
                ...style,
                backgroundColor: backGroundColor ? backGroundColor : 'var(--bg-color)',
                cursor: onClick ? 'pointer' : 'default'
            }}>
            <div className="card-body h-full">
                {children ? (
                    children
                ) : (
                    <div
                        className="
                            h-full
                            w-full
                            flex flex-col
                            justify-between
                        ">
                        <RowComponent
                            alignItems="center"
                            justifyContent="space-between"
                            className="mb-2 h-full w-full">
                            <RowComponent justifyContent="space-between" className="w-full">
                                <div className="flex">
                                    <TitleComponent
                                        title={title ?? ''}
                                        fontSize="2em"
                                        fontWeight={600}
                                        className="mr-3"
                                    />
                                    {visible !== undefined && (
                                        <div
                                            className={`
                                            rounded-full
                                        bg-primary
                                        px-2
                                        py-[1px]
                                        flex items-center
                                        border-[1px] border-primary
                                        `}>
                                            <TextComponent
                                                text={visible ? 'Public' : 'Private'}
                                                fontSize="1.2em"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div
                                    className="
                            bg-primary
                            rounded-full
                            p-2
                            "
                                    style={{}}>
                                    {icon}
                                </div>
                            </RowComponent>
                        </RowComponent>
                        <RowComponent alignItems="flex-end">
                            <ColumnComponent
                                justifyContent="space-between"
                                alignItems="flex-start"
                                className="w-full">
                                <TitleComponent title={subTitle ?? ''} fontSize="1.2em" />
                                <TextComponent text={createAt ?? ''} fontSize="1.2em" />
                            </ColumnComponent>
                            {haveFloatingButton && (
                                <FloatingActionButtonComponent
                                    menuItems={menuItems ?? []}
                                    icon={<More fontSize={20} color="var(--text-color)" />}
                                    backgroundColor="var(--bg-color)"
                                    backgroundHoverColor="var(--bg-hover-color)"
                                    backgroundActiveColor="var(--bg-active-color)"
                                    containerStyle={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%'
                                    }}
                                    menuItemsPosition="left"
                                />
                            )}
                        </RowComponent>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CardComponent;
