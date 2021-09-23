require("./DOM");

describe("DOM", function () {

    /**
     * Reference:
     * - https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace
     */
    describe("getText", function () {

        it("returns empty string if no node is provided", () => {
            expect(Reedable.DOM.getText()).toBe("");
        });

        it("returns empty string if node has no childNodes", () => {
            expect(Reedable.DOM.getText({})).toBe("");
        });

        it("returns empty string if node's childNodes is empty", () => {
            expect(Reedable.DOM.getText({
                "childNodes": [],
            })).toBe("");
        });

        it("ignores the childNode textContent if nodeType is not Node.TEXTNOD", () => {
            expect(Reedable.DOM.getText({
                "childNodes": [{
                    "textContent": "Hello, ",
                }, {
                    "nodeType": Node.TEXT_NODE,
                    "textContent": "World!",
                }],
            })).toBe("World!");
        });

        it("combines all textContent into a single string", () => {
            expect(Reedable.DOM.getText({
                "childNodes": [{
                    "nodeType": Node.TEXT_NODE,
                    "textContent": "Hello, ",
                }, {
                    "nodeType": Node.TEXT_NODE,
                    "textContent": "World!",
                }],
            })).toBe("Hello, World!");
        });

        it("replaces carriage return and tab into a single whitespace", () => {
            expect(Reedable.DOM.getText({
                "childNodes": [{
                    "nodeType": Node.TEXT_NODE,
                    "textContent": "Hello,\r",
                }, {
                    "nodeType": Node.TEXT_NODE,
                    "textContent": "\tWorld!",
                }],
            })).toBe("Hello, World!");
        });

        it("compresses repeating whitespaces into single whitespace", () => {
            expect(Reedable.DOM.getText({
                "childNodes": [{
                    "nodeType": Node.TEXT_NODE,
                    "textContent": "  Hello, \r    ",
                }, {
                    "nodeType": Node.TEXT_NODE,
                    "textContent": "    \t World!  ",
                }],
            })).toBe(" Hello, World! ");
        });
    });

    /**
     * Reference:
     * - https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units
     */
    describe("parseLength", function () {
        let computedStyle;

        beforeEach(() => {
            computedStyle = {
                "fontSize": "16px",
            };
        });

        it("returns NaN if no arguments are provided", () => {
            expect(Reedable.DOM.parseLength()).toBe(NaN);
        });

        it("returns the number untouched if a number is passed", () => {
            expect(Reedable.DOM.parseLength(16, computedStyle)).toBe(16);
        });

        it("returns the number without units", () => {
            expect(Reedable.DOM.parseLength("16", computedStyle)).toBe(16);
        });

        // Absolute lengths

        it("converts px", () => {
            expect(Reedable.DOM.parseLength("16px", computedStyle)).toBe(16);
        });

        it("converts rem", () => {
            expect(Reedable.DOM.parseLength("1em", computedStyle)).toBe(16);
        });

        it("converts pt", () => {
            expect(Reedable.DOM.parseLength("12pt", computedStyle)).toBe(16);
        });

        it("converts pc", () => {
            expect(Reedable.DOM.parseLength("6pc", computedStyle)).toBe(96);
        });

        it("converts in", () => {
            expect(Reedable.DOM.parseLength("1in", computedStyle)).toBe(96);
        });

        it("converts mm", () => {
            expect(Reedable.DOM.parseLength("10mm", computedStyle)).toBe(38);
        });

        it("converts cm", () => {
            expect(Reedable.DOM.parseLength("1cm", computedStyle)).toBe(38);
        });

        it("converts Q", () => {
            expect(Reedable.DOM.parseLength("40Q", computedStyle)).toBe(38);
        });

        // Relative lengths

        it("converts em", () => {
            expect(Reedable.DOM.parseLength("1em", computedStyle)).toBe(16);
        });

        it("converts rem", () => {
            expect(Reedable.DOM.parseLength("1rem", computedStyle)).toBe(16);
            expect(Reedable.DOM.parseLength("2rem", computedStyle)).toBe(32);
        });

    });
});