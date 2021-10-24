const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("homepage");
});

app.get("/admin", (req, res) => {
  res.render("admin");
});

app.get("/:user", (req, res) => {
  res.render("user", { userId: req.params.user });
});

io.on("connection", (socket) => {
  socket.on("join-broadcasters", (userId) => {
    socket.join("broadcasters");
  });
  socket.on("join-admin", (adminId) => {
    socket.join("admin");
    socket.to("broadcasters").emit("receive-admin-key", adminId);
  });
  socket.on("section-selection-changed", (selectedSection) => {
    socket.to("broadcasters").emit("selection-changed", selectedSection);
  });
  socket.on("broadcasters-chosen", (userId) => {
    socket.join("selected-broadcasters");
    socket.to("admin").emit("user-connected", userId);
  });
});

server.listen(process.env.PORT || 3000);
