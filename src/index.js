import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {Howl} from 'howler';

let scene;
let camera;
let renderer;

function playMusic() {
    new Howl({
        src: ['../sfx/bg.wav'],
        autoplay: true,
        loop: true,
        volume: 0.5
    });
}

function init() {
    // DOM
    let container = document.querySelector('.container');

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color("#91c0f6");

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = -10;
    camera.position.y = 3;
    camera.position.z = 10;

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
    controls.maxDistance = 50;

    // Light
    const ambient = new THREE.AmbientLight("#FFFFFF", 0.7);
    ambient.position.set(0, 0, 0);
    scene.add(ambient);

    let dirLight = new THREE.DirectionalLight("#ffffff", 1);
    dirLight.position.set(-30, 50, 30);
    scene.add(dirLight);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.left = -10;
    dirLight.shadow.camera.right = 10;
    dirLight.shadow.camera.top = 10;
    dirLight.shadow.camera.bottom = -10;

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    // Floor
    function createFloor() {
        let pos = {x: 0, y: 0, z: 0}
        let scale = {x: 500, y: 1, z: 500}

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('models/floor/textures/soil.jpg');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(80, 80);

        let floorPlane = new THREE.BoxGeometry(1, 1, 1);
        let floorMaterial = new THREE.MeshPhongMaterial({
            map: texture
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
    let isMoving = false;
    const clock = new THREE.Clock();
    const loader = new GLTFLoader();

    function createCatModel() {
        loader.load('models/cat/scene.gltf', function (gltf) {
            gltf.scene.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    //node.receiveShadow = true;
                }
            });

            model = gltf.scene;
            model.position.x = -5;
            model.position.y = 0.5;
            model.scale.x = 0.01;
            model.scale.y = 0.01;
            model.scale.z = 0.01;
            camera.lookAt(model.position);
            mixer = new THREE.AnimationMixer(model);
            mixer.clipAction(gltf.animations[0]).play();
            window.addEventListener('keypress', (e) => {
                switch (e.code) {
                    case 'KeyW':
                        model.translateZ(0.05);
                        isMoving = true;
                        break;
                    case 'KeyA':
                        model.rotateY(0.05);
                        isMoving = true;
                        break;
                    case 'KeyS':
                        model.translateZ(-0.05);
                        isMoving = true;
                        break;
                    case 'KeyD':
                        model.rotateY(-0.05);
                        isMoving = true;
                        break;
                    default:
                        isMoving = false;
                        break;
                }
            })
            scene.add(gltf.scene);
        }, undefined, function (error) {
            console.error(error);
        });
    }

    function createTree() {
        loader.load('models/tree/scene.gltf', function (gltf) {
            gltf.scene.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    //node.receiveShadow = true;
                }
            });

            let tree = gltf.scene;
            tree.position.x = -10;
            tree.position.y = 1.5;
            tree.scale.x = 10;
            tree.scale.y = 10;
            tree.scale.z = 10;
            scene.add(tree);
        }, undefined, function (error) {
            console.error(error);
        });
    }

    function createGrass() {
        loader.load('models/grass/scene.gltf', function (gltf) {
            gltf.scene.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    //node.receiveShadow = true;
                }
            });

            let mesh = gltf.scene;
            mesh.position.x = -10;
            mesh.position.y = 0.5;
            mesh.scale.x = 0.05;
            mesh.scale.y = 0.05;
            mesh.scale.z = 0.05;
            scene.add(mesh);
        }, undefined, function (error) {
            console.error(error);
        });
    }

    function createToy() {
        loader.load('models/toy2/scene.gltf', function (gltf) {
            gltf.scene.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    //node.receiveShadow = true;
                }
            });

            let mesh = gltf.scene;
            mesh.position.x = -3;
            mesh.position.y = 1.5;
            mesh.position.z = 5;
            mesh.rotation.y = 10.8;
            mesh.rotation.z = -10;
            mesh.scale.x = 0.0002;
            mesh.scale.y = 0.0002;
            mesh.scale.z = 0.0002;
            scene.add(mesh);
        }, undefined, function (error) {
            console.error(error);
        });
    }

    createFloor();
    createTree();
    createGrass();
    createToy();
    createCatModel();

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        if (mixer && isMoving) mixer.update(clock.getDelta());
        isMoving = false;
        renderer.render(scene, camera);
    }

    animate();
}

playMusic();
init();
