const textElement = document.getElementById("text");
const text = "WE PLAN WITH\n PRECISION TO SPARK\n REAL CONNECTION";
let index = 0;

function type() {
  if (index < text.length) {
    textElement.textContent += text[index];
    index++;
    setTimeout(type, 100);
  } else {
    setTimeout(() => {
      textElement.textContent = "";
      index = 0;
      type();
    }, 1000);
  }
}

type();