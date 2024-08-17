export interface MenuItemInterface {
    key: string;
    text: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    borderType?: 'top' | 'bottom' | 'top-bottom',
    onClick?: () => void;
}


