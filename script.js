const { createFFmpeg } = FFmpeg;
const progressElement = document.querySelector('#progressbar');
const encodeBlock = document.querySelector('#encodeBlock');
const progressBlock = document.querySelector('#progressBlock');
const fileInput = document.querySelector('#file');
const loader = (progress) => {
    let value = progress.ratio > 0 ? Math.floor(progress.ratio * 100) : 0;
    progressElement.style.width = value + '%';
}
const ffmpeg = createFFmpeg({ log: false, progress: loader });

fileInput.addEventListener('change', (event) => {
    const fileLabel = document.querySelector('#fileLabel');
    fileLabel.innerHTML = event.target.files[0].name;
})

ffmpeg.load().then(() => {
    let encodeButton = document.querySelector('#encode');
    encodeButton.classList.remove('inactive');
    encodeButton.addEventListener('click', () => {
        encode(
            document.querySelector('#preset').value,
            document.querySelector('#threads').value,
            document.querySelector('#resolution').value
        );
    });
});

async function encode(preset, threads, resolution) {
    encodeBlock.classList.add('hidden');
    progressBlock.classList.remove('hidden');
    const selectedFile = fileInput.files[0];
    const options = `-preset ${preset} -threads ${threads} -s ${resolution} -crf 26`;
    const output = Math.random().toString(36).substring(7);
    await ffmpeg.write(selectedFile.name, selectedFile);
    await ffmpeg.transcode(selectedFile.name, `${output}.mp4`, options);
    let blob = new Blob([ffmpeg.read(`${output}.mp4`)], { type: "video/mp4" });
    saveData(blob, 'output.mp4');
    encodeBlock.classList.remove('hidden');
    progressBlock.classList.add('hidden');
}

function saveData(blob, fileName) {
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
}
