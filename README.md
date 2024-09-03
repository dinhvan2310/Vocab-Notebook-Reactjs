export default interface FolderType {
    folderId?: string;
    userRef?: DocumentReference;
    
    name: string; // Folder name
    nameLowercase?: string; // Folder name in lowercase

    createAt: Timestamp; // Folder created date
    modifiedAt: Timestamp; // Folder modified date

    imageUrl?: string; // Folder image URL
    
    wordSets: DocumentReference[]; // Reference to WordSet document
}

- Thêm folder mới
- Sửa folder đã có
  - sửa name, imageUrl
    > nếu sửa name thì sửa nameLowercase, modifiedAt
    > nếu name và imageUrl không sửa
    > sửa imageUrl thì xoá image cũ bên storage
- Xoá folder
    > xoá folder thì xoá tất cả các wordSet trong folder đó
    > xoá folder thì xoá image bên storage


export interface WordSetType {
    wordsetId?: string;
    imageUrl?: string;
    folderRef: DocumentReference | string;
    
    name: string;
    nameLowercase?: string;


    visibility: 'public' | 'private';

    createAt: Timestamp;
    modifiedAt: Timestamp;

    words: WordType[];
}

- Thêm wordSet mới
    > cập nhập wordSet vào folder đó (thêm wordSet vào folder)
- Sửa wordSet đã có
    > sửa name, imageUrl, visibility, words
    > sửa imageUrl thì xoá image cũ bên storage
- Xoá wordSet
    > xoá wordSet thì xoá image bên storage
    > xoá wordSet thì xoá wordSet trong folder đó