import { useCallback, useState } from "react";
import { decodeString as huffmanDecode } from "../alg";
import { deserialize } from "../misc/serializer";

const useDecode = () => {
  const [isLoading, setLoading] = useState(false);
  const [result, setResult] = useState<string>();

  const decode = useCallback((decodingInput: string) => {
    const f = async () => {
      setLoading(true);
      console.time("decoding");
      const { codes, encoded, padding } = deserialize(decodingInput);
      let decodedBinaryString = "";
      for (let i = 0; i < encoded.length; i++) {
        const currNum = encoded.charCodeAt(i);
        let currBinary = "";
        for (let j = 7; j >= 0; j--) {
          const foo = currNum >> j;
          currBinary += foo & 1;
        }
        decodedBinaryString += currBinary;
      }
      if (padding !== 0)
        decodedBinaryString = decodedBinaryString.slice(0, -padding);
      const decoded = huffmanDecode(decodedBinaryString, codes);
      console.timeEnd("decoding");
      setLoading(false);
      setResult(decoded);
    };

    f();
  }, []);

  return {
    isDecoding: isLoading,
    decoded: result,
    decode: decode,
  };
};

export default useDecode;
