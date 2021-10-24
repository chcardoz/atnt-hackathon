const socket = io("/");
const peer = new Peer(undefined, {
  host: "/",
  port: "3001",
});
const sections = document.getElementsByClassName("sections");
const allsections = "ABCDEFGH";
const randomSection =
  allsections[Math.floor(Math.random() * allsections.length)];
const modal = document.getElementById("myModal");
const btn = document.getElementById("myBtn");
const span = document.getElementsByClassName("close")[0];
const videoGrid = document.getElementById("video-grid");

const myVideo = document.createElement("video");
myVideo.muted = true;
peer.on("open", (userId) => {
  socket.emit("join-broadcasters", userId);
});
var adminId = "";

socket.on("selection-changed", (selectedSectionId) => {
  Array.prototype.forEach.call(sections, (section) => {
    if (section.id == selectedSectionId) {
      section.style.fill = "yellowgreen";
    } else {
      section.style.fill = "none";
    }
  });
  if (selectedSectionId == randomSection) {
    modal.style.display = "block";
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((stream) => {
        addVideoStream(myVideo, stream);
        socket.emit("broadcasters-chosen", peer.id);
        sendVideoToAdmin(stream);
      });
  }
});

socket.on("receive-admin-key", (id) => {
  adminId = id;
});

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}

function sendVideoToAdmin(stream) {
  if (adminId.length > 0) {
    const call = peer.call(adminId, stream);
  }
}
