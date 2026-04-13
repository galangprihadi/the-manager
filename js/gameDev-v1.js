
/* ====================================================================================
   theManager Ver. 1
   1 April, 2026
   Galang Prihadi Mahardhika
==================================================================================== */


document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

class TheManager {
    /* ================================================================================
        WEB ELEMENTS
    ================================================================================ */

    curtain = document.querySelector("#curtain");

    eTurn = document.getElementById("eTurn");
    eBudget = document.getElementById("eBudget");
    eProfit = document.getElementById("eProfit");
    btnRun = document.getElementById("btnRun");

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

    randomName() {
        const names = [
            "Brad", "Becky", "Benny", "David", "Arthur", "Adam", "Aaron", "Ethan", "Finn", "Ryan", 
            "Hudson", "Owen", "Simon", "Connor", "Victor", "John", "Jannet", "Jude", "Kai", "Thomas", 
            "Nash", "Nico", "Otis", "Mark", "Reed", "Kevin", "Zane", "Rico", "Otto", "Erik"
        ];

        names.forEach((name) => {
            const randNum = this.rand(0, names.length-1);
            const tempName = name;
            name = names[randNum];
            names[randNum] = tempName;
        });

        return names;
    }


    // ====================================================================================== LOAD GAME
    loadGame() {

        // Projects
        this.projectPanel.innerHTML = "";

        for (let i=0; i < this.gameConfig.projects.length; i++) {
            this.projects[i] = document.createElement("div");
            this.projects[i].classList.add("project");

            this.projects[i].innerHTML = `
                <div class="title">Project ${i+1}</div>
                <div class="text"><i class="fa-solid fa-coins"></i> <span id="value">-</span></div>
                <div class="text"><i class="fa-solid fa-list-check"></i> <span id="effort">-</span></div>
                <div class="text"><i class="fa-solid fa-triangle-exclamation"></i> <span>${this.gameConfig.projects[i].risk}%</span></div>
            `;

            this.pValue.push(this.projects[i].querySelector("#value"));
            this.pEffort.push(this.projects[i].querySelector("#effort"));

            this.projectPanel.append(this.projects[i]);
        }

        // Teams
        this.teamPanel.innerHTML = "";
        const names = this.randomName();

        for (let i=0; i < this.gameConfig.teams.length; i++) {

            this.teams[i] = document.createElement("div");
            this.teams[i].classList.add("team");

            this.teams[i].innerHTML = `
                ${names[i]}
                <div class="col2">
                    <div class="text">Speed <span id="speed">-</span></div>
                    <div class="text">Salary <span id="salary">-</span></div>
                </div>
                <div class="col2">
                    <div class="text">Stress <span id="stress">-</span></div>
                    <button id="boost">boost</button>
                </div>
                <div class="col3">
                    <button id="minus"><i class="fa-solid fa-angle-left"></i></button>
                    <div class="text">Project<span id="project">-</span></div>
                    <button id="plus"><i class="fa-solid fa-angle-right"></i></button>
                </div>
            `;

            this.tSpeed.push(this.teams[i].querySelector("#speed"));
            this.tSalary.push(this.teams[i].querySelector("#salary"));
            this.tStress.push(this.teams[i].querySelector("#stress"));
            this.tProject.push(this.teams[i].querySelector("#project"));

            // Boost Button
            const btnBoost = this.teams[i].querySelector("#boost");
            btnBoost.addEventListener("click", () => {
                if (this.gameConfig.teams[i].stress < 100 && this.gameConfig.teams[i].project != 0) {
                    this.gameConfig.teams[i].boost = !this.gameConfig.teams[i].boost;

                    if (this.gameConfig.teams[i].boost) {
                        btnBoost.classList.add("active");

                        this.gameConfig.teams[i].extraSpeed = this.gameConfig.teams[i].boostRange;
                        this.gameConfig.teams[i].bonus = this.bonusSalary;
                    }
                    else {
                        btnBoost.classList.remove("active");

                        this.gameConfig.teams[i].extraSpeed = 0;
                        this.gameConfig.teams[i].bonus = 0;
                    }

                    this.loadContent();
                }
            });

            // Minus Button 
            const btnMinus = this.teams[i].querySelector("#minus");
            btnMinus.addEventListener("click", () => {
                this.gameConfig.teams[i].project -= 1;

                if (this.gameConfig.teams[i].project < 0) {
                    this.gameConfig.teams[i].project = this.gameConfig.projects.length;
                }

                this.loadContent();
            });

            // Plus Button
            const btnPlus = this.teams[i].querySelector("#plus");
            btnPlus.addEventListener("click", () => {
                this.gameConfig.teams[i].project += 1;

                if (this.gameConfig.teams[i].project > this.gameConfig.projects.length) {
                    this.gameConfig.teams[i].project = 0;
                }

                this.loadContent();
            });

            this.tBoost.push(btnBoost);
            this.tMinus.push(btnMinus);
            this.tPlus.push(btnPlus);

            this.teamPanel.append(this.teams[i]);
        }

        this.loadContent();
        this.gameTurn();
    }


