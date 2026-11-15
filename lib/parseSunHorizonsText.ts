export function parseSunHorizonsText(text: string) {
  const block = text.split("$$SOE")[1].split("$$EOE")[0].trim();
  return block.split("\n").map((line) => {
    const cols = line.trim().split(/\s+/);
    const n = cols.length;
    const flags = cols.slice(2, n - 2).join("");
    return {
      date: cols[0],
      time: cols[1],
      azimuth: parseFloat(cols[n - 2]),
      elevation: parseFloat(cols[n - 1]),
      sunFlag: flags.includes("*"),
      earthFlag: flags.includes("i"),
    };
  });
}