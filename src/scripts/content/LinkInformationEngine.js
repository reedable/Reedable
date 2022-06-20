import { Engine } from "../core/content/Engine";
//import { DOM } from "../core/ui/DOM";

const FONT_FACE_CSS = `
    /* Load Font Awesome 6 in Reedable namespace to avoid collision. */

    @font-face {
        font-family: "Reedable FA6 Brands";
        font-weight: 400;
        font-style: normal;
        font-display: block;
        src: url("chrome-extension://${chrome.runtime.id}/thirdparty/fontawesome-free-6.1.1-web/webfonts/fa-brands-400.woff2") format("woff2"),
                url("chrome-extension://${chrome.runtime.id}/thirdparty/fontawesome-free-6.1.1-web/webfonts/fa-brands-400.ttf") format("truetype");
    }

    @font-face {
        font-family: 'Reedable FA6 Regular';
        font-style: normal;
        font-weight: 400;
        font-display: block;
        src: url("chrome-extension://${chrome.runtime.id}/thirdparty/fontawesome-free-6.1.1-web/webfonts/fa-regular-400.woff2") format("woff2"),
                url("chrome-extension://${chrome.runtime.id}/thirdparty/fontawesome-free-6.1.1-web/webfonts/fa-regular-400.ttf") format("truetype");
    }

    @font-face {
        font-family: 'Reedable FA6 Solid';
        font-style: normal;
        font-weight: 900;
        font-display: block;
        src: url("chrome-extension://${chrome.runtime.id}/thirdparty/fontawesome-free-6.1.1-web/webfonts/fa-solid-900.woff2") format("woff2"),
                url("chrome-extension://${chrome.runtime.id}/thirdparty/fontawesome-free-6.1.1-web/webfonts/fa-solid-900.ttf") format("truetype");
    }
`;

