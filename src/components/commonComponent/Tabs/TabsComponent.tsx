import TabItemType from '../../../types/TabItemType';
import RowComponent from '../Row/RowComponent';
import TitleComponent from '../Title/TitleComponent';
import './TabsComponent.scss';

interface TabsComponentProps {
    items: TabItemType[];
    activeKey: string;
    activeColor?: string;
    onChange: (activeKey: string) => void;
    centered?: boolean;
}

function TabsComponent(props: TabsComponentProps) {
    const { items, activeKey, onChange, centered, activeColor = 'var(--primary-color)' } = props;

    return (
        <div
            className="tab-container"
            style={{
                justifyContent: centered ? 'center' : 'flex-start',
                position: 'relative'
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
                                fontSize="2em"
                                title={item.label}
                                titleStyle={{
                                    color: isActive ? activeColor : 'var(--text-color)'
                                }}
                            />
                        </RowComponent>
                        {isActive && <div className="tab-content">{item.children}</div>}
                    </div>
                );
            })}
        </div>
    );
}

export default TabsComponent;
