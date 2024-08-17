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
        subTitle,
        menuItems,
        haveFloatingButton
    } = props;
    const cardContainerClass = hoverable ? 'card-container hoverable' : 'card-container';

    const cardRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={cardRef}
            className={cardContainerClass}
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
                        <ColumnComponent>
                            <TitleComponent title={title ?? ''} fontSize="1.4em" />
                            <SpaceComponent height={4} />
                            <TextComponent text={subTitle ?? ''} fontSize="1.2em" />
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
                                menuItemsPosition="center"
                            />
                        )}
                    </RowComponent>
                )}
            </div>
        </div>
    );
}

export default CardComponent;
