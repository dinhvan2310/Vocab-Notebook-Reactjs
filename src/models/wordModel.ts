export interface Word {
    meanings: Meaning[];
    contexts: Context[];
    name: string;
}

export interface Context {
    context: string;
    point: string;
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