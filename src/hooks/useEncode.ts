import { useCallback, useState } from "react";
import {
  encode as huffmanEncode,
  getCharCodes,
  getCharsFrequency,
} from "../alg";
import { serialize } from "../misc/serializer";

const useEncode = () => {
  const [isLoading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    encoded: string;
    codes: Map<string, string>;
    freq: [string, number][];
  }>();

  const encode = useCallback((text: string) => {
    const f = async () => {
      setLoading(true);
      console.time("encoding");
      const codes = getCharCodes(text);
      const freq = getCharsFrequency(text);
      const encoded = huffmanEncode(text, codes);
      const padding = (8 - (encoded.join("").length % 8)) % 8;
      const binaryString = encoded.join("") + Array(padding).fill("0").join("");
      let encodedData = "";
      for (let i = 0; i < binaryString.length; ) {
        let cur = 0;
        for (let j = 0; j < 8; j++, i++) {
          cur *= 2;
          cur +=
            (binaryString[i] as unknown as number) - ("0" as unknown as number);
        }
        encodedData += String.fromCharCode(cur);
      }
      const fileString = serialize(codes, padding, encodedData);
      console.timeEnd("encoding");
      setResult({ encoded: fileString, codes, freq });
      setLoading(false);
    };

    f();
  }, []);

  return {
    isEncoding: isLoading,
    encoded: result?.encoded,
    codes: result?.codes,
    encode: encode,
    freqs: result?.freq,
  };
};

export default useEncode;
