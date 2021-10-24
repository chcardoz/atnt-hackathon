const socket = io("/");
const sportsFanButton = document.getElementById("sports-fan-button");
const adminButton = document.getElementById("admin-button");

sportsFanButton.addEventListener("click", () => {
  const userId = uuidv4();
  console.log(userId);
  window.location = `/${userId}`;
});
adminButton.addEventListener("click", () => {
  window.location = "/admin";
});

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}
