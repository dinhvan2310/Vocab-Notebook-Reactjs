import { SearchNormal } from 'iconsax-react';
import './SearchBoxComponent.scss';

interface SearchBoxComponentProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
}

function SearchBoxComponent(props: SearchBoxComponentProps) {
    const { placeholder = 'Tìm kiếm', value = '', onChange } = props;

    return (
        <div className="search-box">
            <SearchNormal className="searchIcon" />
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
