
/* ====================================================================================
   theManager Ver. 3
   April 9, 2026
   Galang P. Mahardhika
==================================================================================== */


document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

class TheManager {
    /* ================================================================================
        WEB ELEMENTS
    ================================================================================ */

    curtain = document.querySelector("#curtain");
    textCurtain = document.querySelector("#text-curtain");

    gameHelp = document.querySelector("#game-help");
    theMission = document.querySelector("#the-mission");

    eTurn = document.getElementById("eTurn");
    eMoney = document.getElementById("eMoney");
    eProfit = document.getElementById("eProfit");

    btnExit = document.getElementById("btnExit");
    btnHelp = document.getElementById("btnHelp");
    btnCloseHelp = document.getElementById("btnCloseHelp");
    btnRun = document.getElementById("btnRun");

    projectPanel = document.getElementById("project-panel");
    eProjects = [];

    teamPanel = document.getElementById("team-panel");
    eTeams = [];
    eSimWeeks = [];
    eSimCosts = [];
    eSimProfits = [];
    eTeamPos = [];


    /* ================================================================================
        GENERAL FUNCTIONS
    ================================================================================ */
    
    // ====================================================================================== GAME TRANSITION
    setGameTransition(status){     // status: "open", "close", or "reopen"
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

            this.textCurtain.innerHTML = `Good bye...`;

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
                this.curtain.removeEventListener("animationend", handlerClose);

                this.updateProjects();

                setTimeout(() => {
                    this.curtain.classList.add("open");
                    this.curtain.addEventListener("animationend", handlerOpen);
                }, 2000);
            }

            if (this.gameConfig.turn < this.gameConfig.maxTurn) {
                this.textCurtain.innerHTML = `Week ${this.gameConfig.turn} is underway...`;
            }
            else {
                this.textCurtain.innerHTML = `This is the last week.<br>Congratulations...`;
            }

