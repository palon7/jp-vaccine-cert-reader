export function convertURLSafeBase64(str) {
  let result = str.replace(/-/g, "+").replace(/_/g, "/");
  while (result.length % 4 !== 0) {
    result += "=";
  }
  return result;
}

export function toBufferSource(t) {
  var r = new Uint8Array(t.length);
  for (var i = 0; i < r.length; i++) r[i] = t.charCodeAt(i);
  return r;
}
