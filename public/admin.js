const peer = new Peer(undefined, {
  host: "/",
  port: "3001",
});
const socket = io("/");
var connectedUsers = [];
const sections = document.getElementsByClassName("sections");
var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
const videoGrid = document.getElementById("video-grid");
const video = document.createElement("video");

Array.prototype.forEach.call(sections, (section) => {
  section.addEventListener("click", (e) => {
    socket.emit("section-selection-changed", section.id);
  });
});

peer.on("open", (adminId) => {
  socket.emit("join-admin", adminId);
});

socket.on("user-connected", (userId) => {
  if (!connectedUsers.includes(userId)) {
    connectedUsers.push(userId);
    modal.style.display = "block";
  }
});

peer.on("call", (call) => {
  call.answer();
  call.on("stream", (stream) => {
    console.log("stream received");
    addVideoStream(video, stream);
  });
  call.on("close", () => {
    video.remove();
  });
});

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    connectedUsers = [];
  }
};

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}
