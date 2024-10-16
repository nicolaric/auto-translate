import { mergeJSON } from "./compareJson.js";

export function chunkJson(jsonObj, chunkSize, prefix = "") {
  const objLength = jsonObj.length;

  console.log(objLength);

  if (objLength <= chunkSize) {
    return [jsonObj];
  }

  console.log(jsonObj);

  const parsedObj = JSON.parse(jsonObj);

  const keys = Object.keys(parsedObj);

  let chunkedJsonLength = 0;
  let currentChunkedJsonObject = {};

  let chunkedJsonObjects = [];

  // TODO: handle last case
  keys.forEach((key) => {
    const keyObjectLength = JSON.stringify(parsedObj[key]).length;

    if (chunkedJsonLength + keyObjectLength <= chunkSize) {
      currentChunkedJsonObject = mergeJSON(
        currentChunkedJsonObject,
        transformKeyToNestedObject(
          `${prefix}${prefix ? "." : ""}${key}`,
          parsedObj[key],
        ),
      );
      chunkedJsonLength += keyObjectLength;
      return;
    }

    if (chunkedJsonLength > 0) {
      chunkedJsonObjects.push(JSON.stringify(currentChunkedJsonObject));
      currentChunkedJsonObject = {};
      chunkedJsonLength = 0;
    }

    if (keyObjectLength < chunkSize) {
      currentChunkedJsonObject = mergeJSON(
        currentChunkedJsonObject,
        transformKeyToNestedObject(
          `${prefix}${prefix ? "." : ""}${key}`,
          parsedObj[key],
        ),
      );
      chunkedJsonLength = keyObjectLength;
      return;
    }

    chunkedJsonObjects = [
      ...chunkedJsonObjects,
      ...chunkJson(
        JSON.stringify(parsedObj[key]),
        chunkSize,
        `${prefix}${prefix ? "." : ""}${key}`,
      ),
    ];
  });

  return chunkedJsonObjects;
}

function transformKeyToNestedObject(key, value) {
  console.log(key);
  if (!key) return value;

  const keys = key.split(".");
  const result = {};
  let current = result;

  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (i === keys.length - 1) {
      current[k] = value;
    } else {
      current[k] = {};
      current = current[k];
    }
  }

  return result;
}

/*
 * {
 *   "key1": {
 *     "key2": {
 *       "key2.1": "value2.1",
 *       "key2.2": "value2.2",
 *       "key2.3": "value2.3",
 *       "key2.4": "value2.4",
 *       "key2.5": "value2.5",
 *     },
 *     "key3": {
 *       "key3.1": "value3.1",
 *       "key3.2": "value3.2",
 *       "key3.3": "value3.3",
 *       "key3.4": "value3.4",
 *       "key3.5": "value3.5",
 *     }
 *     "key4": {
 *       "key4.1": "value4.1",
 *     }
 *   }
 * }
 *
 * [{
 *   "key1.key2": {
 *      "key2.1": "value2.1",
 *      "key2.2": "value2.2",
 *      "key2.3": "value2.3",
 *      "key2.4": "value2.4",
 *      "key2.5": "value2.5",
 *   },
 *   "key1.key3": {
 *      "key3.1": "value3.1",
 *      "key3.2": "value3.2",
 *      "key3.3": "value3.3",
 *      "key3.4": "value3.4",
 *      "key3.5": "value3.5",
 * }, {
 *  "key1.key4": {
 *    "key4.1": "value4.1",
 *  }
 * }]
 *
 *
 * */
