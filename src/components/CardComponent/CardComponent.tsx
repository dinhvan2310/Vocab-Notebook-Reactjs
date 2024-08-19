import { ReactNode, useRef } from 'react';
import './CardComponent.scss';
import TitleComponent from '../commonComponent/TitleComponent';
import TextComponent from '../commonComponent/TextComponent';
import SpaceComponent from '../commonComponent/SpaceComponent';
import { MenuItemInterface } from '../../types/MenuItemType';
import RowComponent from '../commonComponent/RowComponent';
import ColumnComponent from '../commonComponent/ColumnComponent';
import FloatingActionButtonComponent from '../FloatingActionButton/FloatingActionButtonComponent';
import { More } from 'iconsax-react';

interface CardComponentProps {
    hoverable?: boolean;
    style?: React.CSSProperties;
    onClick?: () => void;
    imageSrc?: string;
    children?: ReactNode;
    backGroundColor?: string;

    title?: string;
    subTitle?: string;

    haveFloatingButton?: boolean;
    menuItems?: MenuItemInterface[];
    className?: string;

    createAt?: string;
    visibliity?: 'public' | 'private' | undefined;
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
        visibliity = undefined,
        haveFloatingButton,
        createAt
    } = props;
    const cardContainerClass = hoverable ? 'card-container hoverable' : 'card-container';

    const cardRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={cardRef}
            className={`${cardContainerClass} ${className}`}
            style={{
                ...style,
                backgroundColor: backGroundColor ? backGroundColor : 'var(--bg-color)'
            }}
            onClick={onClick}>
            {imageSrc && (
                <img
                    style={{
                        height: style?.width ? style.width : '100%'
                    }}
                    className="card-img"
                    src={imageSrc}
                    alt="card"
                />
            )}
            <div
                className="card-body"
                style={{
                    paddingLeft: imageSrc ? '1.2em' : '2em',
                    paddingRight: imageSrc ? '0.6em' : '1em',
                    paddingTop: imageSrc ? '1.2em' : '2em',
                    paddingBottom: imageSrc ? '1.2em' : '2em'
                }}>
                {children ? (
                    children
                ) : (
                    <RowComponent justifyContent="space-between">
                        <ColumnComponent alignItems="flex-start">
                            <RowComponent alignItems="center" justifyContent="flex-start">
                                <TitleComponent
                                    title={title ?? ''}
                                    fontSize="2em"
                                    fontWeight={600}
                                />
                                <SpaceComponent width={12} />
                                {visibliity && (
                                    <TextComponent
                                        text={visibliity === 'public' ? 'Public' : 'Private'}
                                        fontSize="1em"
                                        style={{
                                            borderRadius: '12px',
                                            padding: '2px 6px',
                                            border: '1px solid var(--secondary-text-color)'
                                        }}
                                    />
                                )}
                            </RowComponent>
                            <SpaceComponent height={4} />
                            <TextComponent text={subTitle ?? ''} fontSize="1.2em" />
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
                                    menuItemsPosition="center"
                                />
                            )}
                            <TextComponent text={createAt ?? ''} fontSize="1.2em" />
                        </ColumnComponent>
                    </RowComponent>
                )}
            </div>
        </div>
    );
}

export default CardComponent;
