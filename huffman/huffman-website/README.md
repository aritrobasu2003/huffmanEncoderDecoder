# Huffman Encoder/Decoder Website

A simple web application for compressing and decompressing text files using Huffman coding algorithm.

## Features

- **Compress .txt files**: Upload a text file and compress it using Huffman encoding. The compressed file (.huf) will be automatically downloaded.
- **Decompress .huf files**: Upload a compressed Huffman file and decompress it back to the original text file (.txt).
- **Compression Ratio Display**: Shows the original file size, compressed file size, and the percentage of space saved after compression.
- **Decompression Size Display**: Shows the size of the decompressed file.
- **Client-side Processing**: All operations are performed in the browser using JavaScript, no server required.

## How to Use

1. **Compression**:

   - Click "Choose File" under "Compress .txt File".
   - Select a .txt file from your computer.
   - Click "Compress and Download" to process and download the compressed .huf file.
   - The compression ratio will be displayed below the button.

2. **Decompression**:
   - Click "Choose File" under "Decompress .huf File".
   - Select a .huf file (previously compressed by this tool).
   - Click "Decompress and Download" to process and download the original .txt file.
   - The decompressed file size will be displayed below the button.

## Technical Details

- **Algorithm**: Huffman coding for lossless data compression.
- **File Format**: Compressed files store the frequency table (as JSON) followed by the encoded binary data.
- **Technologies**: HTML, CSS, JavaScript (ES6+).
- **Browser Compatibility**: Modern browsers with support for File API and Blob.

## File Structure

```
huffman-website/
├── index.html      # Main HTML page
├── style.css       # CSS styles
├── script.js       # JavaScript logic
└── README.md       # This file
```

## Running the Application

1. Download or clone the repository.
2. Open `index.html` in a web browser.
3. No additional setup or installation required.

## Limitations

- Only works with text files (.txt) for compression.
- Compressed files (.huf) are specific to this implementation and cannot be decompressed by other Huffman tools.
- Large files may take time to process due to client-side computation.

## License

This project is open source and available under the MIT License.
