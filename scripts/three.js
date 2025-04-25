import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { setActive } from "./nav.js";

const container = $('#hero');
const contentDiv = $('#content');
const creditsBtn = $('#credits-btn');
const creditModal = new bootstrap.Modal(document.getElementById('credits-modal'), {});
const creditsText = $('#credits-text');
let width = container.width();
let height = container.height();
let aspect = width / height;
let fov;
const white = new THREE.MeshStandardMaterial( { color: 0xffffff } );
const gray = new THREE.MeshStandardMaterial( { color: 0x808080 } );
const black = new THREE.MeshStandardMaterial({ color: 0x000000 } );
const emissiveGreen = new THREE.MeshStandardMaterial( { color: 0x00ff00, emissive: 0x00ff00 } );
const emissiveRed = new THREE.MeshStandardMaterial( { color: 0xff0000, emissive: 0xff0000 } );
const emissiveWhite = new THREE.MeshStandardMaterial( { color: 0xffffff, emissive: 0xffffff } );
const screenImage = new THREE.TextureLoader().load( "../public/images/full-screen-portfolio.png" );
screenImage.repeat.set(1,1);
screenImage.colorSpace = THREE.SRGBColorSpace;
const screenMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, map: screenImage } );
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(-1,-1);
const pointerChange = new THREE.Vector2(-1,-1);
const powerLightRed = new THREE.PointLight( 0xff0000, 0.08, 0.05 );
const powerLightGreen = new THREE.PointLight( 0x00ff00, 0, 0.05 );

const screenLight = new THREE.RectAreaLight( 0xffffff, 0,  0.71, 0.36 );
screenLight.position.set(0, 1.06, 0.001);
screenLight.rotation.set(0, Math.PI, 0);
let textMesh;
let chair;
let monitor;
let computer;
let lock = false;
let waitCount = 0;
let touchStart = 0;
const animTime = 1.5;

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

const chairGroup = new THREE.Group();
chairGroup.position.set(0.4, 0.5, 0.85);
chairGroup.name = 'chair';
scene.add(chairGroup);

const buttonGroup = new THREE.Group();
const cylinder = new THREE.CylinderGeometry( 0.01, 0.01, 0.01, 32 );
const powerButton = new THREE.Mesh( cylinder, emissiveRed );
buttonGroup.add(powerLightGreen);
buttonGroup.add(powerLightRed);
buttonGroup.add(powerButton);
buttonGroup.name = 'computer';

const renderer = new THREE.WebGLRenderer();
renderer.setSize( width, height );
container.append( renderer.domElement );

const geometry = new THREE.PlaneGeometry( 0.67, 0.366 );
const screen = new THREE.Mesh( geometry, screenMaterial );
screen.position.set(0,1.065,0);
screen.name = 'screen';
scene.add( screen );

scene.add(screenLight);

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
    camera.position.z = 2.5;
    camera.position.y = 1.2;
    camera.rotation.x = -0.3;
    renderer.setAnimationLoop( animate );
    scene.updateMatrixWorld();

    window.requestAnimationFrame( animate );
    displayContent();
};

manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};

manager.onError = function ( url ) {
    console.log( 'There was an error loading ' + url );
};

const textureLoader = new GLTFLoader(manager);
const textLoader = new FontLoader();

