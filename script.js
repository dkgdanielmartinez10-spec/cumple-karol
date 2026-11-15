const botonSorpresa = document.getElementById('botonSorpresa');
const sorpresa = document.getElementById('sorpresa');
const botonMusica = document.getElementById('botonMusica');

const coloresConfeti = ['#ffc6e7', '#d9c2ff', '#ffe6a8', '#ff70b7', '#a45bff', '#ffffff'];

function lanzarConfeti() {
  for (let i = 0; i < 70; i++) {
    const pieza = document.createElement('div');
    pieza.className = 'confeti';
    pieza.style.left = Math.random() * 100 + 'vw';
    pieza.style.backgroundColor = coloresConfeti[Math.floor(Math.random() * coloresConfeti.length)];
    pieza.style.width = (Math.random() * 7 + 6) + 'px';
    pieza.style.height = (Math.random() * 10 + 8) + 'px';
    pieza.style.animationDuration = (Math.random() * 2 + 2.2) + 's';
    document.body.appendChild(pieza);
    setTimeout(() => pieza.remove(), 4300);
  }
}

let audioCtx = null;
let tocando = false;
let temporizadoresMusica = [];

const melodia = [
  [261.63, 0.35], [261.63, 0.35], [293.66, 0.7], [261.63, 0.7], [349.23, 0.7], [329.63, 1.2],
  [261.63, 0.35], [261.63, 0.35], [293.66, 0.7], [261.63, 0.7], [392.00, 0.7], [349.23, 1.2],
  [261.63, 0.35], [261.63, 0.35], [523.25, 0.7], [440.00, 0.7], [349.23, 0.7], [329.63, 0.7], [293.66, 1.2],
  [466.16, 0.35], [466.16, 0.35], [440.00, 0.7], [349.23, 0.7], [392.00, 0.7], [349.23, 1.3]
];

function detenerMusica() {
  tocando = false;
  temporizadoresMusica.forEach(id => clearTimeout(id));
  temporizadoresMusica = [];
  botonMusica.textContent = '🎵 Música: Off';
  botonMusica.setAttribute('aria-pressed', 'false');
}

function reproducirMelodia() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  tocando = true;
  botonMusica.textContent = '🔊 Música: On';
  botonMusica.setAttribute('aria-pressed', 'true');

  let tiempoAcumulado = 0;
  melodia.forEach(([frecuencia, duracion]) => {
    const id = setTimeout(() => {
      if (!tocando) return;
      const osc = audioCtx.createOscillator();
      const ganancia = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = frecuencia;

      ganancia.gain.setValueAtTime(0.001, audioCtx.currentTime);
      ganancia.gain.exponentialRampToValueAtTime(0.14, audioCtx.currentTime + 0.04);
      ganancia.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duracion * 0.92);

      osc.connect(ganancia);
      ganancia.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duracion);
    }, tiempoAcumulado * 1000);

    temporizadoresMusica.push(id);
    tiempoAcumulado += duracion;
  });

  const finId = setTimeout(() => {
    if (tocando) detenerMusica();
  }, tiempoAcumulado * 1000 + 200);
  temporizadoresMusica.push(finId);
}

botonMusica.addEventListener('click', () => {
  if (tocando) {
    detenerMusica();
  } else {
    reproducirMelodia();
  }
});

botonSorpresa.addEventListener('click', () => {
  sorpresa.classList.remove('oculto');
  botonSorpresa.textContent = '💖 ¡Sorpresa para Karol!';
  lanzarConfeti();
  if (!tocando) reproducirMelodia();
  sorpresa.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

const visor = document.getElementById('visor');
const fotoGrande = document.getElementById('fotoGrande');
const cerrarVisor = document.getElementById('cerrarVisor');

document.querySelectorAll('.foto').forEach((foto) => {
  foto.addEventListener('click', () => {
    const imagenMiniatura = foto.querySelector('img');
    const rutaFoto = foto.dataset.src || (imagenMiniatura ? imagenMiniatura.getAttribute('src') : '');
    if (!rutaFoto) return;

    fotoGrande.src = rutaFoto;
    fotoGrande.alt = imagenMiniatura ? imagenMiniatura.alt : 'Fotografía ampliada de Karol';
    visor.classList.remove('oculto');
  });
});

function cerrarFoto() {
  visor.classList.add('oculto');
  fotoGrande.src = '';
}

cerrarVisor.addEventListener('click', cerrarFoto);
visor.addEventListener('click', (evento) => {
  if (evento.target === visor) cerrarFoto();
});
document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape') cerrarFoto();
});
