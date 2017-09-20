var run = document.getElementById('run'),
    entry = document.getElementById('entry'),
    action = document.getElementById('action'),
    table = document.getElementsByClassName('table')[0],
    speed= document.getElementById('speed'),
    controls = document.getElementsByClassName('controls')[0],
    skipEven = document.getElementById('skip-even'),
    highlightNumbers = document.getElementById('highlight-numbers');

var getOddPart = function(n){
    var k = n;
    while(k%2 ==0){
        k = k/2;
    }
    return(k);
}

var nextSyracuse = function (n) {
    if(n%2 == 0){
        if(skipEven.checked){
            return(getOddPart(n));
        }else
            return(n/2);
    }else{
        return(3*n+1);
    }
}

var displayNext = function(n,s){
    var redNumbers = highlightNumbers.value.split(',');
    var row = document.createElement('div'),
        decimal = document.createElement('span'),
        binary = document.createElement('span');
    row.className= "row";   
    decimal.className = "cell decimal";
    binary.className = "cell binary";
    if(redNumbers.indexOf(n.toString()) != -1){
        row.className+=" highlight";
    }
    decimal.innerHTML = n;
    binary.innerHTML = s;
    
    row.appendChild(binary);
    row.appendChild(decimal);
    table.insertBefore(row,table.children[0]);
}

var decimalToBinary= function(n){
    if(n==0){
        return('')
    }else{
        if(n%2 == 0){
            return(decimalToBinary(n/2)+'.')
        }else{
            return(decimalToBinary((n-1)/2)+'&#9646;')
        }
    }
}

var running = false;
var stop = function(){};

var play = function(){
    var n = parseInt(entry.value) || 1;
    n=(n>0)?n:1;
    var isPaused = false;
    table.innerHTML = "";
    
    action.value = "stop";
    running = true;
    
    var step = function(){
        if(!isPaused){
            displayNext(n,decimalToBinary(n));
            n = nextSyracuse(n);
            if(n ==1){
                stop();
                step();
            }
        }
    }
    var time = 500*51/(1+parseInt(speed.value));
    var interval = setInterval(step,time);
    
    //pause
    var pause = document.createElement('input');
    pause.setAttribute('type','button');
    pause.setAttribute('value','pause');
    run.appendChild(pause);
    
    pause.addEventListener("click",function(){
        if(isPaused){
            pause.setAttribute('value','pause');
            isPaused = false;
        }else{
            pause.setAttribute('value','re-lancer');
            isPaused = true;
        }
    },false);
    
    return (function(){
        running = false;
        action.value = "lancer";
        run.removeChild(pause);
        clearInterval(interval);
        stop = function(){};
    })
}

run.addEventListener('submit', function(e){
    e.preventDefault();
    stop();
    stop = play();   
} ,false);

action.addEventListener('click',function(){
    if(running){
        stop();
    }else{
        stop();
        stop = play();
    }
},false)