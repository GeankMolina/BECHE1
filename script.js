document.addEventListener("DOMContentLoaded", () => {
  const geank = document.querySelector(".geank");
  const mainMessage1 = geank.querySelector('.main-message-1');
  const mainMessage2 = geank.querySelector('.main-message-2');
  const ivet = document.querySelector(".ivet");
  const ivetMessage1 = ivet.querySelector('.ivet-message-1');
  const ivetMessage2 = ivet.querySelector('.ivet-message-2');
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const repeatBtn = document.getElementById("repeatBtn");

  const geankLegs = geank.querySelectorAll('.legs');
  const geankFeet = geank.querySelectorAll('.feet');
  const ivetLegs = ivet.querySelectorAll('.legs');
  const ivetFeet = ivet.querySelectorAll('.feet');
  const ivetArmLeft = ivet.querySelector('.arm-left');
  const ivetArmRight = ivet.querySelector('.arm-right');

  // Duraciones en milisegundos
  const DURACION_MENSAJE_2 = 3500; // Tiempo que se mantiene la segunda nube de Franco tras llegar
  const DURACION_IVET_1 = 1800;    // Primer mensaje Ivet
  const ESPERA_ANTES_IVET = 1200;  // Espera antes de mostrar la primera nube de Ivet

  let position = 50;
  const start = 50;
  const target = 400;
  const speed = 0.35; // Más lento para leer ambos mensajes
  let animationId = null;
  let paused = false;
  let timeouts = [];

  function setGeankPosition(pos) {
    geank.style.left = pos + "px";
    geank.style.bottom = "80px";
  }

  function show(el) { el.classList.add("visible"); }
  function hide(el) { el.classList.remove("visible"); }

  // Franco camina (piernas y pies)
  function startWalkingGeank() {
    geankLegs.forEach((l, i) => {
      l.classList.add('walking');
      l.style.animationDelay = (i === 0 ? '0s' : '0.35s');
    });
    geankFeet.forEach((f, i) => {
      f.classList.add('walking');
      f.style.animationDelay = (i === 0 ? '0s' : '0.35s');
    });
  }
  function stopWalkingGeank() {
    geankLegs.forEach(l => l.classList.remove('walking'));
    geankFeet.forEach(f => f.classList.remove('walking'));
  }

  // Ivet brazos mueven mientras Franco camina
  function startHappyArmsIvet() {
    ivetArmLeft.classList.add('happy');
    ivetArmRight.classList.add('happy');
  }
  function stopHappyArmsIvet() {
    ivetArmLeft.classList.remove('happy');
    ivetArmRight.classList.remove('happy');
  }

  // Ivet festeja (brazos y piernas)
  function startHappyIvet() {
    startHappyArmsIvet();
    ivetLegs.forEach((l, i) => {
      l.classList.add('walking');
      l.style.animationDelay = (i === 0 ? '0s' : '0.35s');
    });
    ivetFeet.forEach((f, i) => {
      f.classList.add('walking');
      f.style.animationDelay = (i === 0 ? '0s' : '0.35s');
    });
  }
  function stopHappyIvet() {
    stopHappyArmsIvet();
    ivetLegs.forEach(l => l.classList.remove('walking'));
    ivetFeet.forEach(f => f.classList.remove('walking'));
  }

  function animate() {
    if (paused) return;
    const midPoint = start + (target - start) / 2;

    if (position < target) {
      position += speed;
      setGeankPosition(position);

      // Mostrar la primera nube en la primera mitad, la segunda en la segunda mitad
      if (position < midPoint) {
        show(mainMessage1);
        hide(mainMessage2);
      } else {
        hide(mainMessage1);
        show(mainMessage2);
      }

      animationId = requestAnimationFrame(animate);
    } else {
      stopWalkingGeank();
      stopHappyArmsIvet();
      startHappyIvet(); // Ivet festeja cuando Franco llega
      hide(mainMessage1);
      // La segunda nube queda visible tras llegar
      show(mainMessage2);
      // Espera para mostrar mensajes de Ivet
      timeouts.push(setTimeout(() => {
        hide(mainMessage2);
        show(ivetMessage1);
        // Después de un tiempo, mostrar el segundo mensaje de Ivet
        timeouts.push(setTimeout(() => {
          hide(ivetMessage1);
          show(ivetMessage2);
        }, DURACION_IVET_1));
      }, DURACION_MENSAJE_2));
      animationId = null;
    }
  }

  function startAnimation() {
    if (animationId) return;
    hide(ivetMessage1);
    hide(ivetMessage2);
    hide(mainMessage1);
    hide(mainMessage2);
    paused = false;
    setGeankPosition(start);
    position = start;
    animationId = requestAnimationFrame(animate);
    startWalkingGeank();
    startHappyArmsIvet();
    stopHappyIvet(); // Por si acaso
  }

  function pauseAnimation() {
    paused = true;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    timeouts.forEach(t => clearTimeout(t));
    timeouts = [];
    stopWalkingGeank();
    stopHappyIvet();
  }

  function repeatAnimation() {
    pauseAnimation();
    position = start;
    setGeankPosition(position);
    hide(ivetMessage1);
    hide(ivetMessage2);
    hide(mainMessage1);
    hide(mainMessage2);
    setTimeout(() => {
      paused = false;
      show(mainMessage1);
      show(mainMessage2);
      animationId = requestAnimationFrame(animate);
      startWalkingGeank();
      startHappyArmsIvet();
      stopHappyIvet();
    }, 200);
  }

  // Inicializa posición y mensajes
  setGeankPosition(start);
  hide(ivetMessage1);
  hide(ivetMessage2);
  hide(mainMessage1);
  hide(mainMessage2);

  // Listeners de botones
  if (startBtn && pauseBtn && repeatBtn) {
    startBtn.addEventListener("click", startAnimation);
    pauseBtn.addEventListener("click", pauseAnimation);
    repeatBtn.addEventListener("click", repeatAnimation);
  }
});
