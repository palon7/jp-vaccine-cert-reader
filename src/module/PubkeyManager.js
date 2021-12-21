export class PubkeyManager {
  constructor() {
    this.fetchedUrl = new Set();
    this.pubkeys = new Map();
  }

  async getPubkey(kid, pubkeyUrl) {
    if (!this.fetchedUrl.has(pubkeyUrl)) {
      await this.fetchPubkey(pubkeyUrl);
    }
    return this.pubkeys.get(kid) || null;
  }

  async fetchPubkey(pubkeyUrl) {
    const response = await fetch(pubkeyUrl);
    const pubkey = await response.text();
    const keys = JSON.parse(pubkey).keys;
    for (let key of keys) {
      const imported = await this.getCryptoKey(key);
      this.pubkeys.set(key.kid, imported);
    }

    this.fetchedUrl.add(pubkeyUrl);
  }

  async getCryptoKey(key) {
    const importedKey = await crypto.subtle.importKey(
      "jwk",
      key,
      { name: "ECDSA", namedCurve: "P-256" },
      true,
      ["verify"]
    );
    return importedKey;
  }
}
