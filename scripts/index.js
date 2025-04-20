import * as THREE from "../node_modules/three/build/three.module.js";

const container = $('#hero');
let width = container.width();
let height = container.height();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( width, height );
container.html( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
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