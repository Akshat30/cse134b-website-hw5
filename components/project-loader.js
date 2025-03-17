// this file is used to load project data from local storage or JSONBin and display them as project-cards on the projects page
// JSONBin.io (https://jsonbin.io/api-reference) was used to store my data regarding projects

document.addEventListener('DOMContentLoaded', () => {
  // grabbing the project section (to add/delete from), and the buttons (to listen for a click)
  const projectSection = document.getElementById('project-section');
  const localButton = document.getElementById('load-local');
  const remoteButton = document.getElementById('load-remote');

  // simple function that removes any content inside the project section, using this function makes the code more human readable
  // also removes the no projects to display message
  function clearProjectSection() {
    projectSection.innerHTML = '';
    const noProjectsDisplay = document.getElementById('no-projects-display');
    if (noProjectsDisplay) {
      noProjectsDisplay.remove();
    }
  }

  // this function alerts the user that no projects were found at the inputted location and also displays it on the page
  function noProjectsToDisplay(location) {
    // alert user that no projects were found
    alert('⚠️ No projects found in ' + location);

    // add a note in projects section that there are no projects to display, after first checking if it doesn't exist
    // style applied to className from projects.css
    if (!document.getElementById('no-projects-display')) {
      // create an element to display the message
      const noProjectsParagraph = document.createElement('p');
      noProjectsParagraph.textContent =
        location + ' has no projects to display :(';
      noProjectsParagraph.id = 'no-projects-display';

      // add it after the container holding the buttons
      const buttonContainer =
        document.getElementsByClassName('button-container')[0]; // need to index [0] since getting by classname returns a list
      buttonContainer.after(noProjectsParagraph);
    }
  }

  // takes an object project (containing the JSON data for a project), converts it to a project-card element, and adds it into projectSection so that it can be displayed
  function addProjectCard(project) {
    const card = document.createElement('project-card');
    card.setAttribute('title', project.title);
    card.setAttribute('small-img', project.smallImg);
    card.setAttribute('big-img', project.bigImg);
    card.setAttribute('alt', project.alt);
    card.setAttribute('description', project.description);
    card.setAttribute('technologies', project.technologies);
    card.setAttribute('link', project.link);

    // since note might not exist for a project of mine
    if (project.note) {
      card.setAttribute('note', project.note);
    }

    // add the project-card to the projectSection div in the projects page
    projectSection.appendChild(card);
  }

  // this function loads the project data from local stoage and has functionality for the case where local storage does not have any projects
  function loadLocalStorageProjects() {
    clearProjectSection();

    // read the JSON data regarding projects from localStorage
    const localStorageProjects = JSON.parse(localStorage.getItem('projects'));

    if (!localStorageProjects) {
      noProjectsToDisplay('Local Storage'); // if no projects, call function to display message
    } else {
      // if there are projects, call addProjectCard for each project in localStorageProjects
      localStorageProjects.forEach(addProjectCard);
    }
  }

  // the url that allows me to fetch my preloaded data from JSONBin
  const JSONBIN_URL =
    'https://api.jsonbin.io/v3/b/67d5825b8561e97a50ec790b/latest';

  // this function loads the project data from JSONBin and has functionality for the case where there is an error or no projects were fetched
  async function loadRemoteProjects() {
    clearProjectSection();

    // fetch from the URL defined above, and pass the master key as authentication
    try {
      const response = await fetch(JSONBIN_URL, {
        headers: {
          'X-Master-Key':
            '$2a$10$Fal7pfgw.g7jQliyhlXkQO5nSq0bcTf7Z1sURFvsdtkuOIIo8Uxr.', // add key to .env as a potential enhancement in the future (or part 3)
        },
      });

      const data = await response.json();
      const remoteProjects = data.record; // since JSONBin stores the data in record

      if (!remoteProjects) {
        noProjectsToDisplay('Remote JSONBin'); // if no projects, display alert and message
      } else {
        // if there are projects, call addProjectCard for each project fetched from JSONBin
        remoteProjects.forEach(addProjectCard);
      }
    } catch (error) {
      // if there is any error in trying to fetch from JSONBin, display the error in console and alert the useer
      console.error('remote projects did not fetch, here is the error:', error);
      alert('⚠️ Failed to fetch the remote projects from JSONBin.');
    }
  }

  // Add listeners to the buttons to call the respective function if a click occurs
  localButton.addEventListener('click', loadLocalStorageProjects);
  remoteButton.addEventListener('click', loadRemoteProjects);
});
