import React from 'react';
import styles from './SearchBoxComponent.module.css';
import { SearchNormal } from 'iconsax-react';

interface SearchBoxComponentProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
}

function SearchBoxComponent(props: SearchBoxComponentProps) {
    const { placeholder = 'Tìm kiếm', value = '', onChange } = props;

    return (
        <div className={styles.container}>
            <SearchNormal className={styles.searchIcon} />
            <input
                className={styles.input}
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange && onChange(e.target.value)}
            />
        </div>
    );
}

export default SearchBoxComponent;
