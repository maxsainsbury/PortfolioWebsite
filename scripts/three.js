import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = $('#hero');
let contentDiv = $('#content');
let footer = $('footer');
let width = container.width();
let height = container.height();
let white = new THREE.MeshBasicMaterial( { color: 0xffffff } );
let gray = new THREE.MeshBasicMaterial( { color: 0x808080 } );
let chairLoad = false;
let deskLoad = false;
let monitorLoad = false;
let computerLoad = false;
let lock = false;
let waitCount = 0;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 60, width / height, 0.1, 1000 );

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
    displayContent();
    console.log( 'Loading complete!');
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
        const chair = gltf.scene;
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
    renderer.setSize( width, height );

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.render( scene, camera );
}

const zoomIn = () => {
    const cameraZEnd = 0.25;
    const cameraYEnd = 1.053;
    const rotationXEnd = 0;
    if(!lock) {
        lock = true;
        gsap.to(camera.position, {z: cameraZEnd, y: cameraYEnd, duration: 1.2});
        gsap.to(camera.rotation, {
            x: rotationXEnd, duration: 1.2, onComplete: () => {
                contentDiv.fadeIn(1000, () => {
                    lock = false;
                });
            }
        });
    }
}

const zoomOut = () => {
    const cameraZStart = 2.5;
    const cameraYStart = 1.2;
    const rotationXStart = -0.3;
    if(!lock) {
        console.log(waitCount);
        waitCount++;
        if(waitCount >= 10) {
            waitCount = 0;
            lock = true;
            if (contentDiv.css('display') === 'block') {
                contentDiv.fadeOut(1000);
            }
            gsap.to(camera.position, {
                duration: 1, onComplete: () => {
                    gsap.to(camera.position, {z: cameraZStart, y: cameraYStart, duration: 1.2});
                    gsap.to(camera.rotation, {x: rotationXStart, duration: 1.2});
                    lock = false;
                }
            });
        }
    }
}

window.addEventListener("resize", resizeContainer);

addEventListener("wheel", (event) => {
    if(camera.position.z > 0.3 && event.deltaY > 0) {
        zoomIn()
    }
    else if(camera.position.z < 2.5 && event.deltaY < 0 && contentDiv.scrollTop() === 0) {
        zoomOut()
    }
    if(event.deltaY > 0) {
        waitCount = 0;
    }
});

window.scroll(0,0);