const LINK_INFORMATION = `

    /*
        Anchors are identified by

            a:not([href])[id]
            a:not([href])[name]
    */

    a:not([href])[id][title][data-reedable-link-information-show-title]::after,
    a:not([href])[name][title][data-reedable-link-information-show-title]::after {
        font-size: max(0.875em, 0.875rem);
        width: auto;
        content: "\\00a0(" attr(title) ")";
    }

    a:not([href])[id]:not([title])[data-reedable-link-information-show-title]::after {
        font-size: inherit;
        width: auto;
        content: "\\00a0" attr(id);
    }

    a:not([href])[name]:not([id]):not([title])[data-reedable-link-information-show-title]::after {
        font-size: inherit;
        width: auto;
        content: "\\00a0" attr(name);
    }

    /*
        Link are identified by
        
            a[href]
    */

    /* Content and title are both available. Show the title in parentheses. */
    a[href][title][data-reedable-link-information-show-title]::after {
        font-size: max(0.875em, 0.875rem);
        width: auto;
        content: "\\00a0(" attr(title) ")";
    }

    /* No content or title is provided. Show href if available. */
    a[href]:not(:has(:not(:empty))):not([title])[data-reedable-link-information-show-title]::after {
        font-size: inherit;
        width: auto;
        content: "\\00a0(" attr(href) ")";
        max-width: 12em;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

const LINK_INFORMATION_ON_HOVER_TOOLTIP = `

    a[href]::after {
        position: relative;
    }

    a[href]:focus::after,
    a[href]:hover::after {
        content: "\\00a0[" attr(href) "]";
        padding: 4px 8px;
        color: #333;
        position: absolute;
        left: 0;
        top: 100%;
        white-space: nowrap;
        z-index: 20;
        border-radius: 5px;
        box-shadow: 0px 0px 4px #222;
        background-image: linear-gradient(#eeeeee, #cccccc);
    }
`;

const LINK_INFORMATION_ON_HOVER_INLINE = `
    
    a[href]:focus::after,
    a[href]:hover::after {
        content: "\\00a0" attr(title) " [" attr(href) "]";
        font-style: normal;
        overflow-wrap: anywhere;
        font-size: max(0.75em, 0.75rem);
        word-break: break-all;
    }
`;

const LINK_INFORMATION_ICON = `

    /* ++ Anchor */

    a:not([href])[id][data-reedable-link-information-show-icon]::before,
    a:not([href])[name][data-reedable-link-information-show-icon]::before {
        font-family: "Reedable FA6 Regular", "Reedable FA6 Solid", "Reedable FA6 Brands";
        font-style: normal;
        font-size: 0.875em;
        width: auto;
        content: "\\f13d"; /* fa-anchor */
    }

    /* ++ Link */

    a[data-reedable-link-information-show-icon][href]::before {
        font-family: "Reedable FA6 Regular", "Reedable FA6 Solid", "Reedable FA6 Brands";
        font-style: normal;
        font-size: 0.875em;
        width: auto;
    }

    a[data-reedable-link-information-show-icon][href] * {
        position: initial;
    }

    a[data-reedable-link-information-show-icon][href^="#"]::before {
        content: "\\23\\00a0"; /* fa-hashtag */
    }

    a[data-reedable-link-information-show-icon][href^="http:"]::before,
    a[data-reedable-link-information-show-icon][href^="https:"]::before {
        content: "\\f0c1\\00a0"; /* fa-link */
    }

    a[data-reedable-link-information-show-icon][href^="ftp:"]::before,
    a[data-reedable-link-information-show-icon][href^="sftp:"]::before {
        content: "\\f15b\\00a0"; /* fa-file */
    }

    a[data-reedable-link-information-show-icon][href^="mailto:"]::before {
        content: "\\f0e0\\00a0"; /* fa-envelope */
    }

    a[data-reedable-link-information-show-icon][href^="tel:"]::before,
    a[data-reedable-link-information-show-icon][href^="wtai:"]::before {
        content: "\\f095\\00a0"; /* fa-phone */
    }

    a[data-reedable-link-information-show-icon][href^="bitcoin:"]::before {
        content: "\\f379\\00a0"; /* fa-bitcoin */
    }

    a[data-reedable-link-information-show-icon][href^="geo:"]::before {
        content: "\\f14e\\00a0"; /* fa-compass */
    }

    a[data-reedable-link-information-show-icon][href^="im:"]::before,
    a[data-reedable-link-information-show-icon][href^="irc:"]::before,
    a[data-reedable-link-information-show-icon][href^="ircs:"]::before,
    a[data-reedable-link-information-show-icon][href^="xmpp:"]::before {
        content: "\\f4ad\\00a0"; /* fa-comment-dots */
    }

    a[data-reedable-link-information-show-icon][href^="magnet:"]::before,
    a[data-reedable-link-information-show-icon][href^="urn:"]::before {
        content: "\\f15b\\00a0"; /* fa-file */
    }
    
    a[data-reedable-link-information-show-icon][href^="news:"]::before,
    a[data-reedable-link-information-show-icon][href^="nntp:"]::before {
        content: "\\f086\\00a0"; /* fa-comments */
    }

    a[data-reedable-link-information-show-icon][href^="sms:"]::before,
    a[data-reedable-link-information-show-icon][href^="smsto:"]::before {
        content: "\\f7cd\\00a0"; /* fa-comment-sms */
    }

    a[data-reedable-link-information-show-icon][href^="ssh:"]::before {
        content: "\\f120\\00a0"; /* fa-terminal */
    }

    a[data-reedable-link-information-show-icon][href^="webcal:"]::before {
        content: "\\f133\\00a0"; /* fa-calendar */
    }
`;

export class LinkInformationEngine extends Engine {

    static getInstance() {

        if (!this.instance) {
            this.instance = new LinkInformationEngine();
        }

        return this.instance;
    }

    constructor() {
        super("linkInformation");
    }

    async start(documentFragment) {

        await super.start(documentFragment);

        if (documentFragment) {

            let style = documentFragment.querySelector("#reedableLinkInformationStyle");

            if (!style) {

                style = documentFragment.createElement("style");
                style.id = "reedableLinkInformationStyle";

                style.appendChild(documentFragment.createTextNode(FONT_FACE_CSS));
                style.appendChild(documentFragment.createTextNode(LINK_INFORMATION));
                style.appendChild(documentFragment.createTextNode(LINK_INFORMATION_ICON));

                (documentFragment.head || documentFragment).appendChild(style);
            }
        }
    }

    async stop(documentFragment) {

        await super.stop(documentFragment);

        if (documentFragment) {

            const style = documentFragment.querySelector("#reedableLinkInformationStyle");

            if (style) {
                style.remove();
            }
        }
    }

    _filterNode(node) {
        return (node.tagName === "A");
    }

    async _processNode(node, linkInformation) {

        if (linkInformation.showTitle) {
            node.dataset.reedableLinkInformationShowTitle = "";
        } else {
            delete node.dataset.reedableLinkInformationShowTitle;
        }

        if (linkInformation.showIcon) {
            node.dataset.reedableLinkInformationShowIcon = "";
        } else {
            delete node.dataset.reedableLinkInformationShowIcon;
        }
    }

    async _restoreNode(node) {
        delete node.dataset.reedableLinkInformationShowTitle;
        delete node.dataset.reedableLinkInformationShowIcon;
    }
}