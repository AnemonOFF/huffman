import { useCallback, useState } from "react";
import { decode as huffmanDecode } from "../alg";

const useDecode = () => {
  const [isLoading, setLoading] = useState(false);
  const [result, setResult] = useState<string>();

  const decode = useCallback(
    (encoded: string[], codes: Map<string, string>) => {
      const f = async () => {
        setLoading(true);
        console.time("decoding");
        const decoded = huffmanDecode(encoded, codes);
        console.timeEnd("decoding");
        setLoading(false);
        setResult(decoded);
      };

      f();
    },
    []
  );

  return {
    isDecoding: isLoading,
    decoded: result,
    decode: decode,
  };
};

export default useDecode;
