import {aGliderFactory} from './gliderFactory.js';

export const oGame = {
    init: function() {
        this.initParams();
        this.createArray();
        this.createGrid();
        this.updateCells();

        this.setRun();
        this.setPause();
        this.setReset();
        this.setClear();     
    },

    initParams() {
        //init Game Rules
        var oRules = {
            "Rows": "40",
            "Time": "0.05"
        }
        this.oRules = oRules;

        //Init Fixed Parameters
        this.oFixedParameters = {
            // "Size": "800px",
            "SizeCell": "40px",
        }

        this.counter = 0;
        var oCounter = document.getElementById("textCounter");
        oCounter.innerText = this.counter; 


    },

    createGrid: function () {
        //add Grid Container for CSS Grid
        const container = document.getElementById("container");

        //set Size of Grid
        var rows = this.oRules.Rows;
        var cols = this.oRules.Rows;

        //create Cells
        container.style.setProperty('--grid-rows', rows);
        container.style.setProperty('--grid-cols', cols);
        for (var c = 0; c < (rows * cols); c++) {
          let cell = document.createElement("div");
          var cellnumber = c // + 1
          cell.id = "cell" + cellnumber;
          cell.number = cellnumber;
          cell.style.setProperty('width', this.oFixedParameters.SizeCell);
          cell.style.setProperty('height', this.oFixedParameters.SizeCell);
          cell.addEventListener('click', this.classToggler.bind(this));

         //append Grid Item
         container.appendChild(cell).className = "grid-item";
        };


    },

    createArray: function() {
        // var aGameArray = [];
        // var Size = this.oRules.Rows;
        // for (var i=0; i < Size; i++) {
        //     for (var j=0; j < Size; j++) { 
        //         aGameArray.push(0);
        //     }         
        // }
        // this.aGameArray = aGameArray;
        // this.numberCells = aGameArray.length;

        //glider import
        this.aGameArray = aGliderFactory;
        this.numberCells = this.aGameArray.length;

        
    },

    classToggler: function(oEvent) {
        var cell = oEvent.currentTarget;
        var number = cell.number;

        if ( this.aGameArray[number] == 0 ) {
            this.aGameArray[number] = 1;  
            cell.style.setProperty('background-color', 'white');
         } else {
            this.aGameArray[number] = 0; 
            cell.style.setProperty('background-color', '#5a5a5a');

        }


    },

    setRun: function() {
        var oButtonRun = document.getElementById("buttonRun");
        oButtonRun.onclick = function() {
            this.then = Date.now();
            this.animate();
        }.bind(this);

    },

    animate: function() {
        this.AnimationRequestID = window.requestAnimationFrame(this.animate.bind(this));
        var now = Date.now();
        var fps = this.oRules.Time * 1000;
        var elapsed = now - this.then;  

        if (elapsed > fps ) {
           this.then = now - (elapsed % fps);
           this.changeCells();
           var oCounter = document.getElementById("textCounter");
           oCounter.innerText = this.counter; 
           this.counter++;


        }


    },

    setPause: function() {
        var oButtonPause = document.getElementById("buttonPause");
        oButtonPause.onclick = function() {
            window.cancelAnimationFrame(this.AnimationRequestID);
        }.bind(this);        
   
    },

    setReset: function() {
        // var oButtonReset = document.getElementById("buttonReset");
        // oButtonReset.onclick = function() {
        //     window.cancelAnimationFrame(this.AnimationRequestID);
        //     this.aGameArray = [];
        //     this.createArray();


        //     this.counter = 0;
        //     var oCounter = document.getElementById("textCounter");
        //     oCounter.innerText = this.counter; 

        // }.bind(this);      
  
    },

    setClear: function() {
    
    },

    changeCells: function() {
        var array = this.aGameArray.slice();
        var arrayBefore = this.aGameArray;
        var iRows = parseInt( this.oRules.Rows);

        for (var i=0; i<this.numberCells; i++ ) {          
                var Index;
                var sum = 0;
                var subArray;

                //get Top Middle and Bottom Left 
                subArray = [i-1-iRows, i-1, i+iRows-1];
                for (var j=0; j < subArray.length; j++) {
                    if (this.indexValid(subArray[j]) && i != 0 && i % iRows != 0 ) {
                        if (arrayBefore[subArray[j]] == 1){
                            sum++;
                        }
                    }
                }

                //get Top, Middle and Bottom Right
                subArray = [i+1-iRows, i+1, i+iRows+1];
                for (var j=0; j < subArray.length; j++) {
                    if (this.indexValid(subArray[j]) && ( (i+1) % iRows != 0 )) {
                        if (arrayBefore[subArray[j]] == 1){
                            sum++;
                        }                 
                    }
                }

                //get Top
                Index= i-iRows;
                if (this.indexValid(Index)) {
                    if (arrayBefore[Index] == 1){
                        sum++;
                    }
                }                
                //get Bottom
                Index= i+iRows;
                if (this.indexValid(Index) ) {
                    if (arrayBefore[Index] == 1){
                        sum++;
                    }
                }

                //ApplyRules
                //alive
                if (arrayBefore[i] == 1) {  
                    if ( 1 < sum && sum < 4){
                        array[i] = 1;
                    } else {
                        array[i] = 0;
                    }              
                //dead
                } else {
                    if ( sum == 3){
                        array[i] = 1;
                    }

                }

        }

        this.aGameArray = array;
        this.updateCells();

    },

    indexValid: function(Index) {
        if (Index < 0 || Index > this.numberCells ) {
            return false;
        } else {
            return true;
        }

    },

    updateCells: function (){
        var array = this.aGameArray;

        for (var i=0; i<array.length; i++ ) {    
            let cell = document.getElementById("cell" + i);
            if ( array[i] == 0 ) {
                cell.style.setProperty('background-color', '#5a5a5a');
             } else {
                cell.style.setProperty('background-color', 'white');              
            }

        }       

    },

    drawCanvas: function() {
        //SetCanvasWidth and Height
        // this.canvas.width = this.oFixedParameters.CanvasWidth;
        // this.canvas.height = this.oFixedParameters.CanvasHeight;

        //draw Canvas background
        // this.ctx.globalAlpha = 0.5;
        // this.ctx.fillStyle = "#010101";
        // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);    
        // this.ctx.globalAlpha = 1.0;

        //draw Canvas Grid
        // var tileSizeWidth = this.oFixedParameters.CanvasWidth / this.oRules.Tiles;
        // var tileSizeHeight = this.oFixedParameters.CanvasHeight / this.oRules.Tiles;
        // for ( var i = 0; i < this.oRules.Tiles; i++ )  {
        //     var lineX = tileSizeWidth * i;
        //     var lineY = tileSizeHeight * i;

        //     //line horizontal
        //     this.ctx.beginPath(); 
        //     this.ctx.moveTo(0, lineY);
        //     this.ctx.lineTo(this.canvas.width, lineY);
        //     this.ctx.stroke();
        //     //line Horizontal
        //     this.ctx.beginPath();
        //     this.ctx.moveTo(lineX, 0);
        //     this.ctx.lineTo(lineX, this.canvas.height);
        //     this.ctx.stroke();          
        // }

        // window.onresize = function () {
        //     // this.render.canvas.width = window.innerWidth;
        //     // this.render.canvas.height = window.innerHeight;
        //   }.bind(this);

    },   

}
