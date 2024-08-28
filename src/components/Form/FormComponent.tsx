import { useState } from 'react';
import FormItemType from '../../types/FormItemType';
import './FormComponent.scss';
import InputComponent from '../commonComponent/Input/InputComponent';
import SpaceComponent from '../commonComponent/Space/SpaceComponent';
import RowComponent from '../commonComponent/Row/RowComponent';
import ButtonComponent from '../commonComponent/Button/ButtonComponent';

interface FormComponentProps {
    onFinished?: () => Promise<void>;
    haveSubmitButton?: boolean;
    submitButtonText?: string;
    formItems: FormItemType[];
}

function FormComponent(props: FormComponentProps) {
    const { onFinished, formItems, haveSubmitButton, submitButtonText } = props;
    const [isButtonSubmitLoading, setIsButtonSubmitLoading] = useState(false);

    return (
        <form
            // Submit form when user press Enter
            onKeyDown={async (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    setIsButtonSubmitLoading(true);
                    await onFinished?.();
                    setIsButtonSubmitLoading(false);
                }
            }}
            className="form-component"
            onSubmit={(event) => {
                event.preventDefault();
            }}>
            {formItems.map((formItem, index) => (
                <div key={index} className="form-item">
                    <InputComponent
                        label={formItem.label}
                        onChange={formItem.onChange ?? (() => {})}
                        type={formItem.type}
                        value={formItem.value ?? ''}
                        borderType="bottom"
                        placeholder={formItem.placeholder}
                    />
                    <SpaceComponent height={12} />
                </div>
            ))}
            {haveSubmitButton && (
                <>
                    <SpaceComponent height={12} />
                    <RowComponent justifyContent="flex-end">
                        <ButtonComponent
                            isLoading={isButtonSubmitLoading}
                            text={submitButtonText || 'Submit'}
                            buttonWidth={'auto'}
                            style={{
                                padding: '12px 24px'
                            }}
                            onClick={async () => {
                                setIsButtonSubmitLoading(true);
                                await onFinished?.();
                                setIsButtonSubmitLoading(false);
                            }}
                        />
                    </RowComponent>
                </>
            )}
        </form>
    );
}

export default FormComponent;
