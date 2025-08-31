import { getAuth } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { sha256 } from 'js-sha256';
import { useCallback, useRef, useState } from "react";
import { formatInTimeZone } from 'date-fns-tz'

const useLongPress = (
    onLongPress: any,
    onClick: any,
    { shouldPreventDefault = true, delay = 300 } = {},
    args: any
) => {
    const [longPressTriggered, setLongPressTriggered] = useState(false);
    const timeout = useRef<NodeJS.Timeout | null>(null);
    const target = useRef<EventTarget | null>(null);

    const start = useCallback(
        (event: React.MouseEvent | React.TouchEvent) => {
            if (shouldPreventDefault && event.target) {
                (event.target as HTMLElement).addEventListener("touchend", preventDefault, {
                    passive: false
                });
                target.current = event.target;
            }
            timeout.current = setTimeout(() => {
                onLongPress(args);
                setLongPressTriggered(true);
            }, delay);
        },
        [onLongPress, delay, shouldPreventDefault, args]
    );

    const clear = useCallback(
        (event: React.MouseEvent | React.TouchEvent, shouldTriggerClick = true) => {
            if (timeout.current) clearTimeout(timeout.current);
            if (shouldTriggerClick && !longPressTriggered) onClick(args);
            setLongPressTriggered(false);

            if (shouldPreventDefault && target.current) {
                (target.current as HTMLElement).removeEventListener("touchend", preventDefault);
            }
        },
        [onClick, longPressTriggered, shouldPreventDefault, args]
    );

    return {
        onMouseDown: (e: React.MouseEvent) => start(e),
        onTouchStart: (e: React.TouchEvent) => start(e),
        onMouseUp: (e: React.MouseEvent) => clear(e),
        onMouseLeave: (e: React.MouseEvent) => clear(e, false),
        onTouchEnd: (e: React.TouchEvent) => clear(e)
    };
};

const preventDefault = (event: TouchEvent) => {
    if (event.touches.length < 2 && event.preventDefault) {
        event.preventDefault();
    }
};

export default useLongPress;


export function checkPassword(password: string) {
    // Regular expression to enforce password criteria
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

    return passwordRegex.test(password);
}

export function capitalize(inputString: string) {
    return inputString.replace(/\b\w/g, char => char.toUpperCase());
}

export function capitalizeFirst(inputString: string) {
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}

export function getCurrentLocale(language?: string) {
    return (language && language.startsWith("en")) ? "en-GB" : "it-IT"
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

export interface GroupedStructure<T> {
    [key: string]: T[];
}

/**
 * Groups and sorts an array of objects by a given attribute. 
 * If the attribute is a date, the function groups the element by the calendar date exclusively (using date ISO format as key), and not by time.
 * 
 * @param {Array} data - The array of objects to process
 * @param {string} key - The attribute to group by
 * @param {boolean} [sortAsc=true] - Whether to sort ascending (true) or descending (false)
 * @returns {Object} An object with keys as attribute values and values as grouped arrays
 */
export function groupAndSort(data: any, key: string, sortAsc: boolean = true): GroupedStructure<any> {
    if (!Array.isArray(data)) return {};

    // Sort the array based on the key
    const sorted = [...data].sort((a, b) => {
        if (a[key] < b[key]) return sortAsc ? -1 : 1;
        if (a[key] > b[key]) return sortAsc ? 1 : -1;
        return 0;
    });

    // Group by the key
    return sorted.reduce((groups, item) => {
        console.log((item.date as Timestamp).toDate())
        const groupKey = (key === "date")
            ? formatInTimeZone((item[key] as Timestamp).toDate(), Intl.DateTimeFormat().resolvedOptions().timeZone, "yyyy-MM-dd") as any
            : item[key]

        if (!groups[groupKey]) {
            groups[groupKey] = [];
        }
        groups[groupKey].push(item);
        return groups;
    }, {});
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