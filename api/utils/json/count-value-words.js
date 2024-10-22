export function countValueWords(obj) {
  let count = 0;
  for (const key in obj) {
    if (typeof obj[key] === "object") {
      count += countValueWords(obj[key]);
    } else {
      count += obj[key].split(" ").length;
    }
  }

  return count;
}
