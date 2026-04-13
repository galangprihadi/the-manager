
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

class HomePage {
    /* ================================================================================
        WEB ELEMENTS
    ================================================================================ */

    


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




        this.setGameTransition("open");
    }
}