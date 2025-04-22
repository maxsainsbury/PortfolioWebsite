import { zoomIn, zoomOut } from "./three.js";

let navTitle = $('#nav-title');
let navHome = $('#nav-home');
let navProjects = $('#nav-projects');
let scrollTimeout;

navHome.on('click', (e) => {
    content.scrollTop(0);
    if(content.css('display') === 'block'){
        zoomOut(10)
    }
});

navProjects.on('click', (e) => {
    if(content.css('display') === 'none'){
        zoomIn();
    }
    content.scrollTop(0);
});
