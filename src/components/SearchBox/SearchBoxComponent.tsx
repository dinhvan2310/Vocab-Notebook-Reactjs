import { SearchNormal } from 'iconsax-react';
import './SearchBoxComponent.scss';
import { useState } from 'react';

interface SearchBoxComponentProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    searchWidth?: number | string;
    backGroundColor?: string;
    borderRadius?: number;
    borderColor?: string;
    borderType?: 'top' | 'bottom' | 'all' | 'none';
    borderColorOnFocus?: string;
    style?: React.CSSProperties;
    className?: string;
}

function SearchBoxComponent(props: SearchBoxComponentProps) {
    const {
        placeholder = 'Tìm kiếm',
        value = '',
        onChange,
        searchWidth = 600,
        backGroundColor = 'var(--bg-active-color)',
        borderColor = 'var(--bg-active-color)',
        borderType = 'all',
        borderColorOnFocus = 'var(--border-color)',
        style,
        borderRadius = 8,
        className = ''
    } = props;

    const [isFocus, setIsFocus] = useState(false);

    return (
        <div
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            className={`search-box ${className}`}
            style={{
                width: searchWidth,
                backgroundColor: backGroundColor,
                borderTop:
                    borderType === 'top'
                        ? `1px solid`
                        : borderType === 'all'
                        ? `1px solid`
                        : 'none',
                borderBottom:
                    borderType === 'bottom'
                        ? `1px solid`
                        : borderType === 'all'
                        ? `1px solid`
                        : 'none',
                borderLeft: borderType === 'all' ? `1px solid` : 'none',
                borderRight: borderType === 'all' ? `1px solid` : 'none',
                borderRadius: borderRadius,
                transition: 'border-color 0.3s',
                borderColor: isFocus ? borderColorOnFocus : borderColor,
                ...style
            }}>
            <div className="search-icon-container">
                <SearchNormal className="searchIcon" />
            </div>
            <input
                className="input"
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange && onChange(e.target.value)}
            />
        </div>
    );
}

export default SearchBoxComponent;
