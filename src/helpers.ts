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
