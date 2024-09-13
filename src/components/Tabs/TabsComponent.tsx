import { useState } from 'react';
import TabItemType from '../../types/TabItemType';
import RowComponent from '../commonComponent/Row/RowComponent';
import SpaceComponent from '../commonComponent/Space/SpaceComponent';
import TitleComponent from '../commonComponent/Title/TitleComponent';
import './TabsComponent.scss';

interface TabsComponentProps {
    items: TabItemType[];
    activeKey: string;
    activeColor?: string;
    onChange: (activeKey: string) => void;
    centered?: boolean;

    style?: React.CSSProperties;
    fontSize?: string;
    type: 'horizontal' | 'vertical';

    // vertical
    verticalTabWidth?: string;
}

function TabsComponent(props: TabsComponentProps) {
    const {
        items,
        activeKey,
        onChange,
        centered,
        activeColor = 'var(--primary-color)',
        style,
        fontSize = '1.4em',
        type = 'horizontal',
        verticalTabWidth = '124px'
    } = props;

    if (type === 'horizontal') {
        return (
            <div
                className="tab-container"
                style={{
                    justifyContent: centered ? 'center' : 'flex-start',
                    position: 'relative',
                    ...style
                }}>
                {items.map((item, index) => {
                    const isActive = activeKey === item.key;
                    return (
                        <div
                            key={index}
                            className={`tab-item`}
                            style={{
                                borderBottom: isActive
                                    ? `2px solid ${activeColor}`
                                    : '2px solid transparent'
                            }}
                            onClick={() => {
                                onChange(item.key);
                            }}>
                            <RowComponent justifyContent="center">
                                {item.icon && (
                                    <div
                                        className="iconContainer"
                                        style={{
                                            color: isActive ? activeColor : 'var(--text-color)'
                                        }}>
                                        {item.icon}
                                    </div>
                                )}
                                <TitleComponent
                                    title={item.label}
                                    titleStyle={{
                                        color: isActive ? activeColor : 'var(--text-color)'
                                    }}
                                    fontSize={fontSize}
                                />
                            </RowComponent>
                            {isActive && <div className="tab-content">{item.children}</div>}
                        </div>
                    );
                })}
            </div>
        );
    } else {
        return (
            <div
                className={` bg-bgLight dark:bg-bgDark
                    transition-all
                    w-[36px] overflow-hidden
                    hover:w-[${verticalTabWidth}]
                `}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...style
                }}>
                {items.map((item, index) => {
                    const isActive = activeKey === item.key;
                    return (
                        <div
                            title={item.tooltip}
                            key={index}
                            className={`tab-item
                                hover:bg-bgLight-hover dark:hover:bg-bgDark-hover    
                                w-full h-full
                                px-2 py-1
                            `}
                            style={{
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                onChange(item.key);
                            }}>
                            <RowComponent
                                justifyContent="space-between"
                                className="
                                ">
                                {item.icon && (
                                    <div
                                        className="iconContainer flex flex-col 
                                        items-center justify-center"
                                        style={{
                                            color: isActive ? activeColor : 'var(--text-color)'
                                        }}>
                                        {item.icon}
                                        <SpaceComponent height={4} />
                                    </div>
                                )}
                                <TitleComponent
                                    title={item.label}
                                    titleStyle={{
                                        color: isActive ? activeColor : 'var(--text-color)'
                                    }}
                                    fontSize={fontSize}
                                    className="
                                    ml-2
                                    "
                                />
                            </RowComponent>
                            {isActive && <div className="tab-content">{item.children}</div>}
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default TabsComponent;
