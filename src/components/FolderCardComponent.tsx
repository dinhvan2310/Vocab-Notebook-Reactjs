import React from 'react';
import styles from './FolderCardComponent.module.css';
import TitleComponent from './comonComponent/TitleComponent';
import SpaceComponent from './comonComponent/SpaceComponent';

interface FolderCardComponentProps {
    title: string;
    userImageUrl: string;
    numberOfItems: number;
    onClick: () => void;
}
function FolderCardComponent(props: FolderCardComponentProps) {
    const { title, numberOfItems, onClick, userImageUrl } = props;

    return (
        <div className={styles.container} onClick={onClick}>
            <TitleComponent title={title} />
            <div className={styles.numberOfItemsContainer}>
                <div className={styles.numberOfItems}>{numberOfItems} items</div>
                <SpaceComponent fullWidth={true} />
            </div>

            <div className={styles.footerContainer}>
                <img src={userImageUrl} alt="user" className={styles.icon} />
            </div>
        </div>
    );
}

export default FolderCardComponent;
