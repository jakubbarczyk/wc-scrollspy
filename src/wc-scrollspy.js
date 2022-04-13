export class Scrollspy extends HTMLElement {

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'closed' });
    const aside = document.createElement('aside');
    const headings = document.querySelectorAll('h2[id]');
    const headingsArray = Array.from(headings);

    aside.innerHTML = `
          <header>
              <h3>${this.getAttribute('name')}</h3>
          </header>
          <ul>
              ${headingsArray.map(h => `<li><a href="#${h.getAttribute('id')}">${h.innerText}</a></li>`).join('')}
          </ul>
      `;

    const style = document.createElement('style');

    style.textContent = `
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
            border-left: 2px solid red;
            display: block;
            padding: 0.5rem 1rem;
            text-decoration: none;
          }
      `;

    shadowRoot.append(style, aside);
  }

}
