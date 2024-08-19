export default interface FormItemType {
    type: 'text' | 'password' | 'email' | 'switch' | 'textarea';
    label: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    errorMessage?: string;
    validate?: (value: string) => string | undefined;

    // For switch type
    onSwitchChange?: (checked: boolean) => void;
    switchColor?: string;
}

