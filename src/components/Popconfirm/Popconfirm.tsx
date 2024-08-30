import { ReactNode } from 'react';

interface PopconfirmProps {
    title: string;
    content: string;
    icon?: ReactNode;
    onConfirm: () => void;
    onCancel: () => void;

    open: boolean;
}
function Popconfirm(props: PopconfirmProps) {
    const { title, content, icon, onConfirm, onCancel, open } = props;

    return (
        <div
            className={`
            absolute
            bg-white
            border
            border-gray-200
            rounded-lg
            shadow-lg
            p-4
            z-10
            ${open ? 'block' : 'hidden'}
        `}>
            <div className="flex items-center">
                {icon}
                <div className="ml-2">
                    <div className="text-lg font-bold">{title}</div>
                    <div className="text-sm text-gray-500">{content}</div>
                </div>
            </div>
            <div className="flex justify-end mt-4">
                <button
                    onClick={onCancel}
                    className={`
                        text-sm
                        text-gray-500
                        px-4
                        py-2
                        rounded-lg
                        border
                        border-gray-300
                        hover:bg-gray-100
                        hover:border-gray-400
                        transition
                        duration-200
                    `}>
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className={`
                        text-sm
                        text-white
                        px-4
                        py-2
                        rounded-lg
                        bg-blue-500
                        hover:bg-blue-600
                        transition
                        duration-200
                        ml-2
                    `}>
                    Confirm
                </button>
            </div>
        </div>
    );
}

export default Popconfirm;
