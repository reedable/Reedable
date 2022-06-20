import {deepRestore, deepSpy} from "../test/jestHelper";
import {Engine} from "./Engine";
import {afterEach, beforeEach, describe, it, jest} from "@jest/globals";
import {Sync} from "../Storage";

describe("Engine", function () {
    "use strict";

    let sut;
    let SyncMock;

    beforeEach(function () {
        sut = new Engine("MyEngine");
        SyncMock = deepSpy(Sync);
        SyncMock.get.mockResolvedValue({});
    });

    afterEach(function () {
        deepRestore(SyncMock);
    });

    describe("_processNodes", function () {

        beforeEach(() => {
            sut._processNode = jest.fn();
        });

        it("requests pref data by same engine name", async () => {
            await sut._processNodes();
            expect(SyncMock.get).toHaveBeenCalledTimes(1);
            expect(SyncMock.get.mock.calls[0][0]).toStrictEqual("MyEngine");
        });

        it("does not do anything if nothing was passed to _processNodes", async () => {
            await sut._processNodes();
            expect(sut._processNode).toHaveBeenCalledTimes(0);
        });

        it("calls _processNode as many times as there are nodes in the nodeList passed to _processNodes", async () => {

            const createParagraphElement = (textContent) => {
                const p = document.createElement("p");
                p.appendChild(document.createTextNode(textContent));
                return p;
            };

            const documentFragment = document.createDocumentFragment();
            documentFragment.append(createParagraphElement("foo"));
            documentFragment.append(createParagraphElement("qwerty"));
            documentFragment.append(createParagraphElement("hello"));

            await sut._processNodes(documentFragment.querySelectorAll("p"));
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