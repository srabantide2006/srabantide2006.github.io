let heartflakesCount = 200; // heartflake count, can be overwritten by attrs
let baseCSS = ``;


// set global attributes
if (typeof heartFLAKES_COUNT !== 'undefined') {
  heartflakesCount = heartFLAKES_COUNT;
}
if (typeof BASE_CSS !== 'undefined') {
  baseCSS = BASE_CSS;
}

let bodyHeightPx = null;
let pageHeightVh = null;

function setHeightVariables() {
  bodyHeightPx = document.body.offsetHeight;
  pageHeightVh = (100 * bodyHeightPx / window.innerHeight);
}

// get params set in heart div
function getheartAttributes() {
  const heartWrapper = document.getElementById('heart');
  heartflakesCount = Number(
    heartWrapper?.dataset?.count || heartflakesCount
  );
}

// This function allows you to turn on and off the heart
function showheart(value) {
  if (value) {
    document.getElementById('heart').style.display = "block";
  }
  else {
    document.getElementById('heart').style.display = "none";
  }
}

// Creating heartflakes
function generateheart(heartDensity = 200) {
  heartDensity -= 1;
  const heartWrapper = document.getElementById('heart');
  heartWrapper.innerHTML = '';
  for (let i = 0; i < heartDensity; i++) {
    let board = document.createElement('div');
    board.className = "heartflake";
    heartWrapper.appendChild(board);
  }
}

function getOrCreateCSSElement() {
  let cssElement = document.getElementById("psjs-css");
  if (cssElement) return cssElement;

  cssElement = document.createElement('style');
  cssElement.id = 'psjs-css';
  document.head.appendChild(cssElement);
  return cssElement;
}

// Append style for each heartflake to the head
function addCSS(rule) {
  const cssElement = getOrCreateCSSElement();
  cssElement.innerHTML = rule; // safe to use innerHTML
  document.head.appendChild(cssElement);
}

// Math
function randomInt(value = 100) {
  return Math.floor(Math.random() * value) + 1;
}

function randomIntRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

// Create style for heartflake
function generateheartCSS(heartDensity = 200) {
  let heartflakeName = "heartflake";
  let rule = baseCSS;

  for (let i = 1; i < heartDensity; i++) {
    let randomX = Math.random() * 100; // vw
    let randomOffset = Math.random() * 10 // vw;
    let randomXEnd = randomX + randomOffset;
    let randomXEndYoyo = randomX + (randomOffset / 2);
    let randomYoyoTime = getRandomArbitrary(0.3, 0.8);
    let randomYoyoY = randomYoyoTime * pageHeightVh; // vh
    let randomScale = Math.random();
    let fallDuration = randomIntRange(10, pageHeightVh / 10 * 3); // s
    let fallDelay = randomInt(pageHeightVh / 10 * 3) * -1; // s
    let opacity = Math.random();

    rule += `
      .${heartflakeName}:nth-child(${i}) {
        opacity: ${opacity};
        transform: translate(${randomX}vw, -10px) scale(${randomScale});
        animation: fall-${i} ${fallDuration}s ${fallDelay}s linear infinite;
      }
      @keyframes fall-${i} {
        ${randomYoyoTime * 100}% {
          transform: translate(${randomXEnd}vw, ${randomYoyoY}vh) scale(${randomScale});
        }
        to {
          transform: translate(${randomXEndYoyo}vw, ${pageHeightVh}vh) scale(${randomScale});
        }
      }
    `
  }
  addCSS(rule);
}

// Load the rules and execute after the DOM loads
function createheart() {
  setHeightVariables();
  getheartAttributes();
  generateheartCSS(heartflakesCount);
  generateheart(heartflakesCount);
};


window.addEventListener('resize', createheart);

// export createheart function if using node or CommonJS environment
if (typeof module !== 'undefined') {
  module.exports = {
    createheart,
    showheart,
  };
}
else {
  window.onload = createheart;
}

