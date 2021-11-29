import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let scene;
let camera;
let renderer;

function init() {
    // DOM
    let container = document.querySelector('.container');

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color("#BED0E5");

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.position.x = 2;
    camera.position.y = 3;

    // Render
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Orbit Control
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    controls.enableDamping = true;
    controls.minDistance = 10;

    // Light
    const ambient = new THREE.AmbientLight("#FFFFFF", .2);
    ambient.position.set(0, 300, 500);
    scene.add(ambient);

    let dirLight = new THREE.DirectionalLight("#ffffff", 1);
    dirLight.position.set(-30, 50, 30);
    scene.add(dirLight);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    // Floor
    function createFloor() {
        let pos = {x: 0, y: 0, z: 0}
        let scale = {x: 100, y: 1, z: 100}

        const textureLoader = new THREE.TextureLoader();

        let floorPlane = new THREE.BoxGeometry(1, 1, 1);
        let floorMaterial = new THREE.MeshBasicMaterial({
            map: textureLoader.load('models/floor/textures/carpet.jpg')
        });
        //let floorMaterial = new THREE.MeshPhongMaterial({color: "#f9c834"});
        let floorMesh = new THREE.Mesh(floorPlane, floorMaterial);
        floorMesh.position.set(pos.x, pos.y, pos.z);
        //floorMesh.rotation.set(45, 0, 0);
        floorMesh.scale.set(scale.x, scale.y, scale.z);
        floorMesh.castShadow = true;
        floorMesh.receiveShadow = true;
        scene.add(floorMesh);

        floorMesh.userData.ground = true;
        floorMesh.userData.draggable = false;
    }

    // Model
    let model;
    let mixer;
    const clock = new THREE.Clock();
    const loader = new GLTFLoader();
    loader.load('models/cat/scene.gltf', function (gltf) {
        model = gltf.scene;
        model.position.y += 0.5;
        model.scale.x = 0.01;
        model.scale.y = 0.01;
        model.scale.z = 0.01;
        model.castShadow = true;
        model.receiveShadow = true;
        camera.lookAt(model.position);
        mixer = new THREE.AnimationMixer(model);
        mixer.clipAction(gltf.animations[0]).play();
        window.addEventListener('keypress', (e) => {
            switch (e.code) {
                case 'KeyW':
                    model.position.z += 0.1;
                    break;
                case 'KeyA':
                    model.rotation.y += 0.1;
                    break;
                case 'KeyS':
                    model.position.z -= 0.1;
                    break;
                case 'KeyD':
                    model.rotation.y -= 0.1;
                    break;
                default:
                    break;
            }
        })
        scene.add(gltf.scene);
    }, undefined, function (error) {
        console.error(error);
    });

    createFloor();

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        if (mixer) mixer.update(clock.getDelta());
        renderer.render(scene, camera);
    }

    animate();
}

init()
