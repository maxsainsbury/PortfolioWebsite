let content = $('#content');
let projectsDiv = $('#projects');

const projects = async () => {
    let response = await fetch('../public/data/projects.json');
    let data = await response.json();
    let { projects } = data;

    let projectCards = '';
    for(let i = 0; i < projects.length; i++){
        let { name, description, image, link } = projects[i];

        projectCards += `
                        <div class="card" style="width: 18rem;">
                          <div class="card-header">
                            ${name}
                          </div>
                          <div class="card-body">
                            <img src="${image}" class="" alt="${name} image"></img>
                            <p class="card-text">${description}</p>
                            <a href="${link}" class="btn btn-primary">GitHub</a>
                          </div>
                        </div>`;
    }
    projectsDiv.html(projectCards);
    $('footer').css('bottom', '0');
}