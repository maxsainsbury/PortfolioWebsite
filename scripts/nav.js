import { zoomIn, zoomOut } from "./three.js";

let navTitle = $('#nav-title');
let navLinks = $('.nav-link');
let navHome = $('#nav-home');
let navAbout = $('#nav-about');
let navProjects = $('#nav-projects');
let scrollTimeout;

const setActive = (selected) => {
    $.each(navLinks, (i) => {
        $(navLinks[i]).removeClass('active');
        if (selected === i) {
            $(navLinks[i]).addClass('active');
        }
    })
}

navHome.on('click', (e) => {
    setActive(0);
    content.scrollTop(0);
    if(content.css('display') === 'block'){
        zoomOut(10)
    }
});

navAbout.on('click', (e) => {
    setActive(1);
    if(content.css('display') === 'none'){
        zoomIn();
    }
    content.scrollTop(0);
})

navProjects.on('click', (e) => {
    setActive(2);
    clearTimeout(scrollTimeout);
    if(content.css('display') === 'none'){
        zoomIn();
        scrollTimeout = setTimeout(() => {
            content.scrollTop(projectsDiv.position().top - aboutDiv.position().top);
        }, 2000);
    }
    else {
        console.log(aboutDiv.position().top);
        content.scrollTop(projectsDiv.position().top - aboutDiv.position().top);
    }
});

clearTimeout(scrollTimeout);
