import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = $('#hero');
const contentDiv = $('#content');
const creditsBtn = $('#credits-btn');
const creditModal = new bootstrap.Modal(document.getElementById('credits-modal'), {});
const creditsText = $('#credits-text');
let width = container.width();
let height = container.height();
let aspect = width / height;
let fov;
const white = new THREE.MeshBasicMaterial( { color: 0xffffff } );
const gray = new THREE.MeshBasicMaterial( { color: 0x808080 } );
let chair;
let chairLoad = false;
let deskLoad = false;
let monitorLoad = false;
let computerLoad = false;
let lock = false;
let waitCount = 0;
let touchStart = 0;
const animTime = 1.2;

const calcFov = () => {
    if (aspect < 0.5) {
        fov = 90;
    }
    else if (aspect < 1) {
        fov = 75;
    }
    else {
        fov = 60;
    }
}

calcFov();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( fov, aspect, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( width, height );
container.append( renderer.domElement );

const geometry = new THREE.PlaneGeometry( 0.67, 0.36 );
const material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometry, material );
plane.position.set(0,1.06,0);
scene.add( plane );

const manager = new THREE.LoadingManager();
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
    console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};

manager.onLoad = function ( ) {
    let loading = $('#loading');
    loading.fadeOut(400, () => {
        loading.remove();
    });
    console.log( 'Loading complete!');
    displayContent();
};

manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};

manager.onError = function ( url ) {
    console.log( 'There was an error loading ' + url );
};

const loader = new GLTFLoader(manager);

const loadFiles = async () => {

    loader.load('../public/models/computer_desk.glb', function (gltf) {
        deskLoad = true;
        const desk = gltf.scene;
        desk.position.set(0, 0, 0);
        desk.traverse((o) => {
            if (o.isMesh) o.material = gray;
        });
        scene.add(desk);

    },
        // called while loading is progressing
        function ( xhr ) {

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );

        }
    );

    loader.load('../public/models/computer_monitor.glb', function (gltf) {
        monitorLoad = true;
        const monitor = gltf.scene;
        monitor.position.set(0, 0.74, 0);
        monitor.scale.set(0.1, 0.1, 0.1);
        monitor.traverse((o) => {
            if (o.isMesh) o.material = white;
        });
        scene.add(monitor);

    });

    await loader.load('../public/models/computer.glb', function (gltf) {
        computerLoad = true;
        const computer = gltf.scene;
        computer.position.set(-0.68, 0.90, 0.2);
        computer.scale.set(0.15, 0.15, 0.15);
        computer.traverse((o) => {
            if (o.isMesh) o.material = white;
        });
        scene.add(computer);

    });

    loader.load('../public/models/desk_chair.glb', function (gltf) {
        chairLoad = true;
        chair = gltf.scene;
        chair.position.set(0.5, -0.05, 0.95);
        chair.rotation.y = -2.3;
        chair.scale.set(0.08, 0.08, 0.08);
        chair.traverse((o) => {
            if (o.isMesh) o.material = gray;
        });
        scene.add(chair);

    });
}

loadFiles();

camera.position.z = 2.5;
camera.position.y = 1.2;
camera.rotation.x = -0.3;


function animate() {
    renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );

const resizeContainer = () => {
    width = container.width();
    height = container.height();
    aspect = width / height;
    calcFov()
    renderer.setSize( width, height );
    camera.aspect = aspect;
    camera.fov = fov;
    camera.updateProjectionMatrix();
    renderer.render( scene, camera );
}

export const zoomIn = () => {
    const cameraZEnd = 0.25;
    const cameraYEnd = 1.053;
    const rotationXEnd = 0;
    const chairXEnd = 0;
    const chairRotEnd = -Math.PI;
    displayContent();
    if (!lock) {
        lock = true;
        gsap.to(chair.position, {x: chairXEnd, duration: animTime});
        gsap.to(chair.rotation, {y:chairRotEnd, duration: animTime});
        gsap.to(camera.position, {z: cameraZEnd, y: cameraYEnd, duration: animTime});
        gsap.to(camera.rotation, {
            x: rotationXEnd, duration: animTime, onComplete: () => {
                contentDiv.fadeIn(1000, () => {
                    lock = false;
                });
            }
        });
    }
}

export const zoomOut = (override = 0) => {
    if(override) {
        waitCount = override;
    }
    const cameraZStart = 2.5;
    const cameraYStart = 1.2;
    const rotationXStart = -0.3;
    const chairXStart = 0.5;
    const chairRotStart = -2.3;
    if(!lock) {
        waitCount++;
        if(waitCount >= 10) {
            waitCount = 0;
            lock = true;
            if (contentDiv.css('display') === 'block') {
                contentDiv.fadeOut(800);
            }
            gsap.to(camera.position, {
                duration: 0.8, onComplete: () => {
                    gsap.to(chair.position, {x: chairXStart, ease: "power2.out", duration: animTime});
                    gsap.to(chair.rotation, {y: chairRotStart, ease: "power2.out", duration: animTime});
                    gsap.to(camera.position, {z: cameraZStart, y: cameraYStart, duration: animTime});
                    gsap.to(camera.rotation, {x: rotationXStart, duration: animTime});
                    lock = false;
                }
            });
        }
    }
}

window.addEventListener("resize", resizeContainer);

addEventListener('touchstart', (event) => {
    touchStart = event.touches[0].clientY;
});

addEventListener('touchmove', (event) => {
    const touchCurrent = event.touches[0].clientY;
    if(touchStart - touchCurrent > 0) {
        waitCount = 0;
        zoomIn();
    }
    else if(touchStart - touchCurrent < 0 && contentDiv.scrollTop() === 0) {
        zoomOut()
    }
    touchStart = touchCurrent;
})

addEventListener("wheel", (event) => {
    if(event.deltaY > 0 && contentDiv.scrollTop() === 0) {
        waitCount = 0;
        zoomIn()
    }
    else if(event.deltaY < 0 && contentDiv.scrollTop() === 0) {
        zoomOut()
    }
});

creditsBtn.on('click', async (event) => {
    let response = await fetch('../public/data/credits.json');
    let data = await response.json();
    let { credits } = data;
    let creditText = ``;

    for(let i = 0; i < credits.length; i++){
        let { credit, link } = credits[i];
        creditText += `<p class="text-white credit">${credit} (<a class="link-secondary link-offset-2 link-underline link-underline-opacity-0 link-underline-opacity-75-hover" href="${link}">${link}</a>).</p>`
    }

    creditsText.html(creditText);
    creditModal.show()

})
$(() => {
    window.scroll(0, 0);
});