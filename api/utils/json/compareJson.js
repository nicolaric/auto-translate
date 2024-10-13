export function compareJSON(source, target) {
    let result = {};

    for (const key of Object.keys(source)) {
        const sourceValue = source[key];
        const targetValue = target[key];

        if (!(key in target)) {
            result[key] = sourceValue;
        } else if (typeof sourceValue === "object" && sourceValue !== null) {
            if (typeof targetValue !== "object" || targetValue === null) {
                result[key] = sourceValue;
            } else {
                const nestedResult = compareJSON(sourceValue, targetValue);
                if (Object.keys(nestedResult).length > 0) {
                    result[key] = nestedResult;
                }
            }
        } else if (sourceValue !== targetValue) {
            result[key] = sourceValue;
        }
    }

    return result;
}

export function mergeJSON(target, differences) {
    for (const key in differences) {
        if (typeof differences[key] === "object" && differences[key] !== null) {
            if (!target[key] || typeof target[key] !== "object") {
                target[key] = {};
            }
            mergeJSON(target[key], differences[key]);
        } else {
            target[key] = differences[key];
        }
    }

    return target;
}
