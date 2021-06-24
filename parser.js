
let INPUTS = []; 
let OUTPUTS = []; 
function isDigit(token){ 
    let regex = /^\d$/; //regular expression for a single digit
    return regex.test(token);
}
const topValue = function(arr){
    return arr[arr.length - 1]; 
}
function Precedence(oper){
    if(oper=='.') return 4; //resolve all the string -> floating point conversions before any operation
    if(oper=='^') return 3;
    if(oper=='/'||oper=='*'||oper=='%') return 2;
    if(oper=='+'||oper=='-') return 1;
return 0;
}
function Mod(a, b){
    if(a.split('.').length>1||b.split('.').length>1){ //if either a or b is a floating point number
        let afterDecimal1 = (typeof a.split('.')[1] == "string")?a.split('.')[1].length:0;
        let afterDecimal2 = (typeof b.split('.')[1] == "string")?b.split('.')[1].length:0;
        let afterDecimal = Math.max(afterDecimal1, afterDecimal2);
        let multiplier = Math.pow(10, afterDecimal+2);
        console.log(multiplier);
        a = parseFloat(a); b = parseFloat(b);
        a = a*multiplier; b = b*multiplier;
        console.log(a, b);
        return (a%b)/multiplier;
    }else{
        a = parseFloat(a); b = parseFloat(b);
        return a%b;
    }
}
function findVal(a, b, oper){

    if(oper!='.'){//convert a, b to simple numbers if leading zeroes don't need to be preserved
        a = parseFloat(a);
        b = parseFloat(b);
    }else{
        console.log("dot operation between ", a, " and ", b);
    }
    switch(oper){
        case '+': return a+b;
        case '-': return a-b;
        case '/': return a/b;
        case '*': return a*b;
        case '%': return Mod(a.toString(), b.toString());
        case '^': return a**b; 
        case '.': return parseFloat(a+oper+b); //treat dot '.' as an operator which returns the floating-point equivalent of the parts before and after the dot
    }
}
function leadingZeroes(str, index){
    let zeroes = 0;
    for(let i=index; i<str.length; i++){
        if(str[i]!='0') break;
        zeroes++;
    }
return zeroes;
}
// function reduceFunctions(str){
//     const regex = /(sin|asin|cos|acos|sinh|cosh|asinh|acosh|log|ln|abs|exp|sqrt|cbrt|round|ceil|floor|trunc|sign|log2|log10|-)[\\(]/gi;
//     let ar = str.split(regex);
//     for(let i=0; i<i++; i++){
        //this is getting really tough to manage. Perhaps the logic of the parser needs to changed..?
//     }
//     console.log(ar);
// }
function takeCareOfStrayMinuses(str){
    //since JS doesn't support lookbehind pattern matching, we'll reverse the string and use lookahead to find the stray minus signs
    const reg = /\d+-(?=\D|$)/g; //look for stray hypens followed by non-numeric characters or located at the end
    let revStr = str.split("").reverse().join("");
    let strayMinuses = revStr.match(reg);
    if(strayMinuses==null){
        return str.split("").join(","); //no stray minuses found
    }
    let fragments = revStr.split(reg);
    for(let i=0; i<strayMinuses.length; i++){
        strayMinuses[i] = ')' + strayMinuses[i] + '0('; //enclose in brackets and add a '0'(zero)
    }
    let newAr = [];
    let index = 0;
    for(let i=0; i<fragments.length; i++){
        newAr[index] = fragments[i];
        index += 2;
    }
    index = 1;
    for(let i=0; i<strayMinuses.length; i++){
        newAr[index] = strayMinuses[i];
        index += 2;
    }
    let newRevStr = newAr.join("");
    let newStr = newRevStr.split("").reverse().join("");
return newStr.split("").join(",");
}
const eval = function(expr){
    const originalExpr = expr; 
    expr = expr.toString().split(',').join("").replace(/\*\*/g, '^').split(""); //replace all instances of "**" operator by "^"
         let  nexpr = takeCareOfStrayMinuses(expr.toString().split(",").join(""));
     expr = nexpr.split(",");
 //   takeCareOfStrayMinuses(expr.toString().split(",").join(""));
    let i;
    values = [];
    operators = [];
    for(i=0; i<expr.length; i++){
        if(expr[i]==' '){ //empty spaces are to be ignored
            continue;
        }else if(expr[i]=='('){ //push the opening paranthesis into the operator stack
            operators.push(expr[i]);
        }else if(isDigit(expr[i])){
            //push the numbers into the values stack
            let zeroes = leadingZeroes(expr, i);
            let val = 0;
            while(i<expr.length && isDigit(expr[i])){
                val = (val*10) + (expr[i] - '0');
                i++;
            }
            for(let i=0; i<zeroes; i++){
                val = '0'+val;
            } //add back the leading zeroes
            values.push(val); 
            i--; //overincrement correction
        }else if(expr[i]==')'){ 
            //check for its paired opening paranthesis
            while(operators.length > 0 && topValue(operators)!='('){
                let operand2 = values.pop();
                let operand1 = values.pop(); 
                let operator = operators.pop();
                values.push(findVal(operand1, operand2, operator));
            }
            if(operators.length > 0){
                operators.pop(); //pop the opening brace
            }
        }else{
            //it is an operator
            while(operators.length > 0 && Precedence(topValue(operators))>=Precedence(expr[i])){
                let operand2 = values.pop();
                let operand1 = values.pop();
                let operator = operators.pop();
                values.push(findVal(operand1, operand2, operator));
            }
            operators.push(expr[i]);
        }
    }
    while(operators.length > 0){
        let operand2 = values.pop();
        let operand1 = values.pop();
        let operator = operators.pop();
        values.push(findVal(operand1, operand2, operator));
    }
let final = values.pop(); 
 if(final==undefined||isNaN(final)){
     final = "[y/y]: "+originalExpr.join("")+": operation not defined!"
 }else{
    INPUTS.push(expr);
    OUTPUTS.push(final); 
 }
return final; 
}
