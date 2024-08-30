import { ArchiveTick, Information } from 'iconsax-react';
import { useEffect } from 'react';
import TextComponent from '../commonComponent/Text/TextComponent';

export type MessageTypes = 'success' | 'error' | 'warning' | 'info';

interface MessageProps {
    type: MessageTypes;
    message: string;
    timeout?: number;

    open: boolean;
    setOpen: (open: boolean) => void;
}
function Message(props: MessageProps) {
    const {
        type = 'error',

        message,
        timeout = 5000,
        open,
        setOpen
    } = props;

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                setOpen(false);
            }, timeout);
        }
    });

    const icon =
        type === 'success' ? (
            <ArchiveTick size={20} className="text-green-500" />
        ) : type === 'info' ? (
            <Information size={20} className="text-gray-500" />
        ) : type === 'warning' ? (
            <Information size={20} className="text-yellow-500" />
        ) : (
            <Information size={20} className="text-red-500" />
        );
    return (
        open && (
            <div
                className={`
                    fixed
                    w-fit
                bg-bgLight dark:bg-bgDark
                rounded-lg
                px-8 py-4

                top-10
                left-1/2
                transform -translate-x-1/2

                z-50
                shadow-md
                flex
                justify-center
                items-center
                
                
                
                animate-fadeIn
                `}>
                {icon}
                <TextComponent text={message} className="ml-2" />
            </div>
        )
    );
}

export default Message;
