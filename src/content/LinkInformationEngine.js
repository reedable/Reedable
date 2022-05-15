import { Engine } from "../../modules/Reedable-core/content/Engine";
//import { DOM } from "../../modules/Reedable-core/ui/DOM";

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

        /* No content, no title. Show href if available */
        a:not([title])[href]:empty::after {
            content: "\\00a0" attr(href);
        }

        /* Content and title are both available. Show the title in parentheses. */
        a[title]::after {
            font-size: max(0.875em, 0.875rem);
            content: "\\00a0(" attr(title) ")";
        }

        /* No content but title is provided. Show the title without parentheses. */
        a[title]:empty::after {
            font-size: inherit;
            content: "\\00a0" attr(title);
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
    
    a[href] {
        transition: all .3s ease;
    }

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

    a[href]::before {
        font-family: "Reedable FA6 Regular", "Reedable FA6 Solid", "Reedable FA6 Brands";
        font-style: normal;
        font-size: 0.875em;
    }

    a[href^="#"]::before {
        content: "\\23\\00a0"; /* fa-hashtag */
    }

    a[href^="http:"]::before,
    a[href^="https:"]::before {
        content: "\\f0c1\\00a0"; /* fa-link */
    }

    a[href^="ftp:"]::before,
    a[href^="sftp:"]::before {
        content: "\\f15b\\00a0"; /* fa-file */
    }

    a[href^="mailto:"]::before {
        content: "\\f0e0\\00a0"; /* fa-envelope */
    }

    a[href^="tel:"]::before,
    a[href^="wtai:"]::before {
        content: "\\f095\\00a0"; /* fa-phone */
    }

    a[href^="bitcoin:"]::before {
        content: "\\f379\\00a0"; /* fa-bitcoin */
    }

    a[href^="geo:"]::before {
        content: "\\f14e\\00a0"; /* fa-compass */
    }

    a[href^="im:"]::before,
    a[href^="irc:"]::before,
    a[href^="ircs:"]::before,
    a[href^="xmpp:"]::before {
        content: "\\f4ad\\00a0"; /* fa-comment-dots */
    }

    a[href^="magnet:"]::before,
    a[href^="urn:"]::before {
        content: "\\f15b\\00a0"; /* fa-file */
    }
    
    a[href^="news:"]::before,
    a[href^="nntp:"]::before {
        content: "\\f086\\00a0"; /* fa-comments */
    }

    a[href^="sms:"]::before,
    a[href^="smsto:"]::before {
        content: "\\f7cd\\00a0"; /* fa-comment-sms */
    }

    a[href^="ssh:"]::before {
        content: "\\f120\\00a0"; /* fa-terminal */
    }

    a[href^="webcal:"]::before {
        content: "\\f133\\00a0"; /* fa-calendar */
    }
    */
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

            let style = documentFragment.querySelector("#reedableFontAwesome");

            if (!style) {

                style = documentFragment.createElement("style");
                style.id = "reedableFontAwesome";

                // Include when linkInformation is enabled
                style.appendChild(documentFragment.createTextNode(LINK_INFORMATION));

                // Include when onHover/onFocus feature is enabled
                //style.appendChild(documentFragment.createTextNode(LINK_INFORMATION_ON_HOVER_INLINE));

                // Include when icon is enabled
                style.appendChild(documentFragment.createTextNode(FONT_FACE_CSS));
                style.appendChild(documentFragment.createTextNode(LINK_INFORMATION_ICON));

                (documentFragment.head || documentFragment).appendChild(style);
            }
        }
    }

    async stop(documentFragment) {

        await super.stop(documentFragment);

        if (documentFragment) {

            const style = documentFragment.querySelector("#reedableFontAwesome");

            if (style) {
                style.remove();
            }
        }
    }
}