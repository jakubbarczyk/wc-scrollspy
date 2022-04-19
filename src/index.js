class Scrollspy extends HTMLElement {
  active;
  anchors = new Map();
  targets = document.querySelectorAll(this.getAttribute('target-selector'));

  #shadowRoot;
  #rootMargin = 16;
  #intersectionObserver;

  static style = `
    :host {
      background-color: transparent;
      font-size: 1rem;
      max-width: 240px;
      padding: 1em 0;
    }

    ul {
      list-style: none;
      padding-left: 0;
    }

    li {
      margin: 0;
    }

    a {
      border-left: 4px solid #e0e0e6;
      color: #5b5b66;
      display: block;
      padding: 0.5rem 1rem;
      text-decoration: none;
    }

    a:not(.active):hover {
      color: #1870f0;
    }
    
    .active {
      background-color: #1870f010;
      border-left: 4px solid #1870f0;
      color: #15141a;
    }
  `;

  constructor() {
    super();

    const header = document.createElement('header');
    const ul = document.createElement('ul');
    const style = document.createElement('style');
    const anchorsArray = [];

    for (const target of this.targets) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      const id = target.getAttribute('id');

      a.href = `#${id}`;
      a.innerText = target.innerText;

      anchorsArray.push({ id, element: a });

      li.append(a);
      ul.append(li);
    }

    header.innerHTML = `<h3>${this.getAttribute('heading-text')}</h3>`;

    style.textContent = Scrollspy.style;

    anchorsArray.forEach(({ id, element }, index, array) => {
      this.anchors.set(id, { id, element, prevElement: array[index - 1] });
    });

    this.#shadowRoot = this.attachShadow({ mode: 'closed' });
    this.#shadowRoot.append(style, header, ul);
    this.#intersectionObserver = new IntersectionObserver(this.intersectionObserverCallback.bind(this), {
      rootMargin: `-${this.#rootMargin}px`,
      threshold: 1
    });
  }

  connectedCallback() {
    this.targets.forEach(element => this.#intersectionObserver.observe(element));
  }

  disconnectedCallback() {
    this.targets.forEach(element => this.#intersectionObserver.unobserve(element));
  }

  intersectionObserverCallback(entries) {
    if (this.active) {
      for (const entry of entries) {
        this.active.element.className = '';

        if (entry.boundingClientRect.top <= entry.rootBounds.top) {
          this.active = this.anchors.get(entry.target.id);
        } else if (this.active.id === entry.target.id && this.active.prevElement) {
          this.active = this.anchors.get(this.active.prevElement.id);
        }
      }
    } else {
      this.active = this.anchors.get(entries[0].target.id);

      for (const entry of entries.reverse()) {
        if (entry.boundingClientRect.top <= entry.rootBounds.top + this.#rootMargin) {
          this.active = this.anchors.get(entry.target.id);
          break;
        }
      }
    }

    this.active.element.className = 'active';
  }
}

customElements.define('wc-scrollspy', Scrollspy);
