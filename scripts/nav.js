import { zoomIn, zoomOut } from "./three.js";

let navTitle = $('#nav-title');
let navLinks = $('.nav-link');
let navHome = $('#nav-home');
let navAbout = $('#nav-about');
let navProjects = $('#nav-projects');
let tick = false;
let scrollTimeout;
let tickTimeout;

export const setActive = (selected) => {
    $.each(navLinks, (i) => {
        $(navLinks[i]).removeClass('active');
        if (selected === i) {
            $(navLinks[i]).addClass('active');
        }
    });
}

navHome.on('click', (e) => {
    content.scrollTop(0);
    if(content.css('display') === 'block'){
        zoomOut(10)
    }
});

navAbout.on('click', (e) => {
    if(content.css('display') === 'none'){
        zoomIn();
    }
    content.scrollTop(0);
})

navProjects.on('click', (e) => {
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

content.on('scroll', (e) => {
    if(!tick) {
        clearTimeout(tickTimeout);
        tick = true;
        let aboutPos = aboutDiv.position().top
        let projectPos = projectsDiv.position().top
        if(aboutPos <= 0 && projectPos > 0){
            setActive(1)
        }
        else if(projectPos <= 0 && content.height() < aboutDiv.height() + projectsDiv.height() - content.scrollTop() - 10) {
            setActive(2)
        }
        else if(content.css('display') === 'none'){
            setActive(0)
        }
        if (content.height() > aboutDiv.height() + projectsDiv.height() - content.scrollTop() - 10) {
            setActive(2)
        }
        tickTimeout = setTimeout(() => {
            tick = false;
        }, 0.5);
    }
});

clearTimeout(scrollTimeout);
clearTimeout(tickTimeout);
