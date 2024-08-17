export default interface TabItemType {
    key: string;
    label: string;
    disabled?: boolean;
    icon?: React.ReactNode;
    children?: React.ReactNode;
}