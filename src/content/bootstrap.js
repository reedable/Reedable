(function ({}) {
    const script = document.createElement("script");
    script.setAttribute("type", "module");
    script.setAttribute("src", chrome.runtime.getURL("/content/main.js"));
    script.addEventListener("load", function (e) {
        console.log(e, window.Modules);
    });

    if (document.head) {
        document.head.appendChild(script);
    } else {
        document.addEventListener("DOMContentLoaded", function () {
            document.head.appendChild(script);
        });
    }
})(window);