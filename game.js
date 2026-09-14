```javascript
let selectedCharacter = "Till";

let score = 0;
let combo = 0;
let misses = 0;

let playerHealth = 100;
let alienHealth = 100;

let gameRunning = false;
let noteSpeed = 2.5;

let spawnTimer;
let attackCooldown = 0;

const keys = ["a", "s", "k", "l"];


/* =========================
   CHARACTER SELECT
========================= */

function chooseCharacter(name) {

    selectedCharacter = name;

    document
        .getElementById("menu")
        .classList.add("hidden");

    document
        .getElementById("game")
        .classList.remove("hidden");

    document
        .getElementById("playerName")
        .textContent = name.toUpperCase();

    startGame();
}


/* =========================
   START GAME
========================= */

function startGame() {

    score = 0;
    combo = 0;
    misses = 0;

    playerHealth = 100;
    alienHealth = 100;

    noteSpeed = 2.5;

    attackCooldown = 0;

    gameRunning = true;

    updateHUD();

    document
        .getElementById("notes")
        .innerHTML = "";

    spawnNote();

    /*
       Start alien attacks.
    */

    alienAttackLoop();
}


/* =========================
   SPAWN NOTES
========================= */

function spawnNote() {

    if (!gameRunning) return;

    const note =
        document.createElement("div");

    note.className = "note";


    const random =
        Math.floor(
            Math.random() * 4
        );


    note.dataset.key =
        keys[random];

    note.textContent =
        keys[random].toUpperCase();


    /*
       Four lanes.
    */

    const lanePositions = [
        34,
        43,
        52,
        61
    ];


    note.style.left =
        lanePositions[random] + "%";

    note.style.top = "-70px";


    document
        .getElementById("notes")
        .appendChild(note);


    moveNote(note);


    /*
       Notes become faster
       as the score increases.
    */

    const delay =
        Math.max(
            300,
            800 - score / 20
        );


    spawnTimer =
        setTimeout(
            spawnNote,
            delay
        );
}


/* =========================
   MOVE NOTE
========================= */

function moveNote(note) {

    let position = -70;


    const movement =
        setInterval(() => {

            if (!gameRunning) {

                clearInterval(movement);
                return;
            }


            position += noteSpeed;

            note.style.top =
                position + "px";


            /*
               Note missed.
            */

            if (position > 480) {

                clearInterval(movement);

                if (note.parentNode) {
                    note.remove();
                }

                miss();
            }

        }, 16);
}


/* =========================
   KEYBOARD INPUT
========================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (!gameRunning) return;


        const key =
            event.key.toLowerCase();


        if (!keys.includes(key))
            return;


        const notes =
            document.querySelectorAll(".note");


        let closest = null;

        let closestDistance =
            Infinity;


        notes.forEach(note => {

            if (
                note.dataset.key !== key
            ) {
                return;
            }


            const top =
                parseFloat(note.style.top);


            const distance =
                Math.abs(top - 390);


            if (
                distance <
                closestDistance
            ) {

                closestDistance =
                    distance;

                closest = note;
            }

        });


        /*
           No note close enough.
        */

        if (
            !closest ||
            closestDistance > 100
        ) {

            miss();

            return;
        }


        closest
```
