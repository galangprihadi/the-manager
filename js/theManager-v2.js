
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
    eMoney = document.getElementById("eMoney");
    eProfit = document.getElementById("eProfit");
    btnSymbol = document.getElementById("btnSymbol");
    btnRun = document.getElementById("btnRun");

    projectPanel = document.getElementById("project-panel");
    projects = [];

    teamPanel = document.getElementById("team-panel");
    teams = [];
    simWeeks = [];
    simCosts = [];
    simProfits = [];
    teamPos = [];


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
        this.projectPanel.innerHTML = "";

        for (let i=0; i < this.gameConfig.numOfProject; i++) {
            this.projects[i] = document.createElement("div");
            this.projects[i].classList.add("project");
            this.projectPanel.append(this.projects[i]);
        }

        this.teamPanel.innerHTML = "";

        for (let i=0; i < this.gameConfig.numOfTeam; i++) {
            this.teams[i] = document.createElement("div");
            this.teams[i].classList.add("team");
            this.teamPanel.append(this.teams[i]);
        }

        this.loadContent();

        setTimeout(() => {
            this.setGameTransition("open");
        }, 100);
    }


    // ====================================================================================== LOAD CONTENT
    loadContent() {
        // Game
        this.eTurn.innerHTML = this.gameConfig.week;
        this.eMoney.innerHTML = this.gameConfig.money;
        this.eProfit.innerHTML = this.gameConfig.profit;

        // Projects
        for (let i=0; i < this.gameConfig.numOfProject; i++) {
            const project = this.gameConfig.projects[i];

            if (project.active) {
                this.projects[i].classList.add("active");
            }
            else{
                this.projects[i].classList.remove("active");
            }

            this.projects[i].innerHTML = "";

            if (project.tempOvertask == 0) {
                this.projects[i].innerHTML = `
                    <div class="title">P${project.id}</div>
                    <div class="icon"><i class="fa-solid fa-coins"></i></div> <div class="value">${project.value}</div>
                    <div class="icon"><i class="fa-solid fa-list-check"></i></div> <div class="value">${project.task}</div>
                    <div class="icon"><i class="fa-solid fa-calendar-days"></i></div> <div class="value">${project.duration}</div>
                    <div class="icon"><i class="fa-solid fa-gauge-simple-high"></i></div> <div class="value">${project.taskPerWeek}/w</div>
                    <div class="icon red"><i class="fa-solid fa-triangle-exclamation"></i></div> <div class="value red">${project.risk}%</div>
                `;
            }
            else {
                this.projects[i].innerHTML = `
                    <div class="title">P${project.id}</div>
                    <div class="icon"><i class="fa-solid fa-coins"></i></div> <div class="value">${project.value}</div>
                    <div class="icon red"><i class="fa-solid fa-list-check"></i></div> <div class="value red">${project.task}+${project.tempOvertask}</div>
                    <div class="icon"><i class="fa-solid fa-calendar-days"></i></div> <div class="value">${project.duration}</div>
                    <div class="icon"><i class="fa-solid fa-gauge-simple-high"></i></div> <div class="value">${project.taskPerWeek}/w</div>
                    <div class="icon red"><i class="fa-solid fa-triangle-exclamation"></i></div> <div class="value red">${project.risk}%</div>
                `;

                project.task += project.tempOvertask;
            }
            
        }

        // Teams
        for (let i=0; i < this.gameConfig.numOfTeam; i++) {
            const team = this.gameConfig.teams[i];
            let posText = "Off";

            if (team.pos != -1) {
                posText = team.pos;
            }

            this.teams[i].innerHTML = "";

            if (team.working == 0) {
                this.teams[i].classList.remove("active");

                this.teams[i].innerHTML = `
                    <div class="title">Team ${team.id + 1}</div>
                    <div class="icon"><i class="fa-solid fa-gauge-simple-high"></i></div> <div class="value">${team.speed}/week</div>
                    <div class="icon"><i class="fa-solid fa-wallet"></i></div> <div class="value">${team.cost}/task</div>
                    <div class="label">Simulation</div>
                    <div class="icon"><i class="fa-solid fa-calendar-days"></i></div> <div class="value" id="simDay">-</div>
                    <div class="icon"><i class="fa-solid fa-wallet"></i></div> <div class="value" id="simCost">-</div>
                    <div class="icon"><i class="fa-solid fa-money-bill-trend-up"></i></div> <div class="value" id="simProfit">-</div>
                    <div class="wrap">
                        <button id="btnMinus"><i class="fa-solid fa-angle-left"></i></button>
                        <div class="pos" id="teamPos">${posText}</div>
                        <button id="btnPlus"><i class="fa-solid fa-angle-right"></i></button>
                    </div>
                `;

                this.simWeeks[i] = this.teams[i].querySelector("#simDay");
                this.simCosts[i] = this.teams[i].querySelector("#simCost");
                this.simProfits[i] = this.teams[i].querySelector("#simProfit");
                this.teamPos[i] = this.teams[i].querySelector("#teamPos");

                this.teams[i].querySelector("#btnMinus").addEventListener("click", () => {
                    this.shiftProject(i, -1);
                });

                this.teams[i].querySelector("#btnPlus").addEventListener("click", () => {
                    this.shiftProject(i, 1);
                });
            }
            else {
                this.teams[i].classList.add("active");

                if (this.gameConfig.projects[team.pos].tempOvertask == 0) {
                    this.teams[i].innerHTML = `
                        <div class="title">Team ${team.id + 1}</div>
                        <div class="icon"><i class="fa-solid fa-calendar-days"></i></div> <div class="value">${team.working}</div>
                        <div class="icon"><i class="fa-solid fa-wallet"></i></div> <div class="value">${team.salary}</div>
                        <div class="icon"><i class="fa-solid fa-money-bill-trend-up"></i></div> <div class="value">${team.profit} (${Math.round(team.profit / team.period)}/w}</div>
                        <div class="label">Working on<br>Project ${team.pos + 1}</div>
                    `;
                }
                else {
                    this.gameConfig.projects[team.pos].tempOvertask = 0;
                    team.salary = this.gameConfig.projects[team.pos].task * team.cost;
                    team.profit = this.gameConfig.projects[team.pos].value - team.salary;

                    this.teams[i].innerHTML = `
                        <div class="title">Team ${team.id + 1}</div>
                        <div class="icon"><i class="fa-solid fa-calendar-days"></i></div> <div class="value">${team.working}</div>
                        <div class="icon red"><i class="fa-solid fa-wallet"></i></div> <div class="value red">${team.salary}</div>
                        <div class="icon red"><i class="fa-solid fa-money-bill-trend-up"></i></div> <div class="value red">${team.profit}</div>
                        <div class="label">Working on<br>Project ${team.pos + 1}</div>
                        <div class="label red">Over task!</div>
                    `;
                }
            }
        }        
    }


    // ====================================================================================== SHIFT PROJECT
    shiftProject(index, iteration) {
        const team = this.gameConfig.teams[index];
        const nProject = this.gameConfig.numOfProject;
        let tempProject = team.pos;
        let lastProject = team.pos;

        for (let i=0; i < nProject; i++) {
            tempProject += iteration;
            
            if (tempProject >= nProject) {
                tempProject = -1;
            }
            else if (tempProject < -1) {
                tempProject = nProject - 1;
            }
            
            if (tempProject == -1) {
                this.gameConfig.projects[lastProject].active = false;

                team.pos = tempProject;
                team.working = 0;
                team.tempSalary = 0;
                team.profit = 0;

                this.teamPos[index].innerHTML = "Off";
                this.simWeeks[index].innerHTML = "-";
                this.simCosts[index].innerHTML = "-";
                this.simProfits[index].innerHTML = "-";

                this.checkPossiblePlan();

                break;
            }
            else if (this.gameConfig.projects[tempProject].active == false && this.gameConfig.projects[tempProject].taskPerWeek <= team.speed) {
                if (lastProject != -1) {
                    this.gameConfig.projects[lastProject].active = false;
                }
                
                this.gameConfig.projects[tempProject].active = true;
                
                team.pos = tempProject;
                team.working = Math.ceil(this.gameConfig.projects[team.pos].task / team.speed);
                team.period = team.working;
                team.tempSalary = this.gameConfig.projects[team.pos].task * team.cost;
                team.profit = this.gameConfig.projects[team.pos].value - team.tempSalary;

                this.teamPos[index].innerHTML = `P${team.pos + 1}`;
                this.simWeeks[index].innerHTML = `${team.working} weeks`;
                this.simCosts[index].innerHTML = team.tempSalary;
                this.simProfits[index].innerHTML = `${team.profit} (${Math.round(team.profit / team.period)}/w)`;

                this.checkPossiblePlan();

                break;
            }
        }
    }


    // ====================================================================================== CHECK POSSIBLE PLAN
    checkPossiblePlan(){
        let totalSalary = 0;

        for (let i=0; i < this.gameConfig.numOfTeam; i++) {
            totalSalary += this.gameConfig.teams[i].tempSalary;
        }

        if (totalSalary > this.gameConfig.money) {
            this.eMoney.classList.add("red");
            this.btnRun.classList.add("passive");
            this.gameConfig.turnPossible = false;
        }
        else {
            this.eMoney.classList.remove("red");
            this.btnRun.classList.remove("passive");
            this.gameConfig.turnPossible = true;
        }
    }
    

    /* ================================================================================
        PROCEDURAL CONTENT GENERATION ENGINE
    ================================================================================ */

    // ====================================================================================== GENERATE GAME CONTENT
    generateGameContent() {
        const numOfTeam = this.numOfTeam;
        const numOfProject = this.numOfProject;
        const projects = [];
        const teams = [];

        const config = {
            money: 1000,

            // Project
            minDuration: 3,
            maxDuration: 8,
            minTaskPerWeek: 4,
            taskRange: 4,
            riskRange: 5,
            riskPercentage: 0.05,

            // Team
            minSpeedPerWeek: 8,
            speedRange: 4,
            minCostPerTask: 6,
            costRange: 2,
        }

        // Project generation
        for (let i=0; i < numOfProject; i++) {
            const duration = this.rand(config.minDuration, config.maxDuration);

            const maxTaskPerWeek = (numOfTeam * config.taskRange) + config.minTaskPerWeek;
            const taskPerWeek = this.rand(config.minTaskPerWeek, maxTaskPerWeek);
            const task = taskPerWeek * duration;

            const minValuePerTask = (numOfTeam * config.costRange) + config.minCostPerTask + (taskPerWeek - config.minTaskPerWeek);
            const maxValuePerTask = minValuePerTask + (numOfTeam * config.costRange);

            const valuePerTask = this.rand(minValuePerTask, maxValuePerTask);
            const value = task * valuePerTask;

            const riskMax = Math.round((taskPerWeek * 0.3) + (valuePerTask * 0.5));
            const risk = this.rand(riskMax-config.riskRange, riskMax);
            const overTask = Math.round(task * config.riskPercentage);

            projects[i] = ({
                id: i+1,
                value: value,
                task: task,
                duration: duration,
                taskPerWeek: taskPerWeek,
                valuePerTask: valuePerTask,
                riskMax: riskMax,
                risk: risk,
                overtask: overTask,
                tempOvertask: 0,
                active: false,
                finished: false,
            });
        }

        // Team generation
        for (let i=0; i < numOfTeam; i++) {
            teams[i] = ({
                id: i+1,
                speed: config.minSpeedPerWeek + (config.speedRange * i),
                cost: config.minCostPerTask + (config.costRange * i),
                pos: -1,
                working: 0,
                salary:0,
                tempSalary: 0,
                profit: 0,
                period: 0,
            });
        }

        return {
            config,
            numOfTeam,
            numOfProject,
            week: 0,
            money: config.money,
            profit: 0,
            projects,
            teams,
            gameOver: false,
            turnPossible: true,
        }
    }


    // ====================================================================================== UPDATE PROJECTS
    updateProject() {
        const projects = this.gameConfig.projects;
        const config = this.gameConfig.config;
        const numOfProject = this.gameConfig.numOfProject;
        const numOfTeam = this.gameConfig.numOfTeam;

        // Project generation
        for (let i=0; i < numOfProject; i++) {
            if (projects[i].active == false) {
                const duration = this.rand(config.minDuration, config.maxDuration);

                const maxTaskPerWeek = (numOfTeam * config.taskRange) + config.minTaskPerWeek;
                const taskPerWeek = this.rand(config.minTaskPerWeek, maxTaskPerWeek);
                const task = taskPerWeek * duration;

                const minValuePerTask = (numOfTeam * config.costRange) + config.minCostPerTask + (taskPerWeek - config.minTaskPerWeek);
                const maxValuePerTask = minValuePerTask + (numOfTeam * config.costRange);

                const valuePerTask = this.rand(minValuePerTask, maxValuePerTask);
                const value = task * valuePerTask;

                const riskMax = Math.round((taskPerWeek * 0.3) + (valuePerTask * 0.5));
                const risk = this.rand(riskMax-config.riskRange, riskMax);
                const overTask = Math.round(task * config.riskPercentage);

                projects[i] = ({
                    id: i+1,
                    value: value,
                    task: task,
                    duration: duration,
                    taskPerWeek: taskPerWeek,
                    valuePerTask: valuePerTask,
                    riskMax: riskMax,
                    risk: risk,
                    overtask: overTask,
                    tempOvertask: 0,
                    active: false,
                    finished: false,
                });
            }
        }

        this.loadContent();
    }


    /* ================================================================================
        BUTTON FUNCTIONS
    ================================================================================ */

    buttonFunctions(){

        // ================================================================================== RUN PLAN
        this.btnRun.addEventListener("click", () => {
            if (this.gameConfig.turnPossible) {
                this.gameConfig.week += 1;

                // Risk gambling
                for (let i=0; i < this.gameConfig.numOfProject; i++) {
                    const project = this.gameConfig.projects[i];

                    if (project.active) {
                        const prob = this.rand(1, 100);

                        if (prob <= project.risk) {
                            project.tempOvertask = project.overtask;
                        }
                    }
                }

                // Update team progress
                for (let i=0; i < this.gameConfig.numOfTeam; i++) {
                    const team = this.gameConfig.teams[i];

                    if (team.tempSalary != 0) {
                        this.gameConfig.money -= team.tempSalary;
                        team.salary = team.tempSalary;
                        team.tempSalary = 0;
                    }

                    if (team.working > 0) {
                        team.working -= 1;
                    }

                    if (team.salary > 0 && team.working == 0) {
                        this.gameConfig.money += team.profit;
                        this.gameConfig.profit += team.profit;
                        this.gameConfig.projects[team.pos].active = false;
                        team.profit = 0;
                        team.salary = 0;
                        team.pos = -1;
                        team.period = 0;
                    }
                }

                this.updateProject();
            }
        });
    }


    /* ================================================================================
        CONSTRUCTOR
    ================================================================================ */

    constructor(param) {
        this.numOfProject = param.numOfProject || 8;
        this.numOfTeam = param.numOfTeam || 3;

        // Generate game configuration
        this.gameConfig = this.generateGameContent();

        // Load the game and content
        this.loadGame();

        // The button functions
        this.buttonFunctions();



    }



}