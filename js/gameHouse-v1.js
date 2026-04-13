/* ====================================================================================
   gameHouse Ver. 1
   6 April, 2026
   Galang Prihadi Mahardhika
==================================================================================== */


document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

class gameHouse {
    /* ================================================================================
        WEB ELEMENTS
    ================================================================================ */

    curtain = document.querySelector("#curtain");

    eTurn = document.getElementById("eTurn");
    eBudget = document.getElementById("eBudget");
    eProfit = document.getElementById("eProfit");
    btnExit = document.getElementById("btnExit");

    timelinePanel = document.getElementById("timeline-panel");
    tasks = [];


    projectPanel = document.getElementById("project-panel");
    projects = [];
    pValue = [];
    pEffort = [];

    teamPanel = document.getElementById("team-panel");
    teams = [];
    tSpeed = [];
    tSalary = [];
    tStress = [];
    tProject = [];
    tBoost = [];
    tMinus = [];
    tPlus = [];


    /* ================================================================================
        GENERAL FUNCTIONS
    ================================================================================ */
    
    // ====================================================================================== GAME TRANSITION
    setGameTransition(status, functionToBeRun){     // status: "open", "close", or "reopen"
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
                    window.location.href = this.homePage;
                }, 200);
            }

            this.curtain.removeAttribute("style");
            this.curtain.classList.add("close");
            this.curtain.addEventListener("animationend", handler);
        }

        else if (status.toLowerCase() == "reopen") {
            const handlerOpen = () => {
                this.curtain.removeAttribute("style");
                this.curtain.style.display = "none";
                this.curtain.classList.remove("open");
                this.curtain.removeEventListener("animationend", handlerOpen);
            }

            const handlerClose = () => {
                this.curtain.removeAttribute("style");
                this.curtain.classList.remove("close");
                this.curtain.classList.add("open");
                this.curtain.removeEventListener("animationend", handlerClose);
                this.curtain.addEventListener("animationend", handlerOpen);

                functionToBeRun();
            }

            this.curtain.removeAttribute("style");
            this.curtain.classList.add("close");
            this.curtain.addEventListener("animationend", handlerClose);
        }
    }


    // ====================================================================================== RANDOM FUNCTION
    rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    // ====================================================================================== LOAD GAME
    loadGame() {


    }




    /* ================================================================================
        CONSTRUCTOR
    ================================================================================ */

    constructor(param) {

        this.loadGame();

        this.setGameTransition("open");


    }

}