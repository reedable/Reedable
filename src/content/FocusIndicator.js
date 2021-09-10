window.Reedable = window.Reedable || {};

Reedable.FocusIndicator = Reedable.FocusIndicator || (function () {
    "use strict";

    function onFocusIn(event) {
        const node = event.target;
        const {
            borderRadius,
            boxShadow,
            transition,
            outline,
        } = node.style;

        node.dataset.reedableBorderRadius = borderRadius;
        node.dataset.reedableBoxShadow = boxShadow;
        node.dataset.reedableTransition = transition;
        node.dataset.reedableOutline = outline;

        chrome.storage.sync.get(["FocusIndicator"], ({FocusIndicator}) => {
            node.style.borderRadius = FocusIndicator.borderRadius;
            node.style.boxShadow = FocusIndicator.boxShadow;
            node.style.transition = FocusIndicator.transition;
            node.style.outline = "none";
            node.addEventListener("focusout", onFocusOut);
        });
    }

    function onFocusOut(event) {
        const node = event.target;
        const {
            reedableBorderRadius,
            reedableBoxShadow,
            reedableTransition,
            reedableOutline,
        } = node.dataset;

        delete node.dataset.reedableBorderRadius;
        delete node.dataset.reedableBoxShadow;
        delete node.dataset.reedableTransition;
        delete node.dataset.reedableOutline;

        node.style.borderRadius = reedableBorderRadius || "";
        node.style.boxShadow = reedableBoxShadow || "";
        node.style.transition = reedableTransition || "";
        node.style.outline = reedableOutline || "";
        node.removeEventListener("focusout", onFocusOut);
    }

    function _start(documentFragment) {
        documentFragment.addEventListener("focusin", onFocusIn);
        documentFragment.querySelectorAll("*").forEach(node => {
            if (node.shadowRoot) {
                _start(node.shadowRoot);
            }
        });
    }

    function _stop(documentFragment) {
        documentFragment.removeEventListener("focusin", onFocusIn);
        documentFragment.querySelectorAll("*").forEach(node => {
            if (node.shadowRoot) {
                _stop(node.shadowRoot);
            }
        });
    }

    return {
        "start": function (doc) {
            if (doc.body) {
                _start(doc);
            } else {
                doc.addEventListener("DOMContentLoaded", () => _start(doc));
            }

            chrome.storage.sync.get(["FocusIndicator"], ({FocusIndicator}) => {
                FocusIndicator.isEnabled = true;
                chrome.storage.sync.set({FocusIndicator});
            });
        },
        "stop": function (doc) {
            if (doc.body) {
                _stop(doc);
            } else {
                doc.addEventListener("DOMContentLoaded", () => _stop(doc));
            }

            chrome.storage.sync.get(["FocusIndicator"], ({FocusIndicator}) => {
                FocusIndicator.isEnabled = false;
                chrome.storage.sync.set({FocusIndicator});
            });
        },
    };
})();