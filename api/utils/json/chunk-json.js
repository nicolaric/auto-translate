import { mergeJSON } from "./compareJson.js";

export function chunkJson(jsonObj, chunkSize, prefix = "") {
  const objLength = jsonObj.length;

  if (objLength <= chunkSize) {
    return [jsonObj];
  }

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

    console.log("chunkedJsonObjects", chunkedJsonObjects);
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
