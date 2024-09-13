import { CloseSquare } from 'iconsax-react';
import ButtonComponent from '../commonComponent/Button/ButtonComponent';
import RowComponent from '../commonComponent/Row/RowComponent';
import TitleComponent from '../commonComponent/Title/TitleComponent';
import './ModalComponent.scss';

interface ModalComponentProps {
    title?: string;
    children: React.ReactNode;
    onCancel: () => void;
    onConfirm: () => void;
    open: boolean;
    style?: React.CSSProperties;
    closeOnOverlayClick?: boolean;
    isCloseIcon?: boolean;
    isFooter?: boolean;
    animationType?: 'slideIn' | 'fadeIn' | 'zoomIn' | 'none';

    disableButtonConfirm?: boolean;
    buttonConfirmText?: string;
    buttonComfirmLoading?: boolean;
    className?: string;
}

function ModalComponent(props: ModalComponentProps) {
    const {
        title,
        children,
        onCancel,
        onConfirm,
        open,
        style,
        closeOnOverlayClick,
        isCloseIcon,
        isFooter,
        animationType = 'none',
        buttonConfirmText = 'Confirm',
        disableButtonConfirm = false,
        buttonComfirmLoading = false,
        className = ''
    } = props;
    return (
        open && (
            <div
                className="modal-component"
                style={{}}
                onClick={() => {
                    if (closeOnOverlayClick) {
                        onCancel();
                    }
                    // if (closeOnOverlayClick) {
                    //     switch (animationType) {
                    //         case 'fadeIn': {
                    //             onCancel();
                    //             modalRef.current?.classList.remove('fadeIn');
                    //             modalRef.current?.classList.add('fadeOut');
                    //             break;
                    //         }
                    //     }
                    // }
                }}>
                <div
                    className={`modal-content
                        display: flex; flex-col
                    ${animationType === 'none' ? '' : animationType} ${className}`}
                    onClick={(event) => event.stopPropagation()}
                    style={{ ...style }}>
                    {isCloseIcon && (
                        <RowComponent
                            justifyContent="space-between"
                            className="mb-3"
                            style={{
                                height: 36
                            }}>
                            {title && (
                                <TitleComponent title={title} fontSize="2.8em" fontWeight={600} />
                            )}
                            <CloseSquare
                                className="close-icon"
                                style={
                                    {
                                        // position: 'absolute',
                                        // top: 16,
                                        // right: 16
                                    }
                                }
                                size={24}
                                onClick={onCancel}
                            />
                        </RowComponent>
                    )}

                    <div
                        className="modal-body overflow-y-auto
                        h-[calc(100%-36px)]
                    ">
                        {children}
                    </div>
                    {isFooter && (
                        <RowComponent className="modal-footer" justifyContent="flex-end">
                            <ButtonComponent
                                isLoading={buttonComfirmLoading}
                                disabled={disableButtonConfirm}
                                text={buttonConfirmText}
                                onClick={onConfirm}
                                style={{
                                    padding: '12px 24px'
                                }}
                            />
                        </RowComponent>
                    )}
                </div>
            </div>
        )
    );
}

export default ModalComponent;
