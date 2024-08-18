export interface WordType {
    meanings: Meaning[];
    contexts: Context[];
    name: string;
    createAt?: number;
}

export interface Context {
    point: number;
    context: string;
    translation: string;
}

export interface Meaning {
    point: number;
    meaning: string;
}

// {
//     "meanings": [
//         {
//             "point": 1,
//             "meaning": "tham khảo ý kiến"
//         }
//     ],
//     "contexts": [
//         {
//             "context": "you should consult a financial advisor",
//             "point": "1",
//             "translation": "bạn nên tham khảo ý kiến của cố vấn tài chính"
//         }
//     ],
//     "name": "consult"
// }