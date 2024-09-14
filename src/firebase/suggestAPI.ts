import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "./firebase-config";
import { MeaningGlobalType } from "../types/WordGlobalType";
import { convertToWordType, getWordDefinition } from "../APIs/freeDictionary/freeDictionary";

export const suggestWord = async (text: string) => {

    if (text.trim() === '') {
        return []
    }
    // gợi ý 3 từ hoàn chỉnh
    const q = query(collection(db, 'wordGlobals'),
        where('name', '>=', text.trim().toLowerCase()),
        where('name', '<=', text.trim().toLowerCase() + '\uf8ff'),
        limit(3)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return []
        
    } else {
        // get 3 từ từ database community
        const data = querySnapshot.docs.map(doc => doc.data().name);
        if(data.length === 1) {
            if (text.trim().toLowerCase() === data[0]) {
                return []
            }
        }
        return data;
    }


}

export const suggestDefinition = async (word: string, text: string, type: 'dictionary' | 'community' = 'community', limit: number = 3) => {



    if (type === 'dictionary') {
        const definitions = await getWordDefinition(word);
        if (!definitions) {
            return []
        }
        return convertToWordType(definitions, 3, 0).map((item) => {
            return item.meaning;
        });
    }


    try {
        const q = query(collection(db, 'wordGlobals'),
        where('name', '==', word.trim().toLowerCase()),
    );
    const wordGlobal = (await getDocs(q)).docs.map(doc => doc.data())[0];
    const meanings: MeaningGlobalType[] = wordGlobal.meanings.filter((meaning: MeaningGlobalType) => {
        return meaning.meaning.toLowerCase().trim().includes(text.trim().toLowerCase())
    });
    
    // get 3 meaning dựa theo lastUsedAt và usageCount
    if (meanings.length === 0) {
        return []
    } else {
        meanings.sort((a, b) => {
            // sort by number of usage and last used
            if (a.usageCount > b.usageCount) {
                return -1;
            } else if (a.usageCount < b.usageCount) {
                return 1;
            } else {
                if (a.lastUsedAt > b.lastUsedAt) {
                    return -1;
                } else if (a.lastUsedAt < b.lastUsedAt) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });

        return meanings.slice(0, limit).map((item) => {
            return item.meaning;
        });
    }
    }
    catch (error) {
        return []
    }
    

}

export const suggestContext = async (word: string, text: string, exclude: string[] , limit: number = 3) => {
    
    
        // gợi ý 3 từ hoàn chỉnh
        const q = query(collection(db, 'wordGlobals'),
            where('name', '==', word.trim().toLowerCase()),
        );
        const wordGlobal = (await getDocs(q)).docs.map(doc => doc.data())[0];
        let contexts: string[] = wordGlobal?.contexts ?? [];
        if (text.trim() !== '') {
            contexts = wordGlobal.contexts.filter((context: string) => {
                return context.toLowerCase().trim().includes(text.trim().toLowerCase())
            });
        }
        
        const wordDictionary = convertToWordType(await getWordDefinition(word) ?? [], 0, -1)
        const dictionaryContexts = wordDictionary.flatMap((item) => {
            return item.contexts;
        });

        // random limit context từ wordGlobal và wordDictionary
        let allContexts = [...contexts, ...dictionaryContexts];
        allContexts = allContexts.filter((context: string) => {
            return !exclude.includes(context);
        });
        if (allContexts.length === 0) {
            return []
        } else {
            allContexts = allContexts.sort(() => Math.random() - 0.5);
            return allContexts.slice(0, limit);
        }
}