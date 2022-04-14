class Scrollspy extends HTMLElement {

  anchorsMap = new Map();
  targetsNodeList = document.querySelectorAll(this.getAttribute('target-selector'));

  #shadowRoot;
  #intersectionObserver;

  static style = `
    aside {
      background-color: #f0f0f0;
    }

    ul {
      list-style: none;
      padding-left: 0;
    }

    li {
      margin: 0;
    }

    a {
      background-color: transparent;
      border-left: 4px solid lightblue;
      display: block;
      padding: 0.5rem 1rem;
      text-decoration: none;
    }

    .active {
      border-left: 4px solid blue;
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
      a.href = id;
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
    this.targetsNodeList.forEach(element => {
      this.#intersectionObserver.observe(element);
    });
  }

  disconnectedCallback() {
    this.targetsNodeList.forEach(element => {
      this.#intersectionObserver.unobserve(element);
    });
  }

  intersectionObserverCallback(entries) {
    entries.forEach(({ intersectionRatio, target }) => {
      this.anchorsMap.get(target.id).className = intersectionRatio === 1 ? 'active' : '';
    });
  }

}

customElements.define('wc-scrollspy', Scrollspy);
