const { createFFmpeg } = FFmpeg;
const timeElement = document.querySelector('#time');
let time = '';
const analog = (log) => {
    let result = log.message.match(/time=(\d\d:\d\d:\d\d.\d\d)/) || [];
    console.log(result);
    if (result.length) {
        if (time !== result[1]) {
            time = result[1];
            timeElement.innerHTML = result[1];
        }
    }
}
const ffmpeg = createFFmpeg({ log: false, logger: analog });
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
    const selectedFile = document.getElementById('file').files[0];
    const options = `-preset ${preset} -threads ${threads} -s ${resolution} -crf 26`;
    await ffmpeg.write(selectedFile.name, selectedFile);
    await ffmpeg.transcode(selectedFile.name, 'output.mp4', options);
    let blob = new Blob([ffmpeg.read('output.mp4')], { type: "video/mp4" });
    saveData(blob, 'output.mp4');
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
