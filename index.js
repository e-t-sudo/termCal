if(sessionStorage.getItem("color")=="dark"){
        document.querySelector(':root').style.setProperty('--textCol', '#f3f3f3');
        document.querySelector(':root').style.setProperty('--backCol', '#000000');
}
let yinTrack = window.matchMedia( "(min-width: 500px)" ).matches; //if the width is < 500px, yinTrack is disabled
document.addEventListener("DOMContentLoaded", function(){
document.getElementById("yin").innerHTML = (yinTrack)?"[1]:":"&#9867;&nbsp;&nbsp;&nbsp;";
document.getElementById('input_expr').onkeypress = function(key){
if(key.keyCode == 13){ //when "enter" is pressed
        let evaluated_expr = document.getElementById('input_expr').value;
        evaluated_expr = evaluated_expr.replace(/^ +| +$/g, ''); //trims off all the leading and trailing whitespaces
        if(/^\/\//.test(evaluated_expr)){
            evaluated_expr = evaluated_expr.substr(2);
            document.getElementById('yang').innerHTML += "<p style='color: grey;''>"+evaluated_expr+"</p>";
            document.getElementById('input_expr').value = "";
            return;
        }
        evaluated_expr = evaluated_expr.replace(/ /g, ''); //replaces all whitespaces by "" empty character
        let arr = evaluated_expr.split("");
        if(evaluated_expr=="clear"){ //clear directive
            document.getElementById('yang').innerHTML="";
            document.getElementById('input_expr').value = "";
        }else if(evaluated_expr=="history"){
            if(INPUTS.length==0){//no history to show
                document.getElementById('yang').innerHTML += "<p>[-y/y] : Empty log!</p>";
            }else{
            document.getElementById('yang').innerHTML += "<p>history</p>";
                for(let i=0; i<INPUTS.length; i++){
                    let inputStr = INPUTS[i].join("");
                    let outputStr = OUTPUTS[i];
                    document.getElementById('yang').innerHTML += "<p style='color:grey'>"+inputStr+" = "+outputStr+"</p>";
                }
            }
        document.getElementById('input_expr').value = "";
        }else if(evaluated_expr=="dark"){
            document.querySelector(':root').style.setProperty('--textCol', '#f3f3f3');
            document.querySelector(':root').style.setProperty('--backCol', '#000000');
            document.getElementById('input_expr').value = "";
            sessionStorage.setItem("color", "dark");
        }else if(evaluated_expr=="light"){
            document.querySelector(':root').style.setProperty('--textCol', '#000000');
            document.querySelector(':root').style.setProperty('--backCol', '#f3f3f3');
            document.getElementById('input_expr').value = "";
            sessionStorage.clear();
        }else if(evaluated_expr=="#"){
            yinTrack = false;
            document.getElementById('input_expr').value = "";
        }else if(evaluated_expr==""){//empty "enter" press
                let response;
                    if(OUTPUTS.length==0){
                        response = "";
                    }else{
                        response = OUTPUTS[OUTPUTS.length-1];
                    }
                    document.getElementById('input_expr').value = response;
        }else{ //commands other than clear
            let new_p = "<p>" + evaluated_expr + "</p>";
            document.getElementById('yang').innerHTML += new_p;
            let result = eval(arr);
            document.getElementById('yang').innerHTML += (result!=undefined)?result:"[-y/y] : '"+evaluated_expr+"' operation not defined..."; //eval() is defined in the './myFile.js' module
            document.getElementById('input_expr').value = "";
        }
        let cmdNo = INPUTS.length + 1;
        document.getElementById('yin').innerHTML = (yinTrack)?"[" + cmdNo + "]:":"&#9867;&nbsp;&nbsp;&nbsp;";
        document.getElementById('input_expr').scrollIntoView();
}
}
});