    // ====================================================================================== LOAD CONTENT
    loadContent() {
        this.eTurn.innerHTML = `${this.gameConfig.turn}/${this.gameConfig.maxTurn}`;
        this.eBudget.innerHTML = `${this.gameConfig.budget}`;
        this.eProfit.innerHTML = `${this.gameConfig.profit}`;

        // Projects
        for (let i=0; i < this.gameConfig.projects.length; i++) {
            this.pValue[i].innerHTML = this.gameConfig.projects[i].value;

            if (this.gameConfig.projects[i].extraRisk > 0) {
                this.pEffort[i].classList.add("red");
                this.pEffort[i].innerHTML = `${this.gameConfig.projects[i].effort}/${this.gameConfig.projects[i].maxEffort}+${this.gameConfig.projects[i].extraRisk}`;
                this.gameConfig.projects[i].maxEffort += this.gameConfig.projects[i].extraRisk;
                this.gameConfig.projects[i].extraRisk = 0;
            }
            else {
                this.pEffort[i].classList.remove("red");
                this.pEffort[i].innerHTML = `${this.gameConfig.projects[i].effort}/${this.gameConfig.projects[i].maxEffort}`;
            }

            if (this.gameConfig.projects[i].effort >= this.gameConfig.projects[i].maxEffort) {
                this.projects[i].classList.add("finished");
            }
        }

        // Teams
        for (let i=0; i < this.gameConfig.teams.length; i++) {
            // Speed
            if (this.gameConfig.teams[i].extraSpeed < 0) {
                this.tSpeed[i].innerHTML = `${this.gameConfig.teams[i].speed}${this.gameConfig.teams[i].extraSpeed}`;
            }
            else if (this.gameConfig.teams[i].extraSpeed > 0) {
                this.tSpeed[i].innerHTML = `${this.gameConfig.teams[i].speed}+${this.gameConfig.teams[i].extraSpeed}`;
            }
            else {
                this.tSpeed[i].innerHTML = this.gameConfig.teams[i].speed;
            }

            // Salary
            if (this.gameConfig.teams[i].project != 0){
                this.tSalary[i].classList.remove("red");

                if (this.gameConfig.teams[i].bonus > 0) {
                    this.tSalary[i].innerHTML = `${this.gameConfig.teams[i].salary}+${this.gameConfig.teams[i].bonus}`;
                }
                else {
                    this.tSalary[i].innerHTML = this.gameConfig.teams[i].salary;
                }
            }
            else {
                this.tSalary[i].classList.add("red");
                this.tSalary[i].innerHTML = Math.round(this.gameConfig.teams[i].salary/2);
            }
            
            // Stress
            if (this.gameConfig.teams[i].stress >= 100) {
                this.tStress[i].classList.add("red");
                this.tSpeed[i].classList.add("red");
            }
            else {
                this.tStress[i].classList.remove("red");
                this.tSpeed[i].classList.remove("red");
            }
            this.tStress[i].innerHTML = `${this.gameConfig.teams[i].stress}%`;

            // Project
            if (this.gameConfig.teams[i].project == 0){
                this.tProject[i].innerHTML = "off";
            }
            else {
                this.tProject[i].innerHTML = this.gameConfig.teams[i].project;
            }
        }

    }


