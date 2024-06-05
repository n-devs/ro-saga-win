/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';
const { windowControls } = window;

document.getElementById('maximumize').onclick = () => {
    windowControls.setMaximumize();
}

document.getElementById('minimumize').onclick = () => {
    windowControls.setMinimumize();
}

document.getElementById('close').onclick = () => {
    windowControls.close();
    window.close()

}

if (document.getElementsByTagName('iframe').length === 0) {
    fetch("https://raw.githubusercontent.com/n-devs/public-ip/data/ip-address.json").then(res => res.json())
        .then(data => {
            const iframe = document.createElement('iframe');
            iframe.src = `http://${data.ipv4}:5173/`
            iframe.width = "100%"
            iframe.height = "100%"
            iframe.style.border = "none"
            iframe.allowFullscreen = true
            document.getElementsByTagName('body')[0].appendChild(iframe);
        }).catch(err => { throw err });

}


let draggableDiv = document.getElementById('draggableDiv');
let moveDraggable = document.getElementById('move-draggable');
let offsetX, offsetY;

moveDraggable.addEventListener('mousedown', startDragging);
document.addEventListener('mouseup', stopDragging);

function startDragging(e) {
    // คำนวณตำแหน่งเริ่มต้นของ Div ที่เลื่อน
    offsetX = e.clientX - draggableDiv.getBoundingClientRect().left;
    offsetY = e.clientY - draggableDiv.getBoundingClientRect().top;

    // เริ่มต้นการลาก
    document.addEventListener('mousemove', drag);
}

function drag(e) {
    // ปรับตำแหน่งของ Div ตามตำแหน่งของเมาส์
    draggableDiv.style.left = e.clientX - offsetX + 'px';
    draggableDiv.style.top = e.clientY - offsetY + 'px';
}

function stopDragging() {
    // หยุดการลาก
    document.removeEventListener('mousemove', drag);
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullScreen();
    }
});

document.getElementById('full-screen').addEventListener('click', function () {
    toggleFullScreen();
});

document.getElementById('exit-full-screen').addEventListener('click', function () {
    toggleExitFullScreen();
});

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
        document.getElementById('exit-full-screen').style.display = "block"
        document.getElementById('full-screen').style.display = "none"
    }
}

function toggleExitFullScreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
        document.getElementById('exit-full-screen').style.display = "none"
        document.getElementById('full-screen').style.display = "block"
    }
}

if (!document.fullscreenElement) {
    document.getElementById('exit-full-screen').style.display = "none"
    document.getElementById('full-screen').style.display = "block"
} else {
    document.getElementById('exit-full-screen').style.display = "block"
    document.getElementById('full-screen').style.display = "none"
}


console.log('👋 This message is being logged by "renderer.js", included via Vite');
