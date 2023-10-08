export * from "./huffman";
export type * from "./types";

export function encode(
  text: string,
  codes: Map<string, string>
): Array<string> {
  return Array.from(text).map((c) => codes.get(c)!);
}

export function decode(
  encodedText: Array<string>,
  codes: Map<string, string>
): string {
  const reversedCodes = reverseMap(codes);
  const result = ["", ...encodedText].reduce(
    (pre, cur) => pre + reversedCodes.get(cur)
  );

  return result;
}

function reverseMap<K, V>(map: Map<K, V>) {
  const result = new Map<V, K>();
  map.forEach((v, k) => {
    result.set(v, k);
  });
  return result;
}
