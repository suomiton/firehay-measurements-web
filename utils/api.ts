
export const ApiBaseUrl = process.env.API_ENDPOINT;
export const ApiSecret = process.env.API_SECRET;

type ApiPaths = 'CurrentStatus' | `location/${string}`;

function urlAppendParams(url: string, params?: { [id: string]: string }) {
    let urlParams = `code=${ApiSecret}`;
    if(params) {
        urlParams = `${Object.keys(params).map(key => `${key}=${params[key]}`)}&${urlParams}`;
    }
    return `${url}?${urlParams}`;
}

async function getRequest<T>(relativeUrl: ApiPaths, params?: { [id: string]: string }): Promise<T> {
    const url = `${ApiBaseUrl}/${relativeUrl}`;
    const urlWithParams = urlAppendParams(url, params);
    
    const response = await fetch(urlWithParams, {
        method: 'GET'
    });

    console.log({urlWithParams, response});

    return await response.json();
}

const Api = {
    get: getRequest
};

export default Api;