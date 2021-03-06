/* Cricket Game Developed By: Izaan jahangir 12752 Sir haider */

/************************************************************* 

About the game
--> Consist of 6 players
--> 12 balls game

*************************************************************/



// Div Refernece
var formEl = document.getElementById('form');
var ChooseUserEl = document.getElementById('choose-user');
var ChooseOpEl = document.getElementById('choose-op');
var ScoreBoardEl = document.getElementById('scoreboard');

var startBtnEl = document.getElementById('btn-start');          //button to start game
var nextBallBtnEl = document.getElementById('next-ball');       //button to next ball
var nextInningBtnEl = document.getElementById('next-inning');   //button to next inning
var reloadPageBtnEl = document.getElementById('reload-btn');   //button to play again
// Elements Reference
var userTeamEl = document.getElementById('user-team');
var opTeamEl = document.getElementById('op-team');
var teamPlayingEl = document.getElementById('team-playing');


// Values that will store after function tossPlayers is called
var userTeamName;   //Stores user team name
var oppTeamName;    //Stores opponent team name
var userChecked;    //Stores whether user select heads or tails

// variable to store Object of currently playing team 
var team;   //Object will be created with the Constructor function



// Buttons for bat or ball choices
var bat = ChooseUserEl.getElementsByTagName('button')[0];
var ball = ChooseUserEl.getElementsByTagName('button')[1];

// store reference to print on DOM
var runsEl = ScoreBoardEl.getElementsByTagName('span')[0];
var remainBallEl = ScoreBoardEl.getElementsByTagName('span')[1];
var targetEl = ScoreBoardEl.getElementsByTagName('span')[2];
var comments = document.getElementById('comments'); // to print comment






// variable to store user and opponent choices after several function calling
var userChoice;
var opChoice;


// variable to store which team is openner
var openner;                //Stores who is openner i.e user or opponent
var opennerTeamName;        //Stores openner team name
var secondInningTeam;       //Stores who is second inner team i.e user or opponent
var secondInningTeamName;   //Stores second inner team name

var target; //stores target
var secondInning = false;   //to know whether currently its first inning or second




// Click event to store whether user choose batting or balling
bat.addEventListener('click',function(){
    userChoice = storeUserChoice(this);
    setFirstInning('user',userChoice);
});

ball.addEventListener('click',function(){
    userChoice = storeUserChoice(this);
    
    setFirstInning('user',userChoice);
});


formEl.style.display = 'block'; //Show form by default

// Function to set everything to default
function setEverything(teamName){
    //if first inning
    //this will not run if it's second inning
    if(secondInning === false){
        
        // if user is openner
        if(teamName === 'user'){
            opennerTeamName = userTeamName;
            secondInningTeamName = oppTeamName
        }
        // if opponent is openner
        else{
            opennerTeamName = oppTeamName;
            secondInningTeamName = userTeamName;
        }    
        
    }
    
    // if user is openner    
    if(teamName === 'user'){
        team = new Team(userTeamName);
    }
    // if opponent is openner    
    else{
        team = new Team(oppTeamName);
    }
    batter = team.players[0];   //set first player
    team.players.splice(0,1);   //remove it from array
}


// Function to do toss
function tossPlayers(){
    reset();    //hide every element
    var rand = Math.floor(Math.random()*2); //generates 0 or 1 randomly
    var choices = ['heads','tails'];        //array to pick value randomly

    userChecked = document.querySelector("input[type='radio']:checked").value;  //read value of radio button that is checked
    userTeamName = userTeamEl.value;
    oppTeamName = opTeamEl.value;

    // if user won the toss
    if(choices[rand] === userChecked){
        ChooseUserEl.style.display = 'block';
        ChooseUserEl.getElementsByTagName('h2')[0].innerText = userTeamName + ' Won the toss';
    }

    // if opponent won the toss
    else{
        ChooseOpEl.style.display = 'block';
        ChooseOpEl.getElementsByTagName('h2')[0].innerText = oppTeamName + ' Won the toss';        
        setFirstInning('op');      
    }

    return false;
}

// Function to set First inning
function setFirstInning(tossWon,uChoice){

    // if user won the toss, decides if user will bat or ball first
    if(tossWon === 'user'){
        ChooseUserEl.getElementsByTagName('h1')[0].innerText = userTeamName + " Choose to " + uChoice;
        startBtnEl.style.display = 'block';

            // if user choose bat
            if(uChoice.toLowerCase() === 'bat'){
                openner = 'user';
                secondInningTeam = 'opponent';
            }
            // if user choose ball
            else{
                openner = 'opponent';
                secondInningTeam = 'user';
            }
    }

    // if opponent won the toss, decide if opponent will bat or ball first
    else{
        var rand = Math.floor(Math.random()*2); //Generate 0 or 1 randomly
        var choices = ['bat','ball'];
        opChoice = choices[rand];
        ChooseOpEl.getElementsByTagName('h3')[0].innerText = oppTeamName + " Choose to " + opChoice;
        startBtnEl.style.display = 'block';

            if(opChoice === 'bat'){

                openner = 'opponent';
                secondInningTeam = 'user'; 

            }else{
                openner = 'user';
                secondInningTeam = 'opponent'; 

            }      
    }
}