const loadFiles = () => {

    textLoader.load(
        // resource URL
        '../public/fonts/MedievalSharp_Regular.json',

        // onLoad callback
        function ( font ) {
            // do something with the font
            let text = new TextGeometry( 'CLICK', {
                font: font,
                size: 0.1,
                depth: 0.001,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.01,
                bevelSize: 0.001,
                bevelOffset: 0,
                bevelSegments: 5
            });
            textMesh = new THREE.Mesh( text, emissiveWhite );
            textMesh.position.set(-0.18, 1, 0);
            textMesh.rotation.set(0, 0, 0);
            textMesh.name = 'screen';
        }
    )

    textureLoader.load('../public/models/computer_desk.glb', function (gltf) {
        const desk = gltf.scene;
        desk.position.set(0, 0, 0);
        desk.traverse((o) => {
            if (o.isMesh) o.material = gray;
        });
        scene.add(desk);

    });

    textureLoader.load('../public/models/computer_monitor.glb', function (gltf) {
        monitor = gltf.scene;
        monitor.position.set(0, 0.74, 0);
        monitor.scale.set(0.1, 0.1, 0.1);
        scene.add(monitor);

    });

    textureLoader.load('../public/models/computer.glb', function (gltf) {
        computer = gltf.scene;
        computer.position.set(-0.68, 0.90, 0.2);
        computer.scale.set(0.15, 0.15, 0.15);
        buttonGroup.position.set(-0.679, 0.7705, 0.34);
        buttonGroup.rotation.x = 1.57;
        computer.name = 'computer';
        scene.add(buttonGroup);
        scene.add(computer);
    });

    textureLoader.load('../public/models/desk_chair.glb', function (gltf) {
        chair = gltf.scene;
        chair.position.set(0.1, -0.55, 0.085);
        chair.rotation.y = -2.3;
        chair.scale.set(0.08, 0.08, 0.08);
        chair.name = 'chair';
        chair.traverse((o) => {
            if (o.isMesh) o.material = gray;
        });
        chairGroup.add(chair);

    });

    textureLoader.load('../public/models/keyboard.glb', function (gltf) {
        const keyboard = gltf.scene;
        keyboard.position.set(0,0.775,0.25);
        keyboard.scale.set(1.7,1.7,1.7);
        scene.add(keyboard);
    });

    textureLoader.load('../public/models/mouse.glb', function (gltf) {
        const mouse = gltf.scene;
        mouse.position.set(0.28,0.735,0.17);
        mouse.rotation.set(0,Math.PI/2,0);
        mouse.scale.set(0.03, 0.03, 0.03);
        scene.add(mouse);
    })
}

const directionalLight = new THREE.DirectionalLight( 0xffffff, 4 );
directionalLight.castShadow = true;
directionalLight.position.set( 1, 2, 5 );
directionalLight.target = screen;

scene.add( directionalLight );

const selectModel = ( event ) => {

    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function render() {
    if(contentDiv.css("display") === "none" && !lock) {
        // update the picking ray with the camera and pointer position
        raycaster.setFromCamera(pointer, camera);
        // calculate objects intersecting the picking ray
        let intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            intersects = intersects[0].object;
            while ((intersects.name !== 'chair') && (intersects.name !== 'screen') && (intersects.name !== 'computer') && (intersects.name !== 'Sketchfab_Scene')) {
                intersects = intersects.parent;
            }
            if (intersects.name === 'chair') {
                gsap.to(chairGroup.rotation, {
                    y: (Math.PI * 2), duration: 1.5, onComplete: () => {
                        chairGroup.rotation.y = 0;
                    }
                });

            } else if (intersects.name === 'screen') {
                zoomIn();
            } else if (intersects.name === 'computer') {
                changeButton();
            }
        } else {


        }
        pointer.x = -1;
        pointer.y = -1;
    }
    renderer.render( scene, camera );

}

function animate() {
    render();
}

