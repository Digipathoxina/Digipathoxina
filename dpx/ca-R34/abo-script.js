const imgs = document.querySelectorAll(".img-wrapper img");

let current = 0;

function loadNext() {
  if (current >= imgs.length) return;

  const img = imgs[current];

  // progress = quanto BASSO resta nascosto (parte da 100% e scende a 0)
  let bottomHidden = 100;

  img.style.opacity = "1";

  const interval = setInterval(() => {
    // “blocchi” più lenti e più piccoli
    bottomHidden -= 2; // più piccolo = più lento e più “a scatti”

    if (bottomHidden <= 0) {
      img.style.clipPath = "inset(0 0 0 0)";
      clearInterval(interval);

      current++;
      // pausa tra un’immagine e l’altra (stile modem)
      setTimeout(loadNext, 2500);
    } else {
      img.style.clipPath = `inset(0 0 ${bottomHidden}% 0)`;
    }
  }, 280); // più alto = più lento
}

loadNext();
