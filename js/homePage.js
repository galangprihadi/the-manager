
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

class HomePage {
    
    /* ================================================================================
        SOUNDS
    ================================================================================ */
    sounds = {
        transition: new Howl({
            src: "../sounds/transition.mp3",
        }),

        pop: new Howl({
            src: "../sounds/pop.mp3",
        }),

        silent: new Howl({
            src: "../sounds/pop.mp3",
            volume: 0,
            autoplay: true,
        }),
    }


    /* ================================================================================
        GENERAL FUNCTIONS
    ================================================================================ */

    // ====================================================================================== GAME TRANSITION
    setGameTransition(status, destination){     // status: "open" or "close"
        if (status.toLowerCase() == "open") {
            
            const handler = () => {
                this.curtain.style.display = "none";
                this.curtain.classList.remove("open");
                this.curtain.removeEventListener("animationend", handler);
            }

            this.curtain.classList.add("open");
            this.curtain.addEventListener("animationend", handler);
        }

        else if (status.toLowerCase() == "close") {
            this.sounds.pop.play();
            this.sounds.transition.play();

            const handler = () => {
                setTimeout(() => {
                    window.location.href = destination;
                }, 200);
            }

            this.curtain.removeAttribute("style");
            this.curtain.classList.add("close");
            this.curtain.addEventListener("animationend", handler);
        }
    }


    /* ================================================================================
        CONSTRUCTOR
    ================================================================================ */

    constructor() {

        // ================================================================================== WEB ELEMENTS
        this.curtain = document.querySelector("#curtain");

        this.btnPlay = document.querySelector("#btnPlay");

        this.btnPlay.addEventListener("click", () => {
            this.setGameTransition('close', 'pages/theManager.html');
        });

        setTimeout(() => {
            this.setGameTransition("open");
        }, 100);
        
    }
}