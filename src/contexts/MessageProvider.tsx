import { createContext, useMemo, useState } from 'react';
import Message, { MessageTypes } from '../components/Message/Message';

interface MessageProviderProps {
    children: React.ReactNode;
}

interface MessageContextProps {
    setMessage: (message: string) => void;
    setOpen: (open: boolean) => void;
    setType: (type: MessageTypes) => void;
    setTimeout: (timeout: number) => void;
}

export const MessageContext = createContext<MessageContextProps | null>(null);

function MessageProvider(props: MessageProviderProps) {
    const { children } = props;

    const [message, setMessage] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [type, setType] = useState<MessageTypes>('success');
    const [timeout, setTimeout] = useState<number>(5000);

    const value = useMemo(() => {
        return {
            setMessage,
            setOpen,
            setType,
            setTimeout
        };
    }, []);

    return (
        <MessageContext.Provider value={value}>
            <Message
                type={type}
                message={message}
                timeout={timeout}
                open={open}
                setOpen={setOpen}
            />
            {children}
        </MessageContext.Provider>
    );
}

export default MessageProvider;
