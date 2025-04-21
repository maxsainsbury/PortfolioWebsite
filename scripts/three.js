import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = $('#hero');
let width = container.width();
let height = container.height();
let white = new THREE.MeshBasicMaterial( { color: 0xffffff } );
let chairLoad = false;
let deskLoad = false;
let monitorLoad = false;
let computerLoad = false;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 60, width / height, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( width, height );
container.append( renderer.domElement );

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
};

manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};

manager.onError = function ( url ) {
    console.log( 'There was an error loading ' + url );
};

const loader = new GLTFLoader(manager);

const loadFiles = async () => {

    loader.load('../public/computer_desk.glb', function (gltf) {
        deskLoad = true;
        const desk = gltf.scene;
        desk.position.set(0, 0, 0);
        desk.traverse((o) => {
            if (o.isMesh) o.material = white;
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

    loader.load('../public/computer_monitor.glb', function (gltf) {
        monitorLoad = true;
        const monitor = gltf.scene;
        monitor.position.set(0, 0.73, 0);
        monitor.scale.set(0.1, 0.1, 0.1);
        monitor.traverse((o) => {
            if (o.isMesh) o.material = white;
        });
        scene.add(monitor);

    });

    await loader.load('../public/computer.glb', function (gltf) {
        computerLoad = true;
        const computer = gltf.scene;
        computer.position.set(-0.68, 0.90, 0.2);
        computer.scale.set(0.15, 0.15, 0.15);
        computer.traverse((o) => {
            if (o.isMesh) o.material = white;
        });
        scene.add(computer);

    });

    loader.load('../public/desk_chair.glb', function (gltf) {
        chairLoad = true;
        const chair = gltf.scene;
        chair.position.set(0.5, -0.05, 0.95);
        chair.rotation.y = -2.3;
        chair.scale.set(0.08, 0.08, 0.08);
        chair.traverse((o) => {
            if (o.isMesh) o.material = white;
        });
        scene.add(chair);

    });
}

loadFiles();

camera.position.z = 3;
camera.position.y = 0.7;
camera.rotation.x = 0;

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

window.addEventListener("resize", resizeContainer);