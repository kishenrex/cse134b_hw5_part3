class ProjectCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // The template is defined in index.html.
    const template = document.getElementById('project-card-template');
    if (template) {
      const content = template.content.cloneNode(true);
      this.shadowRoot.appendChild(content);
    } else {
      console.error('Project Card Template not found!');
    }
  }

  set data(project) {
    requestAnimationFrame(() => {
      const shadow = this.shadowRoot;

      shadow.querySelector('.card__title').textContent = project.title;
      shadow.querySelector('.card__description').textContent = project.description;
      shadow.querySelector('.card__link').href = project.link;

      const picture = shadow.querySelector('picture');
      const image = shadow.querySelector('.card__image');
      image.src = project.imageUrl;
      image.alt = project.imageAlt || `Preview image for ${project.title}`;

      picture.querySelectorAll('source').forEach(source => source.remove());

      if (project.imageSources) {
        project.imageSources.forEach(sourceData => {
          const source = document.createElement('source');
          source.srcset = sourceData.srcset;
          if (sourceData.media) {
            source.media = sourceData.media;
          }
          if (sourceData.type) {
            source.type = sourceData.type;
          }
          // Prepend to ensure <source> comes before <img>
          picture.prepend(source);
        });
      }
    });
  }
}

customElements.define('project-card', ProjectCard);

const LOCAL_STORAGE_KEY = 'projects';
const REMOTE_PROJECTS_URL = 'https://api.jsonbin.io/v3/b/6931091ed0ea881f4011af55/latest';

function seedLocalStorage() {
  if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
    const localProjects = [
      {
        title: "Nightly - Sleep Tracking App",
        description: "A progressive web application designed to help users track their sleep patterns and improve sleep quality. Built with React and Tailwind.",
        link: "https://github.com/kishenrex/nightly",
        imageUrl: "./assets/images/nightly_sample.png",
        imageAlt: "A preview of the Nightly sleep tracking application dashboard.",
        imageSources: [
          {
            "srcset": "./assets/images/nightly_sample.png",
            "type": "image/png"
          }
        ]
      },
      {
        title: "AME at UCSD website",
        description: "The main club website for the Anime and Manga Enthusiasts at UC San Diego. It contains the link to their Discord and historical facts about the club.",
        link: "https://ameatucsd.org/",
        imageUrl: "assets/images/ame_website.png",
        imageAlt: "Screenshot of the AME website homepage",
        imageSources: [
          {
            "srcset": "assets/images/ame_website.png",
            "type": "image/png"
          }
        ]
      },
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localProjects));
  }
}


function renderProjects(projectsData) {
  const container = document.getElementById('project-card-container');
  if (!container) {
    console.error('Project card container not found!');
    return;
  }
  // Clear existing cards before rendering new ones
  container.innerHTML = '';

  if (!projectsData || projectsData.length === 0) {
    container.innerHTML = '<p>No projects to display.</p>';
    return;
  }

  projectsData.forEach(projectData => {
    const card = document.createElement('project-card');
    card.data = projectData;
    container.appendChild(card);
  });
}


function loadLocalProjects() {
  const projectsJson = localStorage.getItem(LOCAL_STORAGE_KEY);
  try {
    const projects = JSON.parse(projectsJson) || [];
    renderProjects(projects);
  } catch (e) {
    console.error('Error parsing local project data:', e);
    renderProjects([]); // Clear the container on error
  }
}

async function loadRemoteProjects() {
  const container = document.getElementById('project-card-container');
  container.innerHTML = '<p>Loading remote projects...</p>';
  try {
    const response = await fetch(REMOTE_PROJECTS_URL);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    renderProjects(data.record);
  } catch (error) {
    console.error('Failed to fetch remote projects:', error);
    container.innerHTML = '<p class="error">Failed to load remote projects. Please try again later.</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('load-local-btn').addEventListener('click', loadLocalProjects);
  document.getElementById('load-remote-btn').addEventListener('click', loadRemoteProjects);

  seedLocalStorage();
  loadLocalProjects();
});