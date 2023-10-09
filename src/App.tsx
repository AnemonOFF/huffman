import { useMemo, useState } from "react";
import useEncode from "./hooks/useEncode";
import useDecode from "./hooks/useDecode";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Input,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { download } from "./misc/download";

function App() {
  const [encodeFileName, setEncodeFileName] = useState("");
  const [encodingInput, setEncoding] = useState<string>("");
  const [decodeFileName, setDecodeFileName] = useState("");
  const [decodingInput, setDecoding] = useState<string>("");
  const { encode, encoded, codes, freqs, isEncoding } = useEncode();
  const { decode, decoded, isDecoding } = useDecode();

  const onUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setNameFunc: (name: string) => void,
    setContent: (content: string) => void
  ) => {
    if (!window.FileReader) return;
    const file = e.target.files![0];
    if (!file) return;
    setNameFunc(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.readyState != 2) return;
      if (evt.target.error) {
        alert("Error while reading file");
        return;
      }
      const fileContent = evt.target.result as string;
      setContent(fileContent);
    };
    reader.readAsText(file);
  };

  const downloadEncoded = () => {
    if (!encoded || !codes) return;
    const fileExtension = encodeFileName.substring(
      encodeFileName.lastIndexOf(".")
    );
    download(
      encodeFileName.substring(0, encodeFileName.lastIndexOf(".")) +
        "_mini" +
        fileExtension,
      encoded
    );
  };

  const decodeFile = () => {
    if (!decodingInput) return;
    decode(decodingInput);
  };

  const downloadDecoded = () => {
    if (!decoded) return;
    const fileExtension = decodeFileName.substring(
      decodeFileName.lastIndexOf(".")
    );
    download(
      decodeFileName.substring(0, decodeFileName.lastIndexOf(".")) +
        "_decoded" +
        fileExtension,
      decoded
    );
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
          <Input
            type="file"
            onChange={(e) => onUpload(e, setEncodeFileName, setEncoding)}
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
                <div className="flex flex-col gap-2 text-center w-full">
                  <Button onClick={downloadEncoded}>Download result</Button>
                  <div className="flex gap-2">
                    <span>Compressed:</span>
                    <span>
                      {(
                        100 -
                        (encoded.length * 100) / encodingInput.length
                      ).toPrecision(4)}
                      %
                    </span>
                  </div>
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
        <CardBody className="flex flex-col gap-5">
          <Input
            type="file"
            onChange={(e) => onUpload(e, setDecodeFileName, setDecoding)}
          />
          <Button
            onClick={decodeFile}
            color={decodingInput ? "primary" : "default"}
            disabled={!decodingInput}
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
                <div className="text-center w-full">
                  <Button onClick={downloadDecoded}>Download result</Button>
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
