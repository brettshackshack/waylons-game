let selectedCharacter = "Till";

let score = 0;
let combo = 0;
let misses = 0;

let health = 100;

let gameRunning = false;

let noteSpeed = 2.5;

const keys = ["a", "s", "k", "l"];

let spawnTimer;


/* CHARACTER SELECT */

function chooseCharacter(name) {

    selectedCharacter = name;

    document.getElementById("menu")
        .classList.add("hidden");

    document.getElementById("game")
        .classList.remove("hidden");

    document.getElementById("playerName")
        .textContent = name;

    document.getElementById("playerFace")
        .textContent = name[0];

    startGame();

}


/* START */

function startGame() {

    score = 0;
    combo = 0;
    misses = 0;
    health = 100;
    noteSpeed = 2.5;

    gameRunning = true;

    updateHUD();

    const music =
        document.getElementById("music");

    music.currentTime = 0;

    /*
       Browser security requires the player
       to interact with the page before audio
       can start.
    */

    music.play().catch(() => {
        console.log("Click the page to start music.");
    });

    spawnNote();

}


/* SPAWN NOTES */

function spawnNote() {

    if (!gameRunning) return;

    const note =
        document.createElement("div");

    note.className = "note";

    const random =
        Math.floor(Math.random() * 4);

    note.dataset.key = keys[random];

    note.textContent =
        keys[random].toUpperCase();

    /*
       Put the note in one of four lanes.
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
       Higher score = faster notes
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


/* MOVE NOTE */

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
               Missed the target
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


/* KEYBOARD */

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
        let closestDistance = Infinity;


        notes.forEach(note => {

            if (note.dataset.key !== key)
                return;

            const top =
                parseFloat(note.style.top);

            const distance =
                Math.abs(top - 390);


            if (distance < closestDistance) {

                closestDistance = distance;
                closest = note;

            }

        });


        if (!closest ||
            closestDistance > 100) {

            miss();
            return;
        }


        closest.remove();

        hit(closestDistance);


        /*
           Flash target
        */

        const target =
            document.querySelector(
                `.targets div[data-key="${key}"]`
            );

        if (target) {

            target.classList.add("hit");

            setTimeout(() => {
                target.classList.remove("hit");
            }, 100);

        }

    }
);


/* HIT */

function hit(distance) {

    let points = 0;

    if (distance < 25) {

        points = 100;

        showJudgement("PERFECT!");

    }

    else if (distance < 55) {

        points = 75;

        showJudgement("GREAT!");

    }

    else {

        points = 50;

        showJudgement("GOOD!");

    }


    score += points;

    combo++;

    health =
        Math.min(
            100,
            health + 1
        );


    /*
       Make the game harder
       every 500 points.
    */

    noteSpeed =
        2.5 +
        Math.floor(score / 500) * 0.5;


    updateHUD();

}


/* MISS */

function miss() {

    misses++;

    combo = 0;

    score =
        Math.max(
            0,
            score - 25
        );


    health =
        Math.max(
            0,
            health - 10
        );


    showJudgement("MISS!");


    updateHUD();


    /*
       5 misses = faster notes
    */

    if (misses >= 5) {

        noteSpeed = 4;

    }


    /*
       10 misses = LOSE
    */

    if (misses >= 10 ||
        health <= 0) {

        endGame();

    }

}


/* JUDGEMENT */

function showJudgement(text) {

    const element =
        document.getElementById("judgement");

    element.textContent = text;

    element.style.transform =
        "scale(1.3)";

    setTimeout(() => {

        element.style.transform =
            "scale(1)";

    }, 120);

}


/* HUD */

function updateHUD() {

    document.getElementById("score")
        .textContent = score;

    document.getElementById("combo")
        .textContent = combo;

    document.getElementById("misses")
        .textContent = misses;

    document.getElementById("health")
        .style.width = health + "%";

}


/* LOSE */

function endGame() {

    gameRunning = false;

    clearTimeout(spawnTimer);

    document
        .getElementById("game")
        .classList.add("hidden");

    document
        .getElementById("loseScreen")
        .classList.remove("hidden");

    document
        .getElementById("finalScore")
        .textContent = score;

    document
        .getElementById("defeatedPlayer")
        .textContent =
        selectedCharacter[0];


    const music =
        document.getElementById("music");

    music.pause();

    document
        .getElementById("notes")
        .innerHTML = "";

}


/* RESTART */

function restartGame() {

    document
        .getElementById("loseScreen")
        .classList.add("hidden");

    document
        .getElementById("game")
        .classList.remove("hidden");

    startGame();

}
index.html
