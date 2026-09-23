// generate-png-icons.js
import fs from 'fs';
import zlib from 'zlib';
import path from 'path';

function createCRC32Table() {
    let table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
        let c = i;
        for (let k = 0; k < 8; k++) {
            c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        table[i] = c >>> 0;
    }
    return table;
}

const crcTable = createCRC32Table();

function crc32(buf) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(8 + len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const typeAndData = Buffer.alloc(4 + len);
    typeAndData.write(type, 0, 4, 'ascii');
    data.copy(typeAndData, 4);
    const crc = crc32(typeAndData);
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
}

function generatePng(width, height, iconPath) {
    // Generate RGBA buffer
    // Filter type 0 per line
    const rowSize = 1 + width * 4;
    const rawData = Buffer.alloc(height * rowSize);

    // Design PlayPeak Sports Logo:
    // Dark background #080C14 with orange (#FF6A1A) and blue (#3B82F6) athletic accents
    const cx = width / 2;
    const cy = height / 2;
    const r = width * 0.44;

    for (let y = 0; y < height; y++) {
        const rowOffset = y * rowSize;
        rawData[rowOffset] = 0; // Filter byte: None

        for (let x = 0; x < width; x++) {
            const pxOffset = rowOffset + 1 + x * 4;

            // Distance from center
            const dx = x - cx;
            const dy = y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let rCol = 8, gCol = 12, bCol = 20, aCol = 255; // #080C14

            // Rounded app icon border
            const cornerRadius = width * 0.22;
            const inRoundedBox = (
                Math.abs(dx) <= cx - 4 && Math.abs(dy) <= cy - 4
            );

            // Draw orange circle or athlete shield
            if (dist < r) {
                // Background dark radial gradient
                const gradFactor = 1 - (dist / r) * 0.5;
                rCol = Math.round(15 * gradFactor);
                gCol = Math.round(23 * gradFactor);
                bCol = Math.round(42 * gradFactor);

                // Draw Stylized "P" & Athletic wings
                // 1. Athlete head (circle at top-center)
                const headDist = Math.sqrt((x - cx) ** 2 + (y - (cy - height * 0.18)) ** 2);
                if (headDist <= width * 0.09) {
                    rCol = 255; gCol = 106; bCol = 26; // #FF6A1A
                }

                // 2. Athletic orange core (diagonal swoosh)
                const inTorso = (
                    x >= cx - width * 0.22 && x <= cx + width * 0.22 &&
                    y >= cy - height * 0.08 && y <= cy + height * 0.28 &&
                    Math.abs((x - cx) * 0.8 - (y - cy) * 0.6) < width * 0.12
                );

                if (inTorso) {
                    rCol = 255; gCol = 106; bCol = 26; // #FF6A1A
                }

                // 3. Dynamic blue wings (#3B82F6)
                const inLeftWing = (
                    x >= cx - width * 0.35 && x <= cx - width * 0.10 &&
                    y >= cy - height * 0.12 && y <= cy + height * 0.14 &&
                    (x + y * 0.8) > (cx - width * 0.1)
                );
                const inRightWing = (
                    x >= cx + width * 0.10 && x <= cx + width * 0.35 &&
                    y >= cy - height * 0.12 && y <= cy + height * 0.14 &&
                    (y * 0.8 - x) > (-cx - width * 0.1)
                );

                if (inLeftWing || inRightWing) {
                    rCol = 59; gCol = 130; bCol = 246; // #3B82F6
                }

                // Outer circular accent ring
                if (Math.abs(dist - r * 0.94) < width * 0.02) {
                    rCol = 255; gCol = 106; bCol = 26;
                }
            }

            rawData[pxOffset] = rCol;
            rawData[pxOffset + 1] = gCol;
            rawData[pxOffset + 2] = bCol;
            rawData[pxOffset + 3] = aCol;
        }
    }

    const compressed = zlib.deflateSync(rawData);

    // PNG Signature
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

    // IHDR
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr.writeUInt8(8, 8); // bit depth 8
    ihdr.writeUInt8(6, 9); // RGBA
    ihdr.writeUInt8(0, 10); // compression deflate
    ihdr.writeUInt8(0, 11); // filter 0
    ihdr.writeUInt8(0, 12); // no interlace

    const ihdrChunk = makeChunk('IHDR', ihdr);
    const idatChunk = makeChunk('IDAT', compressed);
    const iendChunk = makeChunk('IEND', Buffer.alloc(0));

    const finalPng = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
    fs.writeFileSync(iconPath, finalPng);
    console.log(`Generated PNG: ${iconPath} (${width}x${height})`);
}

generatePng(192, 192, path.resolve('public/icon-192.png'));
generatePng(512, 512, path.resolve('public/icon-512.png'));
generatePng(180, 180, path.resolve('public/apple-touch-icon.png'));