            this.curtain.removeAttribute("style");
            this.curtain.classList.add("close");
            this.curtain.addEventListener("animationend", handlerClose);
        }
    }


    // ====================================================================================== GAME HELP
    gameHelpPanel(status){     // status: "open" or "close"
        if (status.toLowerCase() == "open") {
            const handler = () => {
                this.gameHelp.style.display = "none";
                this.gameHelp.classList.remove("open");
                this.gameHelp.removeEventListener("animationend", handler);
            }

            this.gameHelp.classList.add("open");
            this.gameHelp.addEventListener("animationend", handler);
        }
        else if (status.toLowerCase() == "close") {
            const handler = () => {
                
            }

            this.gameHelp.removeAttribute("style");
            this.gameHelp.classList.add("close");
            this.gameHelp.addEventListener("animationend", handler);
        }
    }

    
    // ====================================================================================== RANDOM FUNCTION
    rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    skill(type){
        if (type == 0) {
            return `<i class="fa-brands fa-html5"></i>`;
        }
        else if (type == 1) {
            return `<i class="fa-brands fa-html5"></i> <i class="fa-brands fa-square-js"></i>`;
        }
        else if (type == 2) {
            return `<i class="fa-brands fa-html5"></i> <i class="fa-brands fa-square-js"></i> <i class="fa-brands fa-python"></i>`;
        }
    }


    // ====================================================================================== LOAD GAME
    loadGame() {
        this.projectPanel.innerHTML = "";

        for (let i=0; i < this.gameConfig.config.numOfProject; i++) {
            this.eProjects[i] = document.createElement("div");
            this.eProjects[i].classList.add("project");
            this.projectPanel.append(this.eProjects[i]);
        }

        this.teamPanel.innerHTML = "";

        for (let i=0; i < this.gameConfig.config.numOfTeam; i++) {
            this.eTeams[i] = document.createElement("div");
            this.eTeams[i].classList.add("team");
            this.teamPanel.append(this.eTeams[i]);
        }

        this.loadContent();

        this.theMission.innerHTML = `
            As the manager, you must assign the right projects to each team to maximize your company's profit. Every 
            project has its own required skill set and can only be handled by a team that meets those requirements.
            Each project can be assigned to only one team, and each team can work on only one project at a time. Some 
            projects may receive additional tasks (over task) depending on their project-risk probability. You'll need 
            to plan your strategy carefully to become an effective manager. You have ${this.gameConfig.maxTurn} weeks 
            to complete this mission.<br>Enjoy the game!
        `;

        setTimeout(() => {
            this.setGameTransition("open");
        }, 2000);
    }


    // ====================================================================================== LOAD CONTENT
    loadContent() {
        // Game
        this.eTurn.innerHTML = `${this.gameConfig.turn} / ${this.gameConfig.maxTurn}`;
        this.eMoney.innerHTML = this.gameConfig.budget;
        this.eProfit.innerHTML = this.gameConfig.profit;

        // Projects
        for (let i=0; i < this.gameConfig.config.numOfProject; i++) {
            const project = this.gameConfig.projects[i];

            if (project.active) {
                this.eProjects[i].classList.add("active");
            }
            else{
                this.eProjects[i].classList.remove("active");
            }

            this.eProjects[i].innerHTML = "";

            if (project.tempOverTask == 0) {
                this.eProjects[i].innerHTML = `
                    <div class="title">P${i+1}</div>
                    <div class="skill">${this.skill(project.type)}</div>
                    <div class="icon"><i class="fa-solid fa-coins"></i></div> <div class="value">${project.value}</div>
                    <div class="icon"><i class="fa-solid fa-list-check"></i></div> <div class="value">${project.task}</div>
                    <div class="icon"><i class="fa-solid fa-calendar-days"></i></div> <div class="value">${project.duration}</div>
                    <div class="icon red"><i class="fa-solid fa-triangle-exclamation"></i></div> <div class="value red">${project.risk}%</div>
                `;
            }
            else {
                this.eProjects[i].innerHTML = `
                    <div class="title">P${i+1}</div>
                    <div class="skill">${this.skill(project.type)}</div>
                    <div class="icon"><i class="fa-solid fa-coins"></i></div> <div class="value">${project.value}</div>
                    <div class="icon red"><i class="fa-solid fa-list-check"></i></div> <div class="value red">${project.task}+${project.tempOverTask}</div>
                    <div class="icon"><i class="fa-solid fa-calendar-days"></i></div> <div class="value">${project.duration}</div>
                    <div class="icon red"><i class="fa-solid fa-triangle-exclamation"></i></div> <div class="value red">${project.risk}%</div>
                `;

                project.task += project.tempOverTask;
            }
            
        }

        // Teams
        for (let i=0; i < this.gameConfig.config.numOfTeam; i++) {
            const team = this.gameConfig.teams[i];
            let posText = "Off";

            if (team.pos != -1) {
                posText = team.pos;
            }

            this.eTeams[i].innerHTML = "";

            if (team.working == 0) {
                this.eTeams[i].classList.remove("active");

                this.eTeams[i].innerHTML = `
                    <div class="title">Team ${i+1}</div>
                    <div class="skill">${this.skill(team.type)}</div>
                    <div class="icon"><i class="fa-solid fa-wallet"></i></div> <div class="value">${team.cost} / task</div>
                    <div class="label">Simulation</div>
                    <div class="icon"><i class="fa-solid fa-calendar-days"></i></div> <div class="value" id="simWeek">-</div>
                    <div class="icon"><i class="fa-solid fa-wallet"></i></div> <div class="value" id="simCost">-</div>
                    <div class="icon"><i class="fa-solid fa-money-bill-trend-up"></i></div> <div class="value" id="simProfit">-</div>
                    <div class="wrap">
                        <button id="btnMinus"><i class="fa-solid fa-angle-left"></i></button>
                        <div class="pos" id="teamPos">${posText}</div>
                        <button id="btnPlus"><i class="fa-solid fa-angle-right"></i></button>
                    </div>
                `;

                this.eSimWeeks[i] = this.eTeams[i].querySelector("#simWeek");
                this.eSimCosts[i] = this.eTeams[i].querySelector("#simCost");
                this.eSimProfits[i] = this.eTeams[i].querySelector("#simProfit");
                this.eTeamPos[i] = this.eTeams[i].querySelector("#teamPos");

                if (this.gameConfig.turn < this.gameConfig.maxTurn) {
                    this.eTeams[i].querySelector("#btnMinus").addEventListener("touchstart", () => {
                        this.shiftProject(i, -1);
                    });

                    this.eTeams[i].querySelector("#btnPlus").addEventListener("touchstart", () => {
                        this.shiftProject(i, 1);
                    });
                }
                else {
                    this.eTeams[i].querySelector("#btnMinus").classList.add("passive");
                    this.eTeams[i].querySelector("#btnPlus").classList.add("passive");
                }
                
            }
            else {
                this.eTeams[i].classList.add("active");

                if (this.gameConfig.projects[team.pos].tempOverTask == 0) {
                    this.eTeams[i].innerHTML = `
                        <div class="title">Team ${i+1}</div>
                        <div class="skill">${this.skill(team.type)}</div>
                        <div class="icon"><i class="fa-solid fa-calendar-days"></i></div> <div class="value">${team.working}</div>
                        <div class="icon"><i class="fa-solid fa-wallet"></i></div> <div class="value">${team.salary}</div>
                        <div class="icon"><i class="fa-solid fa-money-bill-trend-up"></i></div> <div class="value">${team.profit} (${Math.round(team.profit / team.duration)}/w)</div>
                        <div class="label">Working on<br>Project ${team.pos + 1}</div>
                    `;
                }
                else {
                    this.gameConfig.projects[team.pos].tempOverTask = 0;
                    team.salary = this.gameConfig.projects[team.pos].task * team.cost;
                    team.profit = this.gameConfig.projects[team.pos].value - team.salary;

                    this.eTeams[i].innerHTML = `
                        <div class="title">Team ${i+1}</div>
                        <div class="skill">${this.skill(team.type)}</div>
                        <div class="icon"><i class="fa-solid fa-calendar-days"></i></div> <div class="value">${team.working}</div>
                        <div class="icon red"><i class="fa-solid fa-wallet"></i></div> <div class="value red">${team.salary}</div>
                        <div class="icon red"><i class="fa-solid fa-money-bill-trend-up"></i></div> <div class="value red">${team.profit} (${Math.round(team.profit / team.duration)}/w)</div>
                        <div class="label">Working on<br>Project ${team.pos + 1}</div>
                        <div class="label red">Over task!</div>
                    `;
                }
            }
        }
        
        // Check Game Over
        if (this.gameConfig.turn >= this.gameConfig.maxTurn) {
            this.btnRun.classList.add("passive");
            this.gameConfig.turnPossible = false;
        }
    }


    // ====================================================================================== SHIFT PROJECT
    shiftProject(index, iteration) {
        const nProject = this.gameConfig.config.numOfProject;
        const team = this.gameConfig.teams[index];
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

                this.eTeamPos[index].innerHTML = "Off";
                this.eSimWeeks[index].innerHTML = "-";
                this.eSimCosts[index].innerHTML = "-";
                this.eSimProfits[index].innerHTML = "-";

                this.checkPossiblePlan();

                break;
            }
            else if (this.gameConfig.projects[tempProject].active == false && this.gameConfig.projects[tempProject].type <= team.type) {
                if (lastProject != -1) {
                    this.gameConfig.projects[lastProject].active = false;
                }

                this.gameConfig.projects[tempProject].active = true;

                team.pos = tempProject;
                team.duration = this.gameConfig.projects[team.pos].duration;
                team.working = team.duration;
                team.tempSalary = this.gameConfig.projects[team.pos].task * team.cost;
                team.profit = this.gameConfig.projects[team.pos].value - team.tempSalary;

                this.eTeamPos[index].innerHTML = `P${team.pos + 1}`;
                this.eSimWeeks[index].innerHTML = `${team.working} weeks`;
                this.eSimCosts[index].innerHTML = team.tempSalary;
                this.eSimProfits[index].innerHTML = `${team.profit} (${Math.round(team.profit / team.duration)}/w)`;

                this.checkPossiblePlan();

                break;
            }
        }
    }


    // ====================================================================================== CHECK POSSIBLE PLAN
    checkPossiblePlan(){
        let totalSalary = 0;

        for (let i=0; i < this.gameConfig.config.numOfTeam; i++) {
            totalSalary += this.gameConfig.teams[i].tempSalary;
        }

        if (totalSalary > this.gameConfig.budget) {
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
        const teams = [];
        const projects = [];

        const config = {
            budget: 500,
            numOfTeam: this.numOfTeam,
            numOfProject: this.numOfProject,

            // Teams
            cost: [6, 8, 10],

            // Projects
            duration: [3, 8],
            taskPerWeek: [6, 10],
            minValue: [8, 10, 12],
            maxValue: [10, 12, 14],
            riskRatio: [0.1, 0.5],
            overTaskRatio: 0.1,
        }

        // Team generation
        for (let i=0; i < config.numOfTeam; i++) {
            teams.push({
                type: i % 3,
                cost: config.cost[i % 3],
                pos: -1,
                working: 0,
                duration: 0,
                salary: 0,
                tempSalary: 0,
                profit: 0,
            });
        }

        // Project generation
        for (let i=0; i < config.numOfProject; i++) {
            const type = this.rand(0, 2);
            const duration = this.rand(config.duration[0], config.duration[1]);
            const taskPerWeek = this.rand(config.taskPerWeek[0], config.taskPerWeek[1]);
            const task = duration * taskPerWeek;
            const valuePerTask = this.rand(config.minValue[type], config.maxValue[type]);
            const value = task * valuePerTask;
            const valuePerWeek = value / duration;
            const risk = Math.round((valuePerWeek * config.riskRatio[0]) + (duration * config.riskRatio[1]));
            const overTask = Math.round(task * config.overTaskRatio);

            projects[i] = {
                type: type,
                value: value,
                task: task,
                duration: duration,
                risk: risk,
                overTask: overTask,
                tempOverTask: 0,
                active: false,
                taskPerWeek: taskPerWeek,
                valuePerWeek: valuePerWeek,
                valuePerTask: valuePerTask,
            }
        }

        return {
            config,
            turn: 0,
            maxTurn: this.maxTurn,
            budget: config.budget,
            profit: 0,
            gameOver: false,
            turnPossible: true,
            projects,
            teams,
        }
    }


    // ====================================================================================== UPDATE PROJECTS
    updateProjects() {
        const projects = this.gameConfig.projects;
        const config = this.gameConfig.config;

        for (let i=0; i < config.numOfProject; i++) {
            if (projects[i].active == false) {
                const type = this.rand(0, 2);
                const duration = this.rand(config.duration[0], config.duration[1]);
                const taskPerWeek = this.rand(config.taskPerWeek[0], config.taskPerWeek[1]);
                const task = duration * taskPerWeek;
                const valuePerTask = this.rand(config.minValue[type], config.maxValue[type]);
                const value = task * valuePerTask;
                const valuePerWeek = value / duration;
                const risk = Math.round((valuePerWeek * config.riskRatio[0]) + (duration * config.riskRatio[1]));
                const overTask = Math.round(task * config.overTaskRatio);

                projects[i] = {
                    type: type,
                    value: value,
                    task: task,
                    duration: duration,
                    risk: risk,
                    overTask: overTask,
                    tempOverTask: 0,
                    active: false,
                    taskPerWeek: taskPerWeek,
                    valuePerWeek: valuePerWeek,
                    valuePerTask: valuePerTask,
                }
            }
        }

        this.loadContent();
    }


    /* ================================================================================
        BUTTON FUNCTIONS
    ================================================================================ */

    buttonFunctions() {
        // ================================================================================== EXIT GAME
        this.btnExit.addEventListener("touchstart", () => {
            this.setGameTransition("close");
        });


        // ================================================================================== OPEN HELP
        this.btnHelp.addEventListener("touchstart", () => {
            this.helpPanelOpened = false;
            this.gameHelpPanel("close");
        });


        // ================================================================================== OPEN HELP
        this.btnCloseHelp.addEventListener("touchstart", () => {
            this.helpPanelOpened = true;
            this.gameHelpPanel("open");
        });


        // ================================================================================== RUN PLAN
        this.btnRun.addEventListener("touchstart", () => {
            if (this.gameConfig.turnPossible) {
                this.gameConfig.turn += 1;

                // Risk gambling
                for (let i=0; i < this.gameConfig.config.numOfProject; i++) {
                    const project = this.gameConfig.projects[i];

                    if (project.active) {
                        const prob = this.rand(1, 100);

                        if (prob <= project.risk) {
                            project.tempOverTask = project.overTask;
                        }
                    }
                }

                // Update team progress
                for (let i=0; i < this.gameConfig.config.numOfTeam; i++) {
                    const team = this.gameConfig.teams[i];

                    if (team.tempSalary != 0) {
                        this.gameConfig.budget -= team.tempSalary;
                        team.salary = team.tempSalary;
                        team.tempSalary = 0;
                    }

                    if (team.working > 0) {
                        team.working -= 1;
                    }

                    if (team.salary > 0 && team.working == 0) {
                        this.gameConfig.projects[team.pos].active = false;

                        this.gameConfig.budget += this.gameConfig.projects[team.pos].value;
                        this.gameConfig.profit += team.profit;
                        team.pos = -1;
                        team.duration = 0;
                        team.salary = 0;
                        team.profit = 0;
                    }
                }

                this.setGameTransition("reopen");
            }
        });
    }


    /* ================================================================================
        CONSTRUCTOR
    ================================================================================ */

    constructor(param) {
        this.homePage = param.homePage || "../index.html";
        this.numOfProject = param.numOfProject || 8;
        this.numOfTeam = param.numOfTeam || 3;
        this.maxTurn = param.maxTurn || 52;

        this.helpPanelOpened = false;

        // Generate game configuration
        this.gameConfig = this.generateGameContent();

        // Load the game and content
        this.loadGame();

        // The button functions
        this.buttonFunctions();





    }



}