/**
 * Created by tdgunes on 3/13/14.
 */


//FIXME ALL MEMORY ACCESSES REQUIRES ERROR HANDLING
var evaluation = {};
evaluation.LT = function LT(A, B){
    if ( MEMORY[A] < MEMORY[B]){
        MEMORY[A] = 1;
    }
    else {
        MEMORY[A] = 0;
    }
}
evaluation.LTi = function LTi(A, B){
    if ( MEMORY[A] < B){
        MEMORY[A] = 1;
    }
    else {
        MEMORY[A] = 0;
    }
}
evaluation.ADD = function ADD(A, B){
    MEMORY[A] = MEMORY[A] + MEMORY[B];
}
evaluation.ADDi = function ADDi(A,B){
    MEMORY[A] = MEMORY[A] + B;
}
evaluation.NAND = function NAND(A,B){
    MEMORY[A] = ~(MEMORY[A] & MEMORY[B]);
}
evaluation.NANDi = function NANDi(A,B){
    MEMORY[A] = ~(MEMORY[A] & B);
}
evaluation.SRL = function SRL(A,B){
    if(MEMORY[B] < 32)
        MEMORY[A] = MEMORY[A] >> MEMORY[B];
    else
        MEMORY[A] = MEMORY[A] << (MEMORY[B]-32);
}
evaluation.SRLi = function SRLi(A,B){
    if(B < 32)
        MEMORY[A] = MEMORY[A] >> B;
    else
        MEMORY[A] = MEMORY[A] << (B-32);

}
evaluation.CP = function CP(A,B){
    MEMORY[A] = MEMORY[B];
}
evaluation.CPi = function CPi(A,B){
    MEMORY[A] = B;
}
evaluation.CPI = function CPI(A,B){
    MEMORY[A] = MEMORY[MEMORY[B]];
}
evaluation.CPIi = function CPIi(A,B){
    MEMORY[MEMORY[A]] = MEMORY[B];
}
evaluation.BZJ = function BZJ(A,B){
    if (MEMORY[B]==0){
        setPC(prevPC,PC,parseInt(MEMORY[A])); 
    }else{
        setPC(prevPC,PC,PC+1);
    }
}
evaluation.BZJi = function BZJi(A,B){
    setPC(prevPC,PC,parseInt(MEMORY[A])-B);
}
evaluation.MUL = function MUL(A,B){
    MEMORY[A] = MEMORY[A] * MEMORY[B];
}
evaluation.MULi = function MULi(A,B){
    MEMORY[A] = MEMORY[A] * B;
}


var beforePrevPC=0;
var prevPC = 0;
var PC = 0;
var MEMORY = [];
var MEMORY_SIZE = 2000;
var editor;

function setPC(newBeforePrevPC,newPrevPC,newPC){
    beforePrevPC=newBeforePrevPC;
    prevPC=newPrevPC;
    PC = newPC;
    $("#PC").text(PC);
}
function fillMemory(){
    for (var i=0; i<MEMORY_SIZE; i++){
        MEMORY[i] = 0;
    }
}
function showMemory(){
    for (var i=0; i<MEMORY_SIZE; i++){
        if (MEMORY[i]!=undefined){
            $("#val-"+i).text(""+MEMORY[i]);
        }

    }
}
function updateMemory(){
    for(var i=0; i<MEMORY_SIZE;i++){
        if (MEMORY[i]!==0)
            $("#loc-"+i).show();
        if (MEMORY[i]===0)
            $("#loc-"+i).hide();
    }
}
function parse(code){
    var lines = code.split("\n");
    for (var i = 0; i < lines.length; i++) {
        var _line = $.trim(lines[i]);
        //alert("'"+_line+"'");
        if (_line){
            var _isTokenized = _line.split(" ");

            //alert("'"+_isTokenized+"'");

            if (_isTokenized.length == 4) {

                var _memoryLocation = parseInt($.trim(_isTokenized[0]).split(":")[0]);
                MEMORY[_memoryLocation] = $.trim(_isTokenized[1]) + " " + $.trim(_isTokenized[2]) + " " + $.trim(_isTokenized[3]);
            }
            else if(_isTokenized.length == 2){
                var _memoryLocation = parseInt($.trim(_isTokenized[0]).split(":")[0]);
                MEMORY[_memoryLocation] = parseInt($.trim(_isTokenized[1]));
            }
            else if (_isTokenized.length == 0){
                //pass
            }
            else {
                alert("Parse error on line: " + (i + 1));
                break;
            }
        }
    }

}


$( document ).ready(function() {
    fillMemory();
    //16384
    for (var i=0; i<2000; i++){
       $('#memory').find('tr:last').after('<tr id=\'loc-'+i+'\' > <td >'+i+'</td><td id=\'val-'+i+'\'>0</td></tr>');
    }
//$("#td_id").attr('class', 'newClass');
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    //editor.getSession().setMode("ace/mode/javascript");

    editor.commands.addCommand({
        name: 'build',
        bindKey: {win: 'Ctrl-B',  mac: 'Command-B'},
        exec: function(editor) {
            $('#build-message').text("Parsing...");
//            $("#loc-"+num).attr('class', 'success');
            parse(editor.getValue());

            showMemory();

//            num++;
        },
        readOnly: false // false if this command should not apply in readOnly mode
    });

    editor.commands.addCommand({
        name: 'run',
        bindKey: {win: 'Ctrl-R',  mac: 'Command-R'},
        exec: function(editor) {
            alert("Run!");
        },
        readOnly: false // false if this command should not apply in readOnly mode
    });

    updateMemory();
});



$("#build").click( function(){
    setPC(0,0,0);
    fillMemory();
    showMemory();
    for (var i = 0; i < MEMORY_SIZE; i++) {
        $("#loc-"+(i)).removeClass('active');
        $("#loc-"+i).removeClass('success');
    }

    $('#build-message').text("Parsing...");
    parse(editor.getValue());
    $('#build-message').text("Preparing Memory...");
    showMemory();
    $('#build-message').text("Build Done.");
    updateMemory(); 
});

$("#reset").click( function(){
    setPC(0,0,0);
    fillMemory();
    showMemory();
    for (var i = 0; i < MEMORY_SIZE; i++) {
        $("#loc-"+(i)).removeClass('active');
        $("#loc-"+i).removeClass('success');
    }
    updateMemory();

});
$("#step").click( function(){
    var _memoryBlock = MEMORY[PC];
    $("#loc-"+(beforePrevPC)).removeClass('active');
    $("#loc-"+(beforePrevPC)).removeClass('success');
    $("#loc-"+(prevPC)).attr('class', 'active');
    $("#loc-"+PC).attr('class', 'success');


    var _commands = _memoryBlock.split(" ");
    //ADDi 10 10
    //alert(_commands);

    var command = _commands[0];
    var A = parseInt(_commands[1]);
    var B = parseInt(_commands[2]);
    var _fun = evaluation[command];

    _fun(A,B);
    if(command!=="BZJ" && command!=="BZJi" )
        setPC(prevPC,PC,PC+1);

    showMemory();
    updateMemory();
});




//<tr class="active">...</tr>
//<tr class="success">...</tr>
//    <tr class="warning">...</tr>
//    <tr class="danger">...</tr>
//    <tr class="info">...</tr>
//<tr class="success">
//    <td>0</td>
//    <td>CP 10 100</td>
//
//</tr>
//<tr>
//<td>1</td>
//<td>BZJi 20 0</td>
//
//</tr>
//    <tr>
//        <td>2</td>
//        <td>LT 2 200</td>
//
//    </tr>
