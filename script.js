let textInput = document.querySelector('.textarea');
let container = document.querySelector('.container');
let audio = document.querySelector('.audio');
let video = document.querySelector('.video');

let stream;
let recorder;
let chunks = [];


let coordinates;
navigator.geolocation.getCurrentPosition(success, error, {
    enableHighAccuracy: true
})
function success({ coords }) {
    coordinates = coords
}
function error({ message }) {
    console.log(message)
}

textInput.addEventListener('keydown', function(e) {
    if (e.keyCode === 13) {
        makePost(addTextContent)
    }
});

audio.addEventListener('mousedown', async () => {
    await startRecordMedia(
        {
            audio: true,
            video: false,
        },
        'audio', 
    )
})

audio.addEventListener('mouseup', () => {   
    stopRecordMedia();
})

video.addEventListener('mousedown', async () => {
    await startRecordMedia(
        {
            audio: true,
            video: true,
        },
        'video', 
    )
})

video.addEventListener('mouseup', () => {   
    stopRecordMedia();
})

async function startRecordMedia(mediaOptions, mediaType) {
    stream = await navigator.mediaDevices.getUserMedia(mediaOptions);
    recorder = new MediaRecorder(stream);
    recorder.addEventListener('dataavailable', (event) => {
        chunks.push(event.data);
    })
    recorder.addEventListener('stop', (event) => {
        makePost(addMediaContent, mediaType)
    })

    recorder.start();
}

function stopRecordMedia() {
    recorder.stop();
    stream.getTracks().forEach((track) => track.stop());
}

function makePost(contentHandler, mediaType) {
    let post = createPost();
    addDate(post);
    contentHandler(post, mediaType);
    addCoords(post);
    container.append(post);
}


function createPost() {
    let post = document.createElement('div');
    post.className = 'post';
    return post;
}

function addDate(post) {
    let postDate = document.createElement('div');
    postDate.className = 'date';
    let d = new Date();
    postDate.textContent =  d.toLocaleDateString() + d.toLocaleTimeString();
    post.append(postDate);
}

function addTextContent(post) {
    let content = document.createElement('div');
    content.className = 'content';
    content.textContent = textInput.value;
    textInput.value = '';
    post.append(content);
}

function addMediaContent(post, mediaType) {
    let content = document.createElement(mediaType);
    content.src = URL.createObjectURL(new Blob(chunks));
    content.controls = 'controls';
    chunks = [];
    post.append(content);
}

function addCoords(post) {
    if (coordinates) {
        let coordsDiv = document.createElement('div');
        coordsDiv.className = 'coords';
        coordsDiv.textContent = `geolocation: [${coordinates.latitude}, ${coordinates.longitude}]`;
        post.append(coordsDiv);
    }
}

