import { useState, useEffect } from "react";
import { parseHeader, parsePayload, parseSignature } from "./SHCParser";
import { verifySignature } from "./SHCParser";

// Decode Smart health card data
// Reference: https://spec.smarthealth.cards/
async function decodeSHC(data) {
  // validate data
  if (
    typeof data !== "string" ||
    !data.startsWith("shc:/") ||
    data.length < 7
  ) {
    return null;
  }

  // calculate data length (2 digit -> 1 byte)
  const dataLength = Math.floor((data.length - 5) / 2);
  if (dataLength < 1) {
    return null;
  }

  // digit -> ascii
  let base64Text = "";
  for (let i = 0; i < dataLength; i++) {
    const start = 5 + i * 2;
    const end = start + 2;
    const digit = parseInt(data.substring(start, end));

    if (isNaN(digit)) {
      return null;
    }
    base64Text = base64Text + String.fromCharCode(digit + 45);
  }

  // split jwt
  const rawDatas = base64Text.split(".");
  if (rawDatas.length < 3) {
    console.log("Not enough data");
    return null;
  }
  const [rawHeader, rawPayload, rawSignature] = rawDatas;

  const header = parseHeader(rawHeader);
  const payload = parsePayload(rawPayload);
  const signature = parseSignature(rawSignature);
  console.log(payload);

  // verify nbf
  if (payload.nbf > Date.now() / 1000) {
    console.log("Not yet valid");
    return null;
  }

  // verify signature
  const verifyResult = await verifySignature(
    header.kid,
    payload.iss,
    rawHeader + "." + rawPayload,
    signature
  );

  // return data
  return [payload, verifyResult];
}

export function useSHCDecode() {
  const [qrcodeText, setQrcodeText] = useState("");
  const [decodedData, setDecodedData] = useState(null);
  const [isWaiting, setIsWaiting] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const decode = async () => {
      if (qrcodeText !== "") {
        setIsWaiting(false);
        setIsLoading(true);
        console.log(`Decoding SHC data: ${qrcodeText}`);

        const [data, valid] = await decodeSHC(qrcodeText);
        setIsLoading(false);
        setIsValid(valid);
        setDecodedData(data);
      }
    };
    decode();
  }, [qrcodeText]);

  return { setQrcodeText, decodedData, isWaiting, isLoading, isValid };
}
