import { sha256 } from 'js-sha256';
import axios from 'axios';

export function checkPassword(password) {
    // Regular expression to enforce password criteria
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

    return passwordRegex.test(password);
}

export function capitalize(inputString) {
    return inputString.replace(/\b\w/g, char => char.toUpperCase());
}

export const encryptPassword = (password) => {
    return sha256(password);
}

const baseUrl = 'https://currence-server.web.app';

const API_ENDPOINTS = {
    Login: {
        method: '',
        url: baseUrl + '',
    }
};

function replaceParameters(url, parameters) {
    if (url.includes('{')) {
        const urlParameters = url.match(/\{(\w+)\}/g);
        if (urlParameters) {
            urlParameters.forEach((parameterToReplace) => {
                const paramName = parameterToReplace.slice(1, -1);
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

export async function makeAPIRequest(operation, serializedData, parameters, isProtected) {
    if (!API_ENDPOINTS[operation]) {
        return {
            code: 0
        };
    }

    const method = API_ENDPOINTS[operation].method;
    var url = API_ENDPOINTS[operation].url;

    if (parameters != null) {
        url = replaceParameters(url, parameters);
        if (url === null) {
            return { code: 0 };
        }

        if (Object.keys(parameters).length > 0) {
            url += '?';
            url += new URLSearchParams(parameters).toString();
        }
    }

    try {
        var response;

        if (serializedData != null) {
            response = await axios({
                method: method,
                url: url,
                data: serializedData,
                headers: (isProtected) ? { Authorization: `Bearer ${sessionStorage.getItem('token')}` } : undefined,
            });
        }
        else {
            response = await axios({
                method: method,
                url: url,
                headers: (isProtected) ? { Authorization: `Bearer ${sessionStorage.getItem('token')}` } : undefined,
            });
        }

        return {
            code: response.status,
            body: response.data
        };
    }
    catch (error) {
        if (error.response) {
            return {
                code: error.response.status,
                body: error.response.data
            };
        }
        else {
            console.error('No response to report', error);
            return {
                code: 0,
                body: 'No response to report',
            };
        }
    }
}