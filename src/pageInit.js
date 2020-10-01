import initLCD from "./LCD.js"; // initLCD()

// Available font bitmaps
// https://github.com/basti79/LCD-fonts
const BITMAPS = [
    "4x6_horizontal_LSB_2.h",
    "5x8_horizontal_LSB_2.h",
    "5x12_horizontal_LSB_2.h",
    "6x8_horizontal_LSB_2.h",
    "6x10_horizontal_LSB_2.h",
    "7x12_horizontal_LSB_2.h",
    "7x12b_horizontal_LSB_2.h",
    "8x8_horizontal_LSB_2.h",
    "8x12_horizontal_LSB_2.h",
    "8x14_horizontal_LSB_2.h",
];


// Initialize page
(function initPage() {
    // Get elements
    const select = document.getElementById("fontSelect");
    const textInput = document.getElementById("textInput");
    let sliderCols = document.getElementById("lcdCols");
    let sliderRows = document.getElementById("lcdRows");


    // Initialize default screen
    let LCDPromise = initLCD(10, 2, "4x6_horizontal_LSB_2.h");
    LCDPromise.catch(err => console.error(err));

    // Generate font selections in the page
    (function selectionOptions() {
        for (const font of BITMAPS) {
            const option = document.createElement("option");
            option.setAttribute("value", font);
            option.innerText = font.replaceAll(/_.*/g, "");
            select.appendChild(option);
        }
    })();


    // Update screen
    function updateLCD() {
        LCDPromise = initLCD(sliderCols.value, sliderRows.value, select.value);
        LCDPromise.catch(err => console.error(err));
        textInput.value = "";
    }

    // Event listeners //

    // Text input
    textInput.addEventListener("input", function () {
        LCDPromise.then(LCD => {
            LCD.clearScreen();
            LCD.writeToScreen(textInput.value)
        }).catch(err => {
            console.error(err);
        });
    });

    // Font change
    select.addEventListener("change", () => updateLCD());

    // Row and column sliders
    sliderCols.addEventListener("change", () => {
        updateLCD();
    });

    sliderCols.addEventListener("input", () => {
        document.querySelector("label[for=lcdCols]").innerText = "LCD Columns: " + sliderCols.value;
    });

    sliderRows.addEventListener("change", () => {
        updateLCD();
    });

    sliderRows.addEventListener("input", () => {
        document.querySelector("label[for=lcdRows]").innerText = "LCD Rows: " + sliderRows.value;
    });


})();