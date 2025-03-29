document.addEventListener("DOMContentLoaded", () => {
  let cameraAlert = document.getElementById("cameraAlert");
  let video = document.getElementById("video");
  let canvas = document.getElementById("canvas");
  let errorMessage = document.getElementById("errorMessage");
  let picturebtn = document.getElementById("cameraBtn");
  let flipCameraBtn = document.getElementById("flipCameraBtn");
  let cameraFacingMode = "";

  async function startCamera(cameraFacingMode) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacingMode },
      });
      video.srcObject = stream;
      errorMessage.classList.remove("d-flex");
      errorMessage.style.display = "none";
      video.play();
    } catch (error) {
      errorMessage.style.display = "block";
      cameraAlert.removeAttribute("hidden");
      picturebtn.setAttribute("hidden", "hidden");
      flipCameraBtn.setAttribute("hidden", "hidden");
    }
  }

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    cameraFacingMode = "environment";
    startCamera("environment");
  } else {
    cameraAlert.removeAttribute("hidden");
    errorMessage.style.display = "block";
    picturebtn.setAttribute("hidden", "hidden");
  }

  video.addEventListener("error", () => {
    errorMessage.style.display = "block";
  });

  flipCameraBtn.addEventListener("click", () => {
    cameraFacingMode =
      cameraFacingMode === "environment" ? "user" : "environment";
    startCamera(cameraFacingMode);
  });

  picturebtn.addEventListener("click", () => {
    let context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }
    context.putImageData(imageData, 0, 0);

    let imageDataUrl = canvas.toDataURL("image/png");
    let downloadLink = document.createElement("a");
    downloadLink.href = imageDataUrl;
    downloadLink.download = "Art Piece Image.png";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  });
});
