const peer = new Peer(undefined, {
  debug: 2,
});
const socket = io("/");
var connectedUsers = [];
const sections = document.getElementsByClassName("sections");
var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
const videoGrid = document.getElementById("video-grid");

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
  const video = document.createElement("video");
  call.answer();
  call.on("stream", (stream) => {
    console.log("stream received");
    addVideoStream(video, stream);
  });
  call.on("close", () => {
    removeAllChildNodes(videoGrid);
  });
});

span.onclick = function () {
  modal.style.display = "none";
  removeAllChildNodes(videoGrid);
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

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