// Function returns what user clicked i.e Bat or ball
function storeUserChoice(e){
    return e.innerText;
}

function startGame(){
    reset();
    ScoreBoardEl.style.display = 'block';
    runsEl.innerText = 'Total Runs: ' + 0;
    remainBallEl.innerText = 'Remaining Balls: ' + 12;
    comments.innerText = '';
    if(secondInning){
        setEverything(secondInningTeam);
        nextBallBtnEl.style.display = 'block';
    }else{
        setEverything(openner);
    }
    teamPlayingEl.innerText = team.name;
}


// update Board on every ball
function updateBoard(){
    // if balls are overs
    if(team.remainBalls === 0){
        // if in second inning, decides the winner
        if(secondInning){

            // if target is chased , second inning team won
            if(team.runs > target){

                comments.innerText = secondInningTeamName + ' Won By ' + (team.players.length + 1) + ' wickets';
    
            }
            // if target isn't chased , openner team won
            else{
                
                comments.innerText = opennerTeamName + ' Won By ' + (target - team.runs) + ' runs';
           
            }
            nextBallBtnEl.style.display = 'none';
            reloadPageBtnEl.style.display = 'inline-block';
            return false;   //prevent this function to further execute

        }
        // if in the first inning, terminates the inning and starts next
        else{
            
            target = team.runs + 1;
            comments.innerText = 'Overs End';
            targetEl.innerText = 'Target: ' + target;
            nextBallBtnEl.style.display = 'none';
            nextInningBtnEl.style.display = 'block';
            secondInning = true;
            return false;   //prevent this function to further execute   
        }
    }
    //if in second inning and runs greater than target, terminates the inning and decide winner
    if(secondInning){
        if(team.runs > target){
            nextBallBtnEl.style.display = 'none';            
            comments.innerText = secondInningTeamName + ' Won By ' + (team.players.length + 1) + ' wickets';
            reloadPageBtnEl.style.display = 'inline-block';            
            return false;   //prevent this function to further execute
        }
    }

    // if nothing in the above lines ran, then run this
    var rand = Math.floor(Math.random()*7);
    if(rand === 0){
        console.log('out');
        comments.innerText = batter + ' is out';
        changePlayer();
    }
    else{
        team.runs += rand;
        runsEl.innerText = 'Total Runs: ' + team.runs;
        comments.innerText = batter + ' scores ' + rand;
    }
    team.remainBalls -= 1;
    remainBallEl.innerText = 'Remaining Balls: ' + team.remainBalls;
}

// to change players when player is out and also check if there is players left
function changePlayer(){
    // if all players are out
    if(team.players.length === 0){
        comments.innerText = 'All Players Out';
        nextBallBtnEl.style.display = 'none';
        
        // If in the second inning the openner team will win
            if(secondInning){
                comments.innerText = opennerTeamName + ' Won By ' + (target - team.runs) + ' runs';
                reloadPageBtnEl.style.display = 'inline-block';                
                return false;
            }
        // Terminates the inning and start next inning
    
        secondInning = true;    //to identify second inning
        target = team.runs + 1;
        targetEl.innerText = 'Target: ' + target;
        nextInningBtnEl.style.display = 'block';
        return false;          

    }

    // if there is players left
    batter = team.players[0];   //select next player
    team.players.splice(0,1);   //remove the player from the array
    comments.innerText += ' New player is ' + batter;
}


// Constructor function to create a object of team
function Team(name){
    this.name = name;
    this.players = ['Player 1','Player 2','Player 3','Player 4','Player 5','Player 6'];
    this.totalBalls = 12;
    this.remainBalls = 12;
    this.runs = 0;
}

// to hide everything on the DOM
function reset(){
    formEl.style.display = 'none';
    ChooseUserEl.style.display = 'none';
    ChooseOpEl.style.display = 'none';
    ScoreBoardEl.style.display = 'none';
    startBtnEl.style.display = 'none';
    nextInningBtnEl.style.display = 'none';
    reloadPageBtnEl.style.display = 'none';
}

function reloadPage(){
    window.location.reload();
}