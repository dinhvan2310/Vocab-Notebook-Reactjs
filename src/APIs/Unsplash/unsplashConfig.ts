import { createApi } from "unsplash-js";

const unsplash = createApi({
    accessKey: 'q860coMAIr7NoWqSA-zXNfwhSX8t6HP2eg-B9nwcEt4',
    // `fetch` options to be sent with every request
    headers: { 'X-Custom-Header': 'foo' }
});

export default unsplash;