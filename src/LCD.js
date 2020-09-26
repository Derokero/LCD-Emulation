// https://github.com/basti79/LCD-fonts

// Dot-matrix cell
class Cell {
    constructor(cols, rows) {
        this.rows = rows;
        this.cols = cols;
        this.cell = document.createElement("div");
        this.cell.setAttribute("class", "cell");

        // Generate cell grid
        this.cell.style.cssText = `display: grid;
                              grid: repeat(${rows}, auto)/repeat(${cols}, auto);`

        // Generate pixels
        for (let i = 0; i < rows * cols; i++) {
            const pixel = document.createElement("div");
            pixel.setAttribute("class", "pixel");
            this.cell.appendChild(pixel);
        }
    }

    clearCell() {
        for (const pixel of this.cell.childNodes) {
            pixel.setAttribute("class", "pixel");
        }
    }

    writeCharToCell(char, bitmap) {
        this.clearCell();

        // Get bitmap hex values
        const charBitmapArray = bitmap[char].split(",");
        let index = 0;
        // Iterate through all pixels, change according to bitmap
        for (let row = 0; row < this.rows * this.cols; row += this.cols) {
            const charRowBitmap = charBitmapArray[index++]; // Row hex bitmap

            for (let col = 0; col < this.cols; col++) {
                let bitSet = (parseInt(charRowBitmap) >> col & 1); // Check for set bit
                if (bitSet) {
                    this.cell.childNodes[row + col].setAttribute("class", "pixel on"); // Set class, colored by CSS
                }
            }
        }
    }
}

// Dot-matrix screen
class Screen {
    constructor(cols, rows, [cellCols, cellRows], bitmap) {
        this.maxLength = rows * cols;
        this.bitmap = bitmap;

        // Remove existing screen if any
        if (document.getElementById("screen"))
            document.getElementById("screen").remove();

        this.screen = document.createElement("div");
        this.cells = []; // Save cells
        this.screen.setAttribute("id", "screen");

        // LCD grid
        this.screen.style.cssText = `display: grid;
                                grid: repeat(${rows}, 1fr)/repeat(${cols}, 1fr);`;

        // Generate cells and populate screen
        for (let i = 0; i < rows * cols; i++) {
            const newCell = new Cell(Number(cellCols), Number(cellRows));
            this.cells.push(newCell); // Save cell
            this.screen.appendChild(newCell.cell);
        }

        // Append to HTML
        document.getElementById("input-wrapper").appendChild(this.screen);
    }

    clearScreen() {
        for (let index = 0; index < this.maxLength; index++) {
            const cell = this.cells[index]
            cell.clearCell();
        }
    }

    writeToScreen(msg) {
        if (!msg) return; // Empty message
        if (msg.length > this.maxLength) { // Overflow
            alert("Text overflow!");
            console.warn("Text overflow! :(");
            return;
        }

        for (let index = 0; index < msg.length; index++) {
            const cell = this.cells[index]
            cell.writeCharToCell(msg.charCodeAt(index), this.bitmap); // Get UTF-16 code of input character
        }
    }
}

// Async functions //

// Fetch LCD fonts
async function getBitmaps(selection) {
    let rawBitmap = await fetch("https://raw.githubusercontent.com/basti79/LCD-fonts/master/" + selection);
    rawBitmap = await rawBitmap.text(); // Convert to text
    const bitmaps = rawBitmap.match(/(?<={).*(?=})/g); // Extract bitmaps using regex magic :)
    return [...bitmaps]; // Return array of fonts
}

export default async function initLCD(cols, rows, font) {
    const cellSize = font.match(/\dx\d+/g)[0].split("x"); // Extract cell size from font name
    const bitmap = await getBitmaps(font); // Fetch desired font
    const LCD = new Screen(cols, rows, cellSize, bitmap); // Initialize screen
    return LCD; // Return promise to use in pageInit.js
}