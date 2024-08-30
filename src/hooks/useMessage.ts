import { useContext } from 'react';
import { MessageTypes } from '../components/Message/Message';
import { MessageContext } from '../contexts/MessageProvider';

export const useMessage = (
) => {
    const context = useContext(MessageContext);

    
    if (!context) {
        throw new Error('useMessage must be used within a MessageProvider');
    }


    return (type: MessageTypes, message: string, timeout?: number) => {
        context.setMessage(message);
        context.setType(type);
        context.setTimeout(timeout || 3000);
        context.setOpen(true);
    }
};