    // ====================================================================================== GAME TURN
    gameTurn() {
        this.btnRun.addEventListener("click", () => {

            if (!this.gameOver){
                let teamSalary = 0;

                this.gameConfig.teams.forEach((team, i) => {                  

                    // Salary
                    teamSalary += team.salary + team.bonus;

                    if (team.project != 0) {
                        // Projects
                        this.gameConfig.projects[team.project-1].effort += team.speed + team.extraSpeed;

                        // Stress
                        team.stress += team.stressScale;
                    }
                    else {
                        // Reset stress
                        team.stress = 0;
                    }

                    // Reset Boost button
                    this.gameConfig.teams[i].boost = false;
                    this.tBoost[i].classList.remove("active");
                    this.gameConfig.teams[i].extraSpeed = 0;
                    this.gameConfig.teams[i].bonus = 0;

                    // Stress checking
                    if (team.stress >= 100) {
                        team.extraSpeed = 0 - team.boostRange;
                    }
                });

                this.gameConfig.projects.forEach((project, i) => {
                    // Finished project checking
                    if (project.active && project.effort >= project.maxEffort) {
                        project.active = false;

                        this.gameConfig.profit += project.value;
                        this.gameConfig.budget += project.value;

                        this.gameConfig.finishedProjects += 1;
                    }

                    // Risk generation
                    if (project.effort < project.maxEffort) {
                        if (this.rand(0, 100) <= project.risk) {
                            project.extraRisk = project.riskEffort;
                        }
                    }

                });


                // Turn
                this.gameConfig.turn += 1;

                // Budget
                this.gameConfig.budget -= teamSalary;


                this.loadContent();

                if (this.gameConfig.turn >= this.gameConfig.maxTurn || this.gameConfig.budget < 0 || this.gameConfig.finishedProjects == this.gameConfig.projects.length){
                    this.gameOver = true;

                    console.log("Game Over");
                }

            }

            


        });
    }


    /* ================================================================================
        PROCEDURAL CONTENT GENERATION ENGINE
    ================================================================================ */
    
    generateProject(duration = "normal") {
        const durationMap = {
            short: { 
                budget: 2000,
                maxTurn: 10,
                numOfTask: 4,
                value: [600, 1000],
                maxEffort: [10, 30],
                risk: [3, 15],
                riskEffort: [4, 9],
            },

            normal: { 
                budget: 2000,
                maxTurn: 20,
                numOfTask: 8,
                value: [600, 1000],
                maxEffort: [80, 140],
                risk: [3, 15],
                riskEffort: [4, 9],
            },

            long: { 
                budget: 6000,
                maxTurn: 30,
                numOfTask: 12,
                value: [600, 1000],
                maxEffort: [10, 30],
                risk: [3, 15],
                riskEffort: [4, 9],
            },
        }

        const teamMap = {
            short: {
                numOfTeam: 3,
                speed: [10, 15],
                salary: [30, 40],
                boost: [2, 5],
                stressScale: [15, 25],
            },

            normal: {
                numOfTeam: 4,
                speed: [10, 15],
                salary: [30, 40],
                boost: [2, 5],
                stressScale: [15, 25],
            },

            long: {
                numOfTeam: 6,
                speed: [10, 15],
                salary: [30, 40],
                boost: [2, 5],
                stressScale: [15, 25],
            }
        }

        const projectConfig = durationMap[duration];
        const teamConfig = teamMap[duration];
        const projects = [];
        const teams = [];

        for (let i=0; i < projectConfig.numOfTask; i++) {
            projects.push({
                id: i + 1,
                value: this.rand(projectConfig.value[0], projectConfig.value[1]),
                effort: 0,
                maxEffort: this.rand(projectConfig.maxEffort[0], projectConfig.maxEffort[1]),
                risk: this.rand(projectConfig.risk[0], projectConfig.risk[1]),
                riskEffort: this.rand(projectConfig.riskEffort[0], projectConfig.riskEffort[1]),
                extraRisk: 0,
                active: true
            });
        }

        for (let i=0; i < teamConfig.numOfTeam; i++) {
            teams.push({
                id: i + 1,
                speed: this.rand(teamConfig.speed[0], teamConfig.speed[1]),
                extraSpeed: 0,
                salary: this.rand(teamConfig.salary[0], teamConfig.salary[1]),
                bonus:0,
                stress: 0,
                stressScale: this.rand(teamConfig.stressScale[0], teamConfig.stressScale[1]),
                project: 0,
                boostRange: this.rand(teamConfig.boost[0], teamConfig.boost[1]),
                boost: false
            });
        }

        return {
            turn: 0,
            maxTurn: projectConfig.maxTurn,
            budget: projectConfig.budget,
            profit: 0,
            finishedProjects: 0,
            projects,
            teams,
        }
    }


    /* ================================================================================
        CONSTRUCTOR
    ================================================================================ */

    constructor(param) {
        this.gameType = param.gameType || "normal";
        this.bonusSalary = param.bonusSalary || 10;

        this.gameOver = false;

        // Content generation
        this.gameConfig = this.generateProject(this.gameType);

        // Starting game
        this.loadGame();
        this.setGameTransition("open");


    }



}