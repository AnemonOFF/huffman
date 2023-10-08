import { useEffect, useMemo, useState } from "react";
import useEncode from "./hooks/useEncode";
import useDecode from "./hooks/useDecode";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
} from "@nextui-org/react";

function App() {
  const [encodingInput, setEncoding] = useState<string>("");
  const [encodedInput, setEncoded] = useState<string[]>();
  const [encodedCodes, setCodes] = useState<Map<string, string>>();
  const { encode, encoded, codes, freqs, isEncoding } = useEncode();
  const { decode, decoded, isDecoding } = useDecode();

  useEffect(() => {
    if (!encoded || !codes) return;
    setEncoded(encoded);
    setCodes(codes);
  }, [encoded, codes, freqs]);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const codeRows = useMemo(() => {
    const nodes: React.JSX.Element[] = [];
    if (codes) {
      codes.forEach((v, k) => {
        nodes.push(
          <TableRow key={k}>
            <TableCell className="text-foreground">{k}</TableCell>
            <TableCell className="text-foreground">{v}</TableCell>
            <TableCell className="text-foreground">
              {freqs?.find((f) => f[0] === k)?.[1]}
            </TableCell>
          </TableRow>
        );
      });
    }
    return nodes;
  }, [codes, freqs]);

  return (
    <div className="min-h-screen w-full flex flex-col gap-5 justify-around items-center p-5">
      <Card className="min-w-[400px] max-w-full">
        <CardBody className="flex flex-col gap-5">
          <Textarea
            label="Text for encode"
            type="text"
            onChange={(e) => setEncoding(e.target.value)}
            value={encodingInput}
            aria-label="Text for encode"
          />
          <Button
            onClick={() => encode(encodingInput)}
            color={encodingInput ? "primary" : "default"}
            disabled={!encodingInput}
            aria-label="Encode button"
          >
            Encode
          </Button>
        </CardBody>
        {(encoded !== undefined || isEncoding) && (
          <>
            <Divider />
            <CardFooter>
              {isEncoding && <Spinner />}
              {encoded && (
                <div className="flex flex-col gap-1 text-center w-full">
                  <span>Encoded result:</span>
                  <p
                    className="max-w-lg cursor-pointer break-words"
                    onClick={() => copyText(encoded.join(""))}
                  >
                    {encoded}
                  </p>
                </div>
              )}
            </CardFooter>
          </>
        )}
      </Card>

      <Table
        className="w-fit lg:fixed lg:right-5 max-h-screen"
        aria-label="Codes table"
      >
        <TableHeader>
          <TableColumn>Symbol</TableColumn>
          <TableColumn>Code</TableColumn>
          <TableColumn>Freq</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"Waiting for encode"}>{codeRows}</TableBody>
      </Table>

      <Card className="min-w-[400px] max-w-full">
        <CardBody>
          <Button
            onClick={() => decode(encodedInput!, encodedCodes!)}
            disabled={!encodedInput || !encodedCodes}
            color={encodedInput && encodedCodes ? "primary" : "default"}
            aria-label="Decode button"
          >
            Decode
          </Button>
        </CardBody>
        {(decoded !== undefined || isDecoding) && (
          <>
            <Divider />
            <CardFooter>
              {isDecoding && <Spinner />}
              {decoded && (
                <div className="flex flex-col gap-1 text-center w-full">
                  <span>Decoded result:</span>
                  <Textarea
                    readOnly
                    value={decoded}
                    onChange={() => {}}
                    className="max-w-lg break-words"
                    classNames={{ input: "cursor-pointer" }}
                    onClick={() => copyText(decoded)}
                  />
                </div>
              )}
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}

export default App;
