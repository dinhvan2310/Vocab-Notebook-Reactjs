
export async function translateText(text: string, to: string[] = ['vi'], from: string = 'en') {
    const ItsNotAKey = 'a41a65f45e0c4c58b282b42a8010ce06';
    const endpoint = 'https://api.cognitive.microsofttranslator.com';

    const path = '/translate';
    const constructedUrl = endpoint + path;

    const params = new URLSearchParams({
        'api-version': '3.0',
        'from': from,
        'to': to.join(',')
    });

    const headers = {
        'Ocp-Apim-Subscription-Key': ItsNotAKey,
        'Content-Type': 'application/json'
    };

    const body = [{
        'text': text
    }];

    try {
        const response = await fetch(`${constructedUrl}?${params}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });
        const data = await response.json();
        console.log(JSON.stringify(data, null, 4));


        // [{
        //     "translations": [{
        //         "text": "mua",
        //         "to": "vi"
        //     }]
        // }]

        return data[0].translations[0].text;
    } catch (error) {
        console.error('Error:', error);
    }
}