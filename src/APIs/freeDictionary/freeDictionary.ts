import { WordType } from "../../types/WordType";

interface License {
    name: string;
    url: string;
}

interface Phonetic {
    audio: string;
    sourceUrl?: string;
    text?: string;
    license?: License;
}

interface Definition {
    definition: string;
    synonyms: string[];
    antonyms: string[];
    example?: string;
}

interface Meaning {
    partOfSpeech: string;
    definitions: Definition[];
    synonyms: string[];
    antonyms: string[];
}

interface WordEntry {
    word: string;
    phonetics: Phonetic[];
    meanings: Meaning[];
    license: License;
    sourceUrls: string[];
    phonetic: string;
}

export function convertToWordType(
    input: WordEntry[],
    definitionLimit: number = 1,
    contextLimit: number = 3
): WordType[] {
    return input.map((item) => {
        const word: WordType = {
            name: item.word,
            meaning: "",
            contexts: [],
        };

        // Format meaning with part of speech and limited definitions
        word.meaning = item.meanings
            .map((meaning, index) => {
                const partOfSpeech = meaning.partOfSpeech;
                const definitions = meaning.definitions
                    .slice(0, definitionLimit)
                    .map((def) => `• ${def.definition}`)
                    .join("\n");
                return `${index+ 1}.\u00A0${partOfSpeech}\n${definitions}`;
            })
            .join("\n");

        // Extract examples as contexts, limited by contextLimit
        word.contexts = item.meanings
            .flatMap((meaning) =>
                meaning.definitions
                    .filter((def) => def.example)
                    .map((def) => def.example)
            )
            .filter((example): example is string => example !== undefined)
            .slice(0, contextLimit);

        // If no contexts were found, add an empty string to ensure the array is not empty
        if (word.contexts.length === 0) {
            word.contexts.push("");
        }

        return word;
    });
}

export const getWordDefinition = async (word: string) => {
    try {
        const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );
        const data = (await response.json());

        if (!Array.isArray(data)) {
            return null;
        }
        return data;
    } catch {
        return null;
    }
};
