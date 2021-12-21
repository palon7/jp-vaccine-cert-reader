import Pako from "pako";
import { toByteArray } from "base64-js";
import { convertURLSafeBase64, toBufferSource } from "./Util";
import { PubkeyManager } from "./PubkeyManager";

const pubkeyManager = new PubkeyManager();
const ISSUER_WHITELIST = ["https://vc.vrs.digital.go.jp/issuer"];

// Parse parload json
// @return decoded payload or null if error
function parsePayloadJSON(body) {
  let nbf = body.nbf || null;
  let iss = body.iss || null;
  let name = null;
  let birthday = null;
  let immunizations = [];

  // check if fhir data found
  if (!body.vc.credentialSubject.fhirBundle.entry) return null;

  // Reference: https://www.hl7.org/fhir/immunization-definitions.html#Immunization.status
  for (const entry of body.vc.credentialSubject.fhirBundle.entry) {
    switch (entry.resource.resourceType) {
      // Patient data
      case "Patient":
        const rawName = entry.resource.name[0];
        name = rawName.family;
        for (const given in rawName.given) {
          name += " " + rawName.given[given];
        }

        birthday = entry.resource.birthDate;
        break;
      // Immunization data
      case "Immunization":
        const resource = entry.resource;
        immunizations.push({
          status: resource.status,
          datetime: resource.occurrenceDateTime,
          vaccineCode: resource.vaccineCode.coding[0].code,
          performer: resource.performer[0].actor.display,
          lotNumber: resource.lotNumber,
        });
        break;
      default:
        break;
    }
  }

  // validate
  if (nbf && iss && name && birthday && immunizations.length > 0) {
    return {
      nbf,
      iss,
      name,
      birthday,
      immunizations,
    };
  } else {
    return null;
  }
}

export function parsePayload(rawPayload) {
  // decode base64 to uint8 array
  const compressedBody = toByteArray(convertURLSafeBase64(rawPayload));
  // decompress data
  const body = new TextDecoder().decode(Pako.inflateRaw(compressedBody));

  const json = JSON.parse(body);
  return parsePayloadJSON(json);
}

export function parseHeader(rawHeader) {
  const decoded = window.atob(convertURLSafeBase64(rawHeader));
  return JSON.parse(decoded);
}

export function parseSignature(rawSignature) {
  const decoded = toByteArray(convertURLSafeBase64(rawSignature));
  return decoded;
}

export async function verifySignature(kid, iss, data, signature) {
  if (!ISSUER_WHITELIST.includes(iss)) {
    console.log(`Invalid issuer: ${iss}`);
    return false;
  }

  let pubkeyUrl = `${iss}/.well-known/jwks.json`;

  // temporarily hack - fix this when digital.go.jp will provide correct access-control-allow-origin
  if (
    pubkeyUrl === "https://vc.vrs.digital.go.jp/issuer/.well-known/jwks.json"
  ) {
    pubkeyUrl = "https://palon7.github.io/vc-reader/jwks.json";
  }
  const pubkey = await pubkeyManager.getPubkey(kid, pubkeyUrl);

  if (pubkey === null) {
    console.log(`Invalid kid: ${kid}`);
    return false;
  }

  const result = await crypto.subtle.verify(
    { name: "ECDSA", hash: { name: "SHA-256" } },
    pubkey,
    signature,
    toBufferSource(data)
  );

  return result;
}
