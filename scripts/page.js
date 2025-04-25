const content = $('#content');
const aboutDiv = $('#about');
const projectsDiv = $('#projects');

const about = () => {
    aboutDiv.html(`
                                   <div class="about-col col-12 col-md-6 d-flex flex-column justify-content-center align-items-center" id="about-text">
                                     <h3>About Title</h3>
                                     <p>about text</p>
                                   </div>
                                   <div class="about-col col-12 col-md-6 d-flex justify-content-center align-items-center" id="about-image">
                                     <img class="border rounded-circle" src="./public/images/max.jpg" alt="Photo of Max Sainsbury" id="about-photo">
                                   </div>`);
}

const projects = async () => {
    let response = await fetch('../public/data/projects.json');
    let data = await response.json();
    let { projects } = data;

    let projectCards = '';
    for(let i = 0; i < projects.length; i++){
        let { name, description, image, link } = projects[i];

        projectCards += `
                        <div class="project-col col-12 col-md-6 col-xl-4 mb-3">
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
    projectsDiv.html(`
                                      <h1 class="w-100 mb-4 text-center border-bottom border-top border-light text-white">Projects</h1>
                                      <div class="row" id="card-box"></div>`);
    $('#card-box').html(projectCards);
}

const displayContent = () => {
    let navbar = document.getElementById('nav');
    let footer = document.getElementById('footer');
    content.css('top', `${navbar.offsetHeight}px`);
    content.css('height', `${window.innerHeight - (navbar.offsetHeight + footer.offsetHeight)}px`);
    about();
    projects();
    content.css('overflow-y', 'auto');

}