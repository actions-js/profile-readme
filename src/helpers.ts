export function capitalize(str: string) {
  str = str.replace(/_+/g, " ");
  str = str.replace(/\s+/g, " ");
  if (str.includes(" ")) {
    return str
      .split(" ")
      .reduce((a, b) => {
        return a + " " + capitalize(b);
      }, "")
      .trim();
  }

  return (str.slice(0, 1).toUpperCase() + str.slice(1)).trim();
}

export function pickRandomItems<T>(items: T[], limit = 2): T[] {
  if (limit < 1) throw new Error("Pick atleast 1 item");
  if (items.length < limit) {
    throw new Error("You can't pick more items than there are in the array.");
  }
  const indices: number[] = [];
  while (indices.length < limit) {
    const index = Math.floor(Math.random() * items.length);
    if (indices.indexOf(index) !== -1) continue;
    indices.push(index);
  }
  return indices.map((idx) => items[idx]);
}
