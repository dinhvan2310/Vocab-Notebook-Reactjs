import { useState } from 'react';
import FormItemType from '../../types/FormItemType';
import ButtonComponent from '../commonComponent/ButtonComponent';
import InputComponent from '../commonComponent/InputComponent';
import RowComponent from '../commonComponent/RowComponent';
import SpaceComponent from '../commonComponent/SpaceComponent';
import './FormComponent.scss';

interface FormComponentProps {
    onFinished: () => Promise<void>;
    haveSubmitButton?: boolean;
    submitButtonText?: string;
    formItems: FormItemType[];
}

function FormComponent(props: FormComponentProps) {
    const { onFinished, formItems, haveSubmitButton, submitButtonText } = props;
    const [isButtonSubmitLoading, setIsButtonSubmitLoading] = useState(false);
    return (
        <form
            className="form-component"
            onSubmit={(event) => {
                event.preventDefault();
            }}>
            {formItems.map((formItem, index) => (
                <div key={index} className="form-item">
                    <InputComponent
                        label={formItem.label}
                        onSwitchChange={formItem.onSwitchChange}
                        onChange={formItem.onChange}
                        type={formItem.type}
                        value={formItem.value}
                        paddingVertical={8}
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
                                await onFinished();
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