export const resizeContainer = () => {
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
    const cameraZEnd = 0.29;
    const cameraYEnd = 1.05;
    const rotationXEnd = 0;
    const chairXEnd = 0;
    const chairRotEnd = -0.85;
    displayContent();
    if (!lock) {
        setActive(1);
        lock = true;
        gsap.to(chairGroup.position, {x: chairXEnd, duration: animTime});
        gsap.to(chairGroup.rotation, {y:chairRotEnd, duration: animTime});
        gsap.to(camera.position, {z: cameraZEnd, y: cameraYEnd, duration: animTime});
        gsap.to(camera.rotation, {
            x: rotationXEnd, duration: animTime, onComplete: () => {
                let fade = (powerButton.material === emissiveRed) ? 800 : 100;
                contentDiv.fadeIn(fade, () => {
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
    const chairRotStart = 0;
    if(!lock) {
        waitCount++;
        if(waitCount >= 6) {
            waitCount = 0;
            lock = true;
            let fade = (powerButton.material === emissiveRed) ? 800 : 100;
            if (contentDiv.css('display') === 'block') {
                contentDiv.fadeOut(fade);
                setActive(0);
            }
            gsap.to(camera.position, {
                duration: (fade / 1000), onComplete: () => {
                    gsap.to(chairGroup.position, {x: chairXStart, ease: "power2.out", duration: animTime});
                    gsap.to(chairGroup.rotation, {y: chairRotStart, ease: "power2.out", duration: animTime});
                    gsap.to(camera.position, {z: cameraZStart, y: cameraYStart, duration: animTime});
                    gsap.to(camera.rotation, {x: rotationXStart, duration: animTime, onComplete: () => {
                        lock = false;
                    }});
                }
            });
        }
    }
}

const changePointer = (event) => {
    if(contentDiv.css('display') === 'none' && !lock) {
        pointerChange.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointerChange.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(pointerChange, camera);

        let intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            intersects = intersects[0].object;
            while ((intersects.name !== 'chair') && (intersects.name !== 'screen') && (intersects.name) !== 'computer' && (intersects.name !== 'Sketchfab_Scene')) {
                intersects = intersects.parent;
            }
            if (intersects === chair || intersects === screen || intersects === textMesh || intersects === computer) {
                document.getElementsByTagName('canvas')[0].style.cursor = 'pointer';
            } else {
                document.getElementsByTagName('canvas')[0].style.cursor = 'default';
            }
        } else {
            document.getElementsByTagName('canvas')[0].style.cursor = 'default';
        }
    }
}

const changeButton = () => {
    if(powerButton.material === emissiveRed) {
        powerLightRed.intensity = 0;
        powerLightGreen.intensity = 0.08;
        powerButton.material = emissiveGreen;
        screen.material.color.set(0xeeeeee);
        screenLight.intensity = 2;
    }
    else {
        powerLightRed.intensity = 0.08;
        powerLightGreen.intensity = 0;
        powerButton.material = emissiveRed;
        screen.material.color.set(0x000000);
        screenLight.intensity = 0;
    }
}


$(() => {
    loadFiles();

    window.addEventListener("resize", resizeContainer);

    addEventListener('touchstart', (event) => {
        touchStart = event.touches[0].clientY;
    });

    addEventListener('touchmove', (event) => {
        const touchCurrent = event.touches[0].clientY;
        if(contentDiv.css('display') === 'none') {
            waitCount = 0;
            zoomIn();
        }
        else if(touchStart - touchCurrent < 0 && contentDiv.scrollTop() === 0) {
            zoomOut()
        }
        touchStart = touchCurrent;
    })

    addEventListener("wheel", (event) => {
        if((event.deltaY > 0 || event.deltaY < 0) && contentDiv.css('display') === 'none') {
            waitCount = 0;
            zoomIn();
        }
        else if(event.deltaY < 0 && contentDiv.scrollTop() === 0) {
            zoomOut();
        }
    });

    window.addEventListener('mousemove', changePointer);
    window.addEventListener( 'click', selectModel );

    creditsBtn.on('click', async (event) => {
        let response = await fetch('../public/data/credits.json');
        let data = await response.json();
        let { credits } = data;
        let creditText = ``;

        for(let i = 0; i < credits.length; i++){
            let { credit, link, name, attribution } = credits[i];
            creditText += `<p class="text-white credit">"${name}" (<a class="link-secondary link-offset-2 link-underline link-underline-opacity-0 link-underline-opacity-75-hover" href="${link}">${link}</a>) ${credit} (<a class="link-secondary link-offset-2 link-underline link-underline-opacity-0 link-underline-opacity-75-hover" href="${attribution}">${attribution}</a>).</p>`
        }

        creditsText.html(creditText);
        creditModal.show()

    });
});