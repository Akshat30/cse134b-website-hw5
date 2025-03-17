// my custom project-card for displaying my projects, based on my original hard coded elements in ../career/projects.html
// https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements this resource was helpful

// project card object
class ProjectCard extends HTMLElement {
  constructor() {
    super();
    // use shadow to separate the project-card from everything else, in terms of css
    this.attachShadow({ mode: 'open' });

    // use the template tag to create this custom project-card, starting with the style
    const template = document.createElement('template');

    // the css below is similar to what I had coded for my project card
    template.innerHTML = `
      <style>
        :host {
          display: block;
          overflow: hidden;
        }

        .project-card {
          background-color: var(--card-background, blue);
          color: white;
          padding: 1.25rem;
          border-radius: 0.75rem;
          word-wrap: break-word;
          overflow: hidden;
        }

        .project-card h3 {
          font-size: 1.5em;
          margin-top: 0.4rem;
          margin-bottom: 0.7rem;
          color: var(--green-accent, yellow);
        }

        .project-card p {
          font-size: 1em;
          margin-bottom: 0.6rem;
          color: var(--text-color, white);
        }

        .project-card strong {
          color: var(--green-accent, yellow);
        }

        .project-card a {
          color: var(--special-hyperlink, blue);
          text-decoration: none;
          font-weight: bold;
        }

        .project-card a:hover {
          text-decoration: underline;
        }

        picture img {
          width: 100%; 
          object-fit: cover; 
          border-radius: 0.5rem;
          color: var(--text-color, black);
        }

        @media (max-width: 768px) {
          .project-card {
            max-width: 95%;
          }
        }
      </style>

      <article class="project-card">
        <picture>
          <source media="(max-width: 767px)" srcset="" class="small-img" />
          <source media="(min-width: 768px)" srcset="" class="big-img" />
          <img src="" alt="" class="main-img" />
        </picture>
        <h3></h3>
        <p class="description"></p>
        <p><strong>technologies used:</strong> <span class="technologies"></span></p>
        <p><a class="project-link" target="_blank">project link</a></p>
        <p class="note"><em></em></p>
      </article>
    `;
    // the last parts above is the actual html for the card, similar to what i had hard coded

    // add this card to the shadow tree
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  // a list of the attributes that the custom element project-card has
  static get observedAttributes() {
    return [
      'title',
      'small-img',
      'big-img',
      'alt',
      'description',
      'technologies',
      'link',
      'note',
    ];
  }

  // function that gets called anytime an attribute is set or changed
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return; // no need to change

    // fetching the elements by query for modification
    const smallImg = this.shadowRoot.querySelector('.small-img');
    const bigImg = this.shadowRoot.querySelector('.big-img');
    const mainImg = this.shadowRoot.querySelector('.main-img');
    const h3 = this.shadowRoot.querySelector('h3');
    const description = this.shadowRoot.querySelector('.description');
    const technologies = this.shadowRoot.querySelector('.technologies');
    const projectLink = this.shadowRoot.querySelector('.project-link');
    const note = this.shadowRoot.querySelector('.note em');

    // updating the necessary attribute based on which one was changed
    if (name === 'title') h3.textContent = newValue;
    if (name === 'small-img') smallImg.srcset = newValue;
    if (name === 'big-img') {
      bigImg.srcset = newValue;
      mainImg.src = newValue;
    }
    if (name === 'alt') {
      mainImg.alt = newValue || 'no alt text for this image';
    }
    if (name === 'description') description.textContent = newValue;
    if (name === 'technologies') technologies.textContent = newValue;
    if (name === 'link') {
      projectLink.href = newValue; // updates the link
      projectLink.textContent = 'project link'; // hard coded since it'll all be the same
    }

    // if note doesn't exist, then don't show the note element
    if (name === 'note') {
      if (newValue.trim()) {
        note.textContent = newValue;
        this.shadowRoot.querySelector('.note').style.display = 'block';
      } else {
        this.shadowRoot.querySelector('.note').style.display = 'none';
      }
    }
  }
}

// mapping the <project-card> html element to the ProjectCard class
customElements.define('project-card', ProjectCard);
