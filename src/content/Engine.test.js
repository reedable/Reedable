import chrome from "../test/fake/chrome";
import {deepMock, deepRestore} from "../test/deep";

require("./DOM");
require("./Engine");

describe("Engine", function () {
    "use strict";

    let engine;
    let chromeMock;

    beforeEach(function () {
        chromeMock = deepMock(chrome);
        engine = new Reedable.Engine("MyEngine");
    });

    afterEach(function () {
        deepRestore(chromeMock);
    });

    describe("_processNodes", function () {

        beforeEach(() => {
            engine._processNode = jest.fn();
        });

        afterEach(() => {
        });

        it("requests pref data by same engine name", () => {
            engine._processNodes();
            expect(chromeMock.storage.sync.get).toHaveBeenCalledTimes(1);
            expect(chromeMock.storage.sync.get.mock.calls[0][0]).toStrictEqual(["MyEngine"]);
        });

        it("does not do anything if nothing was passed to _processNodes", () => {
            engine._processNodes();

            const callback = chromeMock.storage.sync.get.mock.calls[0][1];
            callback();
            expect(engine._processNode).toHaveBeenCalledTimes(0);
        });

        it("calls _processNode as many times as there are nodes in the nodeList passed to _processNodes", () => {

            const createElement = (textContent) => {
                const p = document.createElement("p");
                p.appendChild(document.createTextNode(textContent));
                return p;
            };

            const documentFragment = document.createDocumentFragment();
            documentFragment.append(createElement("asdf"));
            documentFragment.append(createElement("qwerty"));
            documentFragment.append(createElement("hello"));
            engine._processNodes(documentFragment.querySelectorAll("p"));

            const callback = chromeMock.storage.sync.get.mock.calls[0][1];
            callback();
            expect(engine._processNode).toHaveBeenCalledTimes(3);
        });
    });
});