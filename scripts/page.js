let content = $('#content');
let projectsDiv = $('#projects');
let creditDiv = $('#credits');

const projects = async () => {
    let response = await fetch('../public/data/projects.json');
    let data = await response.json();
    let { projects } = data;

    let projectCards = '';
    for(let i = 0; i < projects.length; i++){
        let { name, description, image, link } = projects[i];

        projectCards += `
                        <div class="col-12 col-md-6 col-xl-4 mt-3">
                            <div class="card w-100">
                              <div class="card-header">
                                ${name}
                              </div>
                              <div class="card-body">
                                <img src="${image}" class="" alt="${name} image">
                                <p class="card-text">${description}</p>
                                <a href="${link}" class="btn btn-primary">GitHub</a>
                              </div>
                            </div>
                        </div>`;
    }
    projectsDiv.html(`<h1 class="w-100 text-center border-bottom border-dark">Projects</h1>`);
    projectsDiv.append(projectCards);
}

const credits = async () => {
    let response = await fetch('../public/data/credits.json');
    let data = await response.json();
    let { credits } = data;
    let creditText = ``;

    for(let i = 0; i < credits.length; i++){
        let { credit } = credits[i];
        creditText += `<p class="text-white">${credit}</p>`
    }
    creditDiv.html(`<h1 class="w-100 text-center border-bottom border-light text-white">Credits</h1>`);
    creditDiv.append(creditText);
}

const overflow = () => {
    content.css('overflow-y', 'auto');
}

const displayContent = () => {
    projects();
    credits();
    overflow();
}