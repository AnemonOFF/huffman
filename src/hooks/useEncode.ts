import { useCallback, useState } from "react";
import {
  encode as huffmanEncode,
  getCharCodes,
  getCharsFrequency,
} from "../alg";

const useEncode = () => {
  const [isLoading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    encoded: string[];
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
      console.timeEnd("encoding");
      setResult({ encoded, codes, freq });
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
