import { Add, DocumentUpload, GallerySlash, NoteRemove } from 'iconsax-react';
import { ReactNode, useState } from 'react';
import TextComponent from '../commonComponent/Text/TextComponent';

interface UploadProps {
    name?: string;
    type: 'picture' | 'file';
    action: (file: File | null) => void;

    disabled?: boolean;
    render?: (file: File | null) => ReactNode;
    accept?: string;
    style?: React.CSSProperties;
}
function Upload(props: UploadProps) {
    const {
        type = 'picture',
        name = type === 'picture' ? 'Upload' : 'Click to upload',
        action,
        disabled = false,
        render = (file: File | null) => {
            switch (type) {
                case 'picture':
                    return file ? (
                        <div
                            className="group"
                            onClick={(e) => {
                                setFile(null);
                                action(null);
                                e.preventDefault();
                            }}>
                            <div className="absolute top-0 right-0  w-full h-full rounded-lg ">
                                <img
                                    src={URL.createObjectURL(file)}
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
                        <div className="flex flex-col items-center">
                            <Add size={20} />
                            <TextComponent text={name || 'Upload'} />
                        </div>
                    );

                case 'file':
                    return (
                        <div className="flex flex-col items-center">
                            <DocumentUpload size={20} />
                            <TextComponent text={name || 'Upload'} />
                        </div>
                    );
            }
        },
        accept,
        style
    } = props;

    const [file, setFile] = useState<File | null>(null);

    if (type === 'file') {
        return (
            <div className="">
                <div
                    className="flex border-[1px] inline-flex px-4 py-2 rounded-lg border-borderLight dark:border-borderDark
                  hover:border-primaryLight-hover dark:hover:border-primaryDark-hover 

                ">
                    <input
                        type="file"
                        className="w-0 h-0"
                        id="inputFile"
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
                    <label htmlFor="inputFile" className="flex flex-row cursor-pointer">
                        <DocumentUpload size={18} className="mr-4" />
                        <TextComponent text={name} />
                    </label>
                </div>
                <div className="flex flex-row items-center mt-4">
                    <TextComponent text={file?.name || 'No file selected'} />
                    {file && (
                        <div
                            className="cursor-pointer ml-2"
                            onClick={() => {
                                setFile(null);
                                action(null);
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
            className={`border-dashed  border-borderLight dark:border-borderDark inline-flex 
      border-[1px]  w-[100px] h-[100px] justify-center items-center  rounded-lg
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
                id="input"
                className="h-0 w-0"
                onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    const file = target.files?.[0];
                    if (file) {
                        setFile(file);
                        action(file);
                    }
                }}
            />
            <label htmlFor="input" title="Upload" className="cursor-pointer w-full h-full">
                <div className="flex flex-col items-center justify-center  w-full h-full">
                    {render(file || null)}
                </div>
            </label>
        </div>
    );
}

export default Upload;
