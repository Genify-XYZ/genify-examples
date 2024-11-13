let scene, camera, renderer, cube;

function getSize() {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.8;
    return {
        width: size,
        height: size
    };
}

function init() {
    scene = new THREE.Scene();
    const size = getSize();
    
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(size.width, size.height);
    
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.left = '50%';
    renderer.domElement.style.top = '50%';
    renderer.domElement.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); 
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    createCube();
    camera.position.z = 2;

    animate();
}

function createCube() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;
    
    ctx.fillStyle = '#333333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const color = `hsl(${genify.randInt(0, 360)}, 70%, 60%)`;

    ctx.fillStyle = color;
    ctx.font = 'Bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GENIFY', canvas.width/2, canvas.height/2);

    const texture = new THREE.CanvasTexture(canvas);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ 
        map: texture,
        shininess: 50 
    });
    
    if (cube) {
        scene.remove(cube);
    }
    
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    genify.setFeatures({
        color: color
    });
}

function handleResize() {
    const size = getSize();
    camera.aspect = 1;
    camera.updateProjectionMatrix();
    renderer.setSize(size.width, size.height);
    genify.reset();
    createCube();
}

function animate() {
    requestAnimationFrame(animate);
    if (cube) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);

        if (cube.rotation.x === 0.01) {
            genify.renderDone();
        }
    }
}

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 250);
});

init();