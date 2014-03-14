/**
 * Created by tdgunes on 3/14/14.
 */

var my = "0: CP 998 200 \n\
1: CP 999 300 \n\
2: NAND 998 998 \n\
3: ADD 999 998 \n\
4: NAND 999 999 \n\
5: BZJ 7 999 \n\
6: BZJi 8 1002 \n\
7: 1000 \n\
8: 0 \n\
100: 0  // output \n\
200: 910 //first input \n\
300: 910 //second input \n\
998: 0 \n\
999: 0 \n\
1000: ADDi 100 1 \n\
1002: ADDi 100 1 \n\
1003: LTi 100 0 \n\
";

function parse(text){

    //(^ *[0-9]+: *[A-z]+ +[0-9]+ +[0-9]+ *)|(^ *[0-9]+: *[0-9]+ *)
    var lines = text.split("\n");
    for (var i = 0; i < lines.length; i++) {
        _line = lines[i].replace(/\s\s+/g, ' ');
        if (_line && _line.substr(0,2)!="//"){ //if a comment line ignore or blank

            var re = /(^ *[0-9]+: *[A-z]+ +[0-9]+ +[0-9]+ *)|(^ *[0-9]+: *[0-9]+ *)/
            //console.log(_line);
            _tokens = _line.match(re);
            if (_tokens){
                console.log("'"+_tokens[0]+"'");
            }
            else {
                console.log("Parse error on line="+(i+1));
            }
        }



    }

}

parse(my);




