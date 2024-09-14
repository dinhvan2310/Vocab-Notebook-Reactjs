import { Add, DocumentUpload, GallerySlash, NoteRemove } from 'iconsax-react';
import { ReactNode, useEffect, useState } from 'react';
import ColumnComponent from '../commonComponent/Column/ColumnComponent';
import InputComponent from '../commonComponent/Input/InputComponent';
import RowComponent from '../commonComponent/Row/RowComponent';
import TextComponent from '../commonComponent/Text/TextComponent';

interface UploadProps {
    name?: string;
    type: 'picture' | 'file';
    action: (file: File | undefined | string) => void;
    onRemove?: () => void;

    disabled?: boolean;
    render?: (file: File | undefined | string) => ReactNode;
    accept?: string;
    style?: React.CSSProperties;
    className?: string;

    // picture props
    defaultImage?: File | string;
}
function Upload(props: UploadProps) {
    const {
        defaultImage,
        className = '',
        type = 'picture',
        name = type === 'picture' ? 'Upload' : 'Click to upload',
        action,
        onRemove,
        disabled = false,
        render = (file: File | undefined | string) => {
            switch (type) {
                case 'picture':
                    return file ? (
                        <div
                            className="group"
                            onClick={(e) => {
                                setFile(undefined);
                                action(undefined);
                                onRemove?.();
                                e.preventDefault();

                                setShowUrl(true);
                                setUrl(undefined);
                            }}>
                            <div className="absolute top-0 right-0  w-full h-full rounded-lg ">
                                <img
                                    src={
                                        typeof file === 'string' ? file : URL.createObjectURL(file)
                                    }
                                    alt="file"
                                    className="w-full h-full rounded-lg object-cover
                            group-hover:blur-[1px] 
                            "
                                />
                            </div>
                            <div
                                className="
                        absolute cursor-pointer top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2
                        hidden group-hover:flex 
                        ">
                                <GallerySlash size={24} className="text-red-500" variant="Broken" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center" onClick={() => {}}>
                            <Add size={20} />
                            <TextComponent text={name || 'Upload'} />
                        </div>
                    );

                case 'file':
                    return (
                        <div className="flex flex-col items-center">
                            <DocumentUpload size={20} className="mb-2" />
                            <TextComponent text={name || 'Upload'} />
                        </div>
                    );
            }
        },
        accept = type === 'picture'
            ? '.png,.image,.jpg,.jpeg,.gif,.svg,.webp'
            : type === 'file'
            ? '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx'
            : '',
        style
    } = props;

    const [file, setFile] = useState<File | undefined | string>(defaultImage);
    const [showUrl, setShowUrl] = useState<boolean>(true);

    const [url, setUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (file) setShowUrl(false);
    }, [file]);

    if (type === 'file') {
        return (
            <div className={`cursor-pointer ${className ?? ''}`}>
                <div
                    className=" 
                    
                                border-dashed
                                border-[1px] 
                                inline-flex 
                                px-4 py-2
                                rounded-lg 
                                border-borderLight dark:border-borderDark
                                hover:border-primaryLight-hover dark:hover:border-primaryDark-hover 
                        
                                flex-row justify-start
                                relative
                                h-full w-full
                ">
                    <input
                        type="file"
                        className="h-full w-full absolute top-0 left-0 opacity-0 cursor-pointer"
                        accept={accept}
                        onInput={(e) => {
                            const target = e.target as HTMLInputElement;
                            const file = target.files?.[0];
                            if (file) {
                                setFile(file);
                                action(file);
                            }
                        }}
                    />
                    <label
                        className="flex flex-row  cursor-pointer
                        items-center w-full h-full justify-start
                    ">
                        <DocumentUpload size={18} className="mr-4 cursor-pointer" />
                        <TextComponent text={name} className="cursor-pointer" />
                    </label>
                </div>
                <div className="flex flex-row items-center mt-4">
                    <TextComponent
                        text={
                            typeof file === 'string' ? file : file ? file.name : 'No file selected'
                        }
                    />
                    {file && (
                        <div
                            className="ml-2 cursor-pointer"
                            onClick={() => {
                                setFile(undefined);
                                action(undefined);
                                onRemove?.();
                            }}>
                            <NoteRemove
                                size={17}
                                className="text-textLight-secondary dark:text-textDark-secondary
                            hover:text-red
                            "
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            className={`${className} border-dashed  border-borderLight dark:border-borderDark inline-flex 
      border-[1px]  w-[100px] h-[100px] justify-center items-center  rounded-lg flex-col 
          relative 
      ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
      ${
          file
              ? 'border-transparent dark:border-transparent'
              : 'hover:border-primaryLight-hover dark:hover:border-primaryDark-hover'
      }
        `}
            style={{ ...style }}>
            <input
                accept={accept}
                type="file"
                className="h-full w-full absolute top-0 left-0 opacity-0 cursor-pointer"
                onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    const file = target.files?.[0];
                    if (file) {
                        setFile(file);
                        action(file);
                        setUrl(undefined);

                        showUrl && setShowUrl(false);
                    }
                }}
            />
            <ColumnComponent>
                <label title="Upload" className="cursor-pointer w-full h-full ">
                    <div className="flex flex-col items-center justify-center  w-full h-full">
                        {render(file || defaultImage || undefined)}
                    </div>
                </label>
            </ColumnComponent>
            {showUrl && (
                <RowComponent
                    alignItems="flex-end"
                    style={{
                        position: 'absolute',
                        bottom: '0px',
                        left: '12px',
                        right: '12px',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                    <InputComponent
                        style={{
                            backdropFilter: 'blur(2px)',
                            backgroundColor: 'var(--background-color)'
                        }}
                        value={url ?? ''}
                        onChange={async (imageUrl) => {
                            setUrl(imageUrl);
                            action(imageUrl);
                            setFile(imageUrl);
                        }}
                        inputStyle={{
                            color: 'var(--secondary-text-color)'
                        }}
                        type="text"
                        borderType="bottom"
                        placeholder="Paste URL here"
                        fontSize="1em"
                    />
                </RowComponent>
            )}
        </div>
    );
}

export default Upload;
