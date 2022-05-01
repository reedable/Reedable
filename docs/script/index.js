class LocalizedNumber extends HTMLElement { //HTMLSpanElement {

  constructor() {
    super();

    const textContent = this.textContent;

    if (textContent && !isNaN(textContent)) {
      const lang = this.getAttribute("lang") || navigator.language;
      const dataset = this.dataset;
      const options = Object.assign({}, dataset);

      // TODO Cache format object for performance
      const fmt = new Intl.NumberFormat(lang, options);

      this.textContent = fmt.format(Number(textContent));
      this.setAttribute("lang", lang);
    }
  }
}

class LocalizedDateTime extends HTMLTimeElement {

  constructor() {
    super();

    const textContent = this.getAttribute("datetime");

    if (textContent) {
      const lang = this.getAttribute("lang") || navigator.language;
      const dataset = this.dataset;
      const options = Object.assign({}, dataset);

      // TODO Cache format object for performance
      const fmt = new Intl.DateTimeFormat(lang, options);

      this.textContent = fmt.format(new Date(textContent));
      this.setAttribute("lang", lang);
    }
  }
}

customElements.define('localized-number', LocalizedNumber); //, { extends: 'span' });
customElements.define('localized-datetime', LocalizedDateTime, { extends: 'time' });