import {DOM} from "./DOM";
import {beforeEach, describe, it} from "@jest/globals";

describe("DOM", function () {
    "use strict";

    /**
     * Reference:
     * - https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace
     */
    describe("getText", function () {

        it("returns empty string if no node is provided", () => {
            expect(DOM.getText()).toBe("");
        });

        it("returns empty string if node has no childNodes", () => {
            const node = document.createElement("p");
            expect(DOM.getText(node)).toBe("");
        });

        it("ignores the childNode textContent if nodeType is not text node", () => {
            const node = document.createElement("p");
            node.appendChild(document.createElement("div"));
            node.appendChild(document.createTextNode("World!"));
            expect(DOM.getText(node)).toBe("World!");
        });

        it("combines all textContent into a single string", () => {
            const node = document.createElement("p");
            node.appendChild(document.createTextNode("Hello, "));
            node.appendChild(document.createTextNode("World!"));
            expect(DOM.getText(node)).toBe("Hello, World!");
        });

        it("replaces carriage return and tab into a single whitespace", () => {
            const node = document.createElement("p");
            node.appendChild(document.createTextNode("Hello,\r"));
            node.appendChild(document.createTextNode("\tWorld!"));
            expect(DOM.getText(node)).toBe("Hello, World!");
        });

        it("compresses repeating whitespaces into single whitespace", () => {
            const node = document.createElement("p");
            node.appendChild(document.createTextNode("  Hello, \r   "));
            node.appendChild(document.createTextNode("    \t World! "));
            expect(DOM.getText(node)).toBe(" Hello, World! ");
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
                "fontSize": "16px"
            };
        });

        it("returns NaN if no arguments are provided", () => {
            expect(DOM.parseLength()).toBe(NaN);
        });

        it("returns the number untouched if a number is passed", () => {
            expect(DOM.parseLength(16, computedStyle)).toBe(16);
        });

        it("returns the number without units", () => {
            expect(DOM.parseLength("16", computedStyle)).toBe(16);
        });

        // Absolute lengths

        it("converts px", () => {
            expect(DOM.parseLength("16px", computedStyle)).toBe(16);
        });

        it("converts rem", () => {
            expect(DOM.parseLength("1em", computedStyle)).toBe(16);
        });

        it("converts pt", () => {
            expect(DOM.parseLength("12pt", computedStyle)).toBe(16);
        });

        it("converts pc", () => {
            expect(DOM.parseLength("6pc", computedStyle)).toBe(96);
        });

        it("converts in", () => {
            expect(DOM.parseLength("1in", computedStyle)).toBe(96);
        });

        it("converts mm", () => {
            expect(DOM.parseLength("10mm", computedStyle)).toBe(38);
        });

        it("converts cm", () => {
            expect(DOM.parseLength("1cm", computedStyle)).toBe(38);
        });

        it("converts Q", () => {
            expect(DOM.parseLength("40Q", computedStyle)).toBe(38);
        });

        // Relative lengths

        it("converts em", () => {
            expect(DOM.parseLength("1em", computedStyle)).toBe(16);
        });

        it("converts rem", () => {
            expect(DOM.parseLength("1rem", computedStyle)).toBe(16);
            expect(DOM.parseLength("2rem", computedStyle)).toBe(32);
        });

    });
});