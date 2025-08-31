class Node {
  constructor(char, freq, left = null, right = null) {
    this.char = char;
    this.freq = freq;
    this.left = left;
    this.right = right;
  }
}

class Huffman {
  constructor() {
    this.codes = {};
    this.reverseCodes = {};
    this.freq = {};
    this.root = null;
  }

  buildTree(text) {
    this.freq = {};
    for (let char of text) {
      this.freq[char] = (this.freq[char] || 0) + 1;
    }
    let pq = [];
    for (let char in this.freq) {
      pq.push(new Node(char, this.freq[char]));
    }
    pq.sort((a, b) => a.freq - b.freq);
    while (pq.length > 1) {
      let left = pq.shift();
      let right = pq.shift();
      let merged = new Node(null, left.freq + right.freq, left, right);
      pq.push(merged);
      pq.sort((a, b) => a.freq - b.freq);
    }
    this.root = pq[0];
  }

  buildTreeFromFreq() {
    let pq = [];
    for (let char in this.freq) {
      pq.push(new Node(char, this.freq[char]));
    }
    pq.sort((a, b) => a.freq - b.freq);
    while (pq.length > 1) {
      let left = pq.shift();
      let right = pq.shift();
      let merged = new Node(null, left.freq + right.freq, left, right);
      pq.push(merged);
      pq.sort((a, b) => a.freq - b.freq);
    }
    this.root = pq[0];
  }

  generateCodes(node, code = "") {
    if (!node) return;
    if (node.char !== null) {
      this.codes[node.char] = code;
      this.reverseCodes[code] = node.char;
      return;
    }
    this.generateCodes(node.left, code + "0");
    this.generateCodes(node.right, code + "1");
  }

  encode(text) {
    this.buildTree(text);
    this.generateCodes(this.root);
    let encoded = "";
    for (let char of text) {
      encoded += this.codes[char];
    }
    return encoded;
  }

  decode(encoded) {
    let decoded = "";
    let current = this.root;
    for (let bit of encoded) {
      if (bit === "0") {
        current = current.left;
      } else {
        current = current.right;
      }
      if (current.char !== null) {
        decoded += current.char;
        current = this.root;
      }
    }
    return decoded;
  }
}

function compressFile() {
  let fileInput = document.getElementById("compress-input");
  let file = fileInput.files[0];
  if (!file) {
    alert("Please select a .txt file to compress.");
    return;
  }
  let reader = new FileReader();
  reader.onload = function (e) {
    let text = e.target.result;
    let huffman = new Huffman();
    let encoded = huffman.encode(text);
    let freqStr = JSON.stringify(huffman.freq) + "\n";
    let binary = new Uint8Array(Math.ceil(encoded.length / 8));
    for (let i = 0; i < encoded.length; i++) {
      let byteIndex = Math.floor(i / 8);
      let bitIndex = i % 8;
      if (encoded[i] === "1") {
        binary[byteIndex] |= 1 << (7 - bitIndex);
      }
    }
    let blob = new Blob([freqStr, binary], {
      type: "application/octet-stream",
    });
    let originalSize = new Blob([text]).size;
    let compressedSize = blob.size;
    let ratio =
      originalSize > 0
        ? (((originalSize - compressedSize) / originalSize) * 100).toFixed(2)
        : 0;
    document.getElementById(
      "compress-result"
    ).innerText = `Original: ${originalSize} bytes, Compressed: ${compressedSize} bytes, Compression: ${ratio}%`;
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(".txt", ".huf");
    a.click();
    URL.revokeObjectURL(url);
  };
  reader.readAsText(file);
}

function decompressFile() {
  let fileInput = document.getElementById("decompress-input");
  let file = fileInput.files[0];
  if (!file) {
    alert("Please select a .huf file to decompress.");
    return;
  }
  let reader = new FileReader();
  reader.onload = function (e) {
    let data = e.target.result;
    let uint8 = new Uint8Array(data);
    let newlineIndex = -1;
    for (let i = 0; i < uint8.length && newlineIndex === -1; i++) {
      if (uint8[i] === 10) {
        // \n
        newlineIndex = i;
      }
    }
    if (newlineIndex === -1) {
      alert("Invalid file format.");
      return;
    }
    let freqStr = new TextDecoder().decode(uint8.slice(0, newlineIndex));
    let freq;
    try {
      freq = JSON.parse(freqStr);
    } catch (e) {
      alert("Invalid frequency data in file.");
      return;
    }
    let binary = uint8.slice(newlineIndex + 1);
    let encoded = "";
    for (let byte of binary) {
      for (let i = 7; i >= 0; i--) {
        encoded += byte & (1 << i) ? "1" : "0";
      }
    }
    let huffman = new Huffman();
    huffman.freq = freq;
    huffman.buildTreeFromFreq();
    huffman.generateCodes(huffman.root);
    let decoded = huffman.decode(encoded);
    let blob = new Blob([decoded], { type: "text/plain" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(".huf", ".txt");
    a.click();
    URL.revokeObjectURL(url);
  };
  reader.readAsArrayBuffer(file);
}
