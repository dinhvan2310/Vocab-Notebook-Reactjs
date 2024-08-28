import { CloseSquare } from 'iconsax-react';
import './ModalComponent.scss';
import SpaceComponent from '../commonComponent/Space/SpaceComponent';
import TitleComponent from '../commonComponent/Title/TitleComponent';
import RowComponent from '../commonComponent/Row/RowComponent';
import ButtonComponent from '../commonComponent/Button/ButtonComponent';

interface ModalComponentProps {
    title?: string;
    children: React.ReactNode;
    onCancel: () => void;
    onConfirm: () => void;
    open: boolean;
    style?: React.CSSProperties;
    closeOnOverlayClick?: boolean;
    width?: string;
    isCloseIcon?: boolean;
    isFooter?: boolean;
    animationType?: 'slideIn' | 'fadeIn' | 'zoomIn' | 'none';

    disableButtonConfirm?: boolean;
    buttonConfirmText?: string;
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
        width,
        isCloseIcon,
        isFooter,
        animationType = 'none',
        buttonConfirmText = 'Confirm',
        disableButtonConfirm = false
    } = props;
    return (
        <div
            className="modal-component"
            style={{
                display: open ? 'flex' : 'none'
            }}
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
                className={`modal-content ${animationType === 'none' ? '' : animationType}`}
                onClick={(event) => event.stopPropagation()}
                style={{ ...style, width: width || 'auto' }}>
                {isCloseIcon && (
                    <CloseSquare
                        className="close-icon"
                        style={{
                            position: 'absolute',
                            top: 16,
                            right: 16
                        }}
                        size={24}
                        onClick={onCancel}
                    />
                )}
                {title && <SpaceComponent height={24} />}
                {title && <TitleComponent title={title} fontSize="2.8em" fontWeight={700} />}
                {title && <SpaceComponent height={24} />}
                <div className="modal-body">{children}</div>
                {isFooter && (
                    <RowComponent className="modal-footer" justifyContent="flex-end">
                        <ButtonComponent
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
    );
}

export default ModalComponent;
