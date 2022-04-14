class Scrollspy extends HTMLElement {

  anchorsMap = new Map();
  targetsNodeList = document.querySelectorAll(this.getAttribute('target-selector'));

  #shadowRoot;
  #intersectionObserver;

  static style = `
    :host {
      font-size: 1rem;
      position: fixed;
      right: 0;
    }

    aside {
      background-color: transparent;
      padding: 0.5em 1.5em;
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

    this.#shadowRoot = this.attachShadow({ mode: 'closed' });

    const aside = document.createElement('aside');
    const header = document.createElement('header');
    const ul = document.createElement('ul');
    header.innerHTML = `<h3>${this.getAttribute('heading-text')}</h3>`;
    aside.append(header);

    for (const heading of this.targetsNodeList) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      const id = heading.getAttribute('id');
      a.href = `#${id}`;
      a.innerText = heading.innerText;
      this.anchorsMap.set(id, a);
      li.append(a);
      ul.append(li);
    }

    aside.append(ul);

    const style = document.createElement('style');
    style.textContent = Scrollspy.style;
    this.#shadowRoot.append(style, aside);
    this.#intersectionObserver = new IntersectionObserver(this.intersectionObserverCallback.bind(this), { threshold: 1 });
  }

  connectedCallback() {
    this.targetsNodeList.forEach(element => this.#intersectionObserver.observe(element));
  }

  disconnectedCallback() {
    this.targetsNodeList.forEach(element => this.#intersectionObserver.unobserve(element));
  }

  intersectionObserverCallback(entries) {
    entries.forEach(({ intersectionRatio, target }) => this.anchorsMap.get(target.id).className = intersectionRatio === 1 ? 'active' : '');
  }

}

customElements.define('wc-scrollspy', Scrollspy);
