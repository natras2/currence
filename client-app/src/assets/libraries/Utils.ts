import { getAuth } from 'firebase/auth';
import { sha256 } from 'js-sha256';

export function checkPassword(password: string) {
    // Regular expression to enforce password criteria
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

    return passwordRegex.test(password);
}

export function capitalize(inputString: string) {
    return inputString.replace(/\b\w/g, char => char.toUpperCase());
}

export function titleCase(string: string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

export const encryptPassword = (password: string) => {
    return sha256(password);
}

export function currencyFormat(num: number) {
    return '€ ' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,').replace(",", "-").replace(".", ",").replace("-", ".");
}


const baseUrl = (!!process.env.REACT_APP_IS_LOCALE) ? 'http://localhost:8080/v1' : 'https://currence-dzfvg2chhch0h3hd.northeurope-01.azurewebsites.net/v1';

const API_ENDPOINTS = {
    Authenticate: {
        method: 'POST',
        url: baseUrl + '/auth/authenticate',
    }
};

export interface ApiResponse {
    code: number;
    body?: any;
}

function replaceParameters(url: string, parameters: any) {
    if (url.includes('{')) {
        const urlParameters = url.match(/\{(\w+)\}/g);
        if (urlParameters) {
            urlParameters.forEach((parameterToReplace) => {
                const paramName: string = parameterToReplace.slice(1, -1);
                if (parameters[paramName]) {
                    url = url.replace(parameterToReplace, parameters[paramName]);
                    delete parameters[paramName];
                }
                else {
                    return null;
                }
            });
        }

        if (!url.includes('{'))
            return url;

        return null;
    }
    else {
        return url;
    }
}

export async function makeAPIRequest(operation: string, serializedData: any, parameters: any, isProtected: boolean) {
    const auth = getAuth();

    if (!(operation in API_ENDPOINTS)) {
        return {
            code: 0,
            body: 'The requested operation is not managed by this script'
        } as ApiResponse;
    }

    const operationTyped = operation as keyof typeof API_ENDPOINTS;

    const method = API_ENDPOINTS[operationTyped].method;
    var url = API_ENDPOINTS[operationTyped].url;

    if (parameters != null) {
        var replacementResult = replaceParameters(url, parameters);
        if (replacementResult === null) {
            return {
                code: 0,
                body: 'Missing parameters for the requested operation'
            } as ApiResponse;
        }
        else {
            url = replacementResult;
        }

        if (Object.keys(parameters).length > 0) {
            url += '?';
            url += new URLSearchParams(parameters).toString();
        }
    }

    try {
        var response;
        const user = auth.currentUser;

        if (!user)
            throw ("No authenticated user");

        if (serializedData != null) {
            response = await fetch(url, {
                method: method,
                body: serializedData,
                headers: (isProtected) ? { Authorization: `Bearer ${await user.getIdToken()}` } : undefined,
            });
        }
        else {
            response = await fetch(url, {
                method: method,
                headers: (isProtected) ? { Authorization: `Bearer ${await user.getIdToken()}` } : undefined,
            });
        }

        return {
            code: response.status,
            body: response.body
        } as ApiResponse;
    }
    catch (error: any) {
        if (error.response) {
            return {
                code: error.response.status,
                body: error.response.data
            } as ApiResponse;
        }
        else {
            console.error('Error while fetching data. ', error);
            return {
                code: 500,
                body: 'Error while fetching data.',
            } as ApiResponse;
        }
    }
}