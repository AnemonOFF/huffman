export const serialize = (
  codes: Map<string, string>,
  padding: number,
  encoded: string
) => {
  const serializedCodes: string[] = [];
  codes.forEach((v, k) => {
    const key = k
      .replaceAll("@", "@@")
      .replaceAll(";", ";;")
      .replaceAll(":", "::");
    const value = v
      .replaceAll("@", "@@")
      .replaceAll(";", ";;")
      .replaceAll(":", "::");
    serializedCodes.push(`${key}:${value}`);
  });
  return `${padding}@${serializedCodes.join(";")}@${encoded}`;
};

export const deserialize = (data: string) => {
  const paddingDividerIndex = data.indexOf("@");
  if (paddingDividerIndex == -1) throw new Error("Not valid encoded file");
  const padding = parseInt(data.substring(0, paddingDividerIndex));
  let codesDividerIndex = -1;
  let previ = paddingDividerIndex;
  while (codesDividerIndex == -1) {
    if (previ + 1 > data.length) throw new Error("Not valid encoded file");
    const curi = data.indexOf("@", previ + 1);
    if (data[curi + 1] !== "@") {
      codesDividerIndex = curi;
    } else {
      previ = curi;
    }
  }
  const codesString = data.substring(
    paddingDividerIndex + 1,
    codesDividerIndex
  );
  const codes = new Map<string, string>();

  let curKey = "";
  let curString = "";

  for (let i = 0; i < codesString.length; i++) {
    const char = codesString[i];

    if ((char === ":" || char === ";") && i + 1 !== codesString.length) {
      const nextChar = codesString[i + 1];
      if (
        (char === ":" && nextChar === ":") ||
        (char === ";" && nextChar === ";")
      ) {
        curString += char;
        i++;
        continue;
      }
    }

    if (char === ":") {
      curKey = curString;
      curString = "";
      continue;
    }

    if (char === ";") {
      codes.set(curKey, curString);
      curKey = "";
      curString = "";
      continue;
    }

    curString += char;
    if (i + 1 === codesString.length) {
      if (curKey.length === 0) throw new Error("Not valid encoded file");
      codes.set(curKey, curString);
    }
  }

  const encoded = data.substring(codesDividerIndex + 1);
  return {
    codes,
    padding,
    encoded,
  };
};
