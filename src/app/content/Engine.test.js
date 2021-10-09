import {chrome} from "../../core/test/fake/chrome";
import {deepRestore, deepSpy} from "../../core/test/jestHelper";
import {Engine} from "./Engine";
import {afterEach, beforeEach, describe, it, jest} from "@jest/globals";

describe("Engine", function () {
    "use strict";

    let sut;
    let chromeMock;

    beforeEach(function () {
        chromeMock = deepSpy(chrome);
        sut = new Engine("MyEngine");
    });

    afterEach(function () {
        deepRestore(chromeMock);
    });

    describe("_processNodes", function () {

        beforeEach(() => {
            sut._processNode = jest.fn();
        });

        it("requests pref data by same engine name", () => {
            sut._processNodes();
            expect(chromeMock.storage.sync.get).toHaveBeenCalledTimes(1);
            expect(chromeMock.storage.sync.get.mock.calls[0][0]).toStrictEqual(["MyEngine"]);
        });

        it("does not do anything if nothing was passed to _processNodes", () => {
            sut._processNodes();

            const callback = chromeMock.storage.sync.get.mock.calls[0][1];
            callback();
            expect(sut._processNode).toHaveBeenCalledTimes(0);
        });

        it("calls _processNode as many times as there are nodes in the nodeList passed to _processNodes", () => {

            const createParagraphElement = (textContent) => {
                const p = document.createElement("p");
                p.appendChild(document.createTextNode(textContent));
                return p;
            };

            const documentFragment = document.createDocumentFragment();
            documentFragment.append(createParagraphElement("foo"));
            documentFragment.append(createParagraphElement("qwerty"));
            documentFragment.append(createParagraphElement("hello"));
            sut._processNodes(documentFragment.querySelectorAll("p"));

            const callback = chromeMock.storage.sync.get.mock.calls[0][1];
            callback();
            expect(sut._processNode).toHaveBeenCalledTimes(3);
        });
    });

    describe("start", function () {
        let _processNodesMock;
        let querySelectorAllMock;
        let observerMock;

        beforeEach(() => {
            sut._createObserver = jest.fn().mockReturnValue(observerMock = {
                "observe": jest.fn()
            });
            querySelectorAllMock = jest.spyOn(document, "querySelectorAll");
            _processNodesMock = jest.spyOn(sut, "_processNodes");
        });

        afterEach(() => {
            querySelectorAllMock.mockRestore();
            _processNodesMock.mockRestore();
        });

        it("starts observing the documentFragment", async () => {
            await sut.start(document);
            expect(observerMock.observe).toHaveBeenCalledTimes(1);
            expect(querySelectorAllMock).toHaveBeenCalledTimes(1);
            expect(_processNodesMock).toHaveBeenCalledTimes(1);
        });
    });

    describe("stop", function () {
        let observersGetMock;

        beforeEach(() => {
            sut._restoreNode = jest.fn();
            observersGetMock = jest.spyOn(sut.observers, "get");
        });

        afterEach(() => {
            observersGetMock.mockReset();
        });

        it("disconnects observer if one is found", async () => {
            let observerMock;
            observersGetMock.mockReturnValue(observerMock = {
                "disconnect": jest.fn()
            });
            await sut.stop();
            expect(observerMock.disconnect).toHaveBeenCalledTimes(1);
        });
    });

});