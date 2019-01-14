function parser(query){

    function alphanumeric(inputtxt)
    { 
        var letters = /^[0-9a-zA-Z]+$/;
        if(inputtxt.match(letters))
            return true;
        else
            return false;
    }

    let queryCache = '';
    let previousCache = '';
    let notAllowedSymbols = ["<" ,">" ,"/" , ""]

    let checkForDirectEnd = false;
    let inputBlocked = false;
    let checkForQuotes = false;

    //ThirdStartRegion
    let openTagForSecondStep = -1;
    let checkSlashForSecondStep = false;
    let previouslyOccupied = false;
    //#endregion


    let queryLength = query.length;

    function internalParser(resultObject , queryIndex , stack , flag , step=-1){
        console.log(query[queryIndex-1] , "$" , queryCache , "%" , previousCache , "&" , step , "^" , stack.length)
        
        if(queryIndex >= queryLength){
            return stack[0];
        }
        //console.log(query[queryIndex] , "Exception" , flag);
        if(query[queryIndex].charCodeAt(0) == 10){
            return internalParser(resultObject , queryIndex+1 , stack , resultObject.__flag , -1);
        }

        if(flag == 0){
            if(query[queryIndex] == ' '){
                return internalParser(resultObject , queryIndex+1 , stack , resultObject.__flag , 0.0);
            }else if(query[queryIndex] == '<'){
                resultObject.__flag = 1;
                return internalParser(resultObject , queryIndex , stack , resultObject.__flag , 0.1);
            }else if( alphanumeric(query[queryIndex]) || que ){
                return resultObject;
            }else{
                return resultObject;
            }

        }else if(flag == 1){
            
            if(query[queryIndex] == '<'){
                let newObject = {};
                newObject.__flag = 1;
                newObject.__args = {};
                newObject.__children = [];
                resultObject.__children.push(newObject);
                stack.push(newObject);
                checkForDirectEnd = false;
                return internalParser(newObject , queryIndex+1 , stack , newObject.__flag , 1.1);
            }

            else if(query[queryIndex] == ' '){
                if(checkForQuotes){
                    queryCache += query[queryIndex];
                }
                else if(queryCache){
                    inputBlocked = true;
                }
                return internalParser(resultObject , queryIndex+1 , stack , resultObject.__flag , 1.2);
            }

            else if(query[queryIndex] == '='){
                if(queryCache){
                    previousCache = queryCache;
                    queryCache = '';
                    inputBlocked = false;
                }
                return internalParser(resultObject , queryIndex+1 , stack , resultObject.__flag , 1.3);
            }

            else if(query[queryIndex] == '/'){
                if(!resultObject.__args["tag"]){
                    if(queryCache)
                        resultObject.__args["tag"] = queryCache;
                    queryCache = '';
                    inputBlocked = false;
                }
                else if(previousCache && queryCache){
                    resultObject.__args[previousCache] = queryCache;
                    previousCache = '';
                    queryCache = '';
                    inputBlocked = false;
                }else if(queryCache){
                    resultObject.__args[queryCache] = true;
                    queryCache = '';
                    inputBlocked = false;
                }
                checkForDirectEnd = true;
                checkForQuotes = false;
                return internalParser(resultObject , queryIndex+1 , stack , resultObject.__flag , 1.4);
            }

            else if(query[queryIndex] == '>'){
                if(!resultObject.__args["tag"]){
                    if(queryCache)
                        resultObject.__args["tag"] = queryCache;
                    queryCache = '';
                    inputBlocked = false;
                }
                else if(previousCache && queryCache){
                    resultObject.__args[previousCache] = queryCache;
                    previousCache = '';
                    queryCache = '';
                    inputBlocked = false;
                }else if(queryCache){
                    resultObject.__args[queryCache] = true;
                    queryCache = '';
                    inputBlocked = false;
                }
                openTagForSecondStep = -1;
                checkForQuotes = false;
                if(checkForDirectEnd){
                    resultObject.__flag = 4;
                    previouslyOccupied = false;
                    return internalParser(resultObject , queryIndex   , stack , resultObject.__flag , 1.5);
                }else{
                    resultObject.__flag = 2;
                    return internalParser(resultObject , queryIndex + 1 , stack , resultObject.__flag , 1.6);
                }
            }


            else if( (query[queryIndex] === "'" ) || (query[queryIndex] === '"' ) || (query[queryIndex] === "`" )){
                console.log("Yeessssss");
                if(checkForQuotes)
                    checkForQuotes = false;
                else
                    checkForQuotes = true;
                return internalParser(resultObject, queryIndex+1 , stack , resultObject.__flag , 1.65);
            }

            else if(alphanumeric(query[queryIndex])){

                if(inputBlocked){
                    if(!resultObject.__args["tag"]){
                        resultObject.__args["tag"] = queryCache;
                        queryCache = '';
                        inputBlocked = false; 
                    }
                    else if(previousCache && queryCache){
                        resultObject.__args[previousCache] = queryCache;
                        previousCache = '';
                        queryCache = '';
                        inputBlocked = false;
                    }else if(queryCache){
                        resultObject.__args[queryCache] = true;
                        queryCache = '';
                        inputBlocked = false;
                    }
                }
                queryCache += query[queryIndex];
                return internalParser(resultObject , queryIndex+1 , stack , resultObject.__flag , 1.7);

            }

            
        }else if(flag == 2){
            //console.log(previousCache , "*" , queryCache , "*" , query[queryIndex] , flag , queryIndex);
            if(query[queryIndex] == '<'){
                if(queryCache){
                    if(queryCache.trim().length > 0){
                    let newTextNode = {}
                    newTextNode.__args = {"tag" : "text" , "content" : queryCache};
                    resultObject.__children.push(newTextNode);
                    queryCache = ''; }else{
                        queryCache = '';
                    }
                }
                openTagForSecondStep = queryIndex;
                checkSlashForSecondStep = false;
                if(previouslyOccupied)
                    previouslyOccupied = false;
                return internalParser(resultObject , queryIndex + 1 , stack , resultObject.__flag , 2.1);
            }
            else if(query[queryIndex] == ' '){
                if(openTagForSecondStep === -1){
                    queryCache += query[queryIndex];
                    return internalParser(resultObject , queryIndex + 1 , stack , resultObject.__flag , 2.2);
                }else{
                    return internalParser(resultObject , queryIndex + 1 ,stack , resultObject.__flag , 2.3);
                }
            }else if(alphanumeric(query[queryIndex])){
                if(openTagForSecondStep == -1){
                    queryCache += query[queryIndex];
                    return internalParser(resultObject , queryIndex+1 , stack , resultObject.__flag , 2.4);
                }else{
                
                if(previouslyOccupied){
                    queryCache += query[queryIndex];
                    return internalParser(resultObject , queryIndex+1 , stack , resultObject.__flag , 2.5);
                }else{
                    let temp = openTagForSecondStep;
                    resultObject.__flag = 1;
                    previouslyOccupied = true;
                return internalParser(resultObject , temp , stack , resultObject.__flag , 2.6);
                    }
                }
            }else if(query[queryIndex] == '/'){
                
                let temp = openTagForSecondStep;
                resultObject.__flag = 4;
                return internalParser(resultObject , temp , stack , resultObject.__flag , 2.7);
            }

        }else if(flag == 4) {
            
            if(query[queryIndex] === '>'){
                let temp = stack.pop();
                if(stack.length){
                let temp1 = stack[stack.length - 1];
                temp1.__flag = 2;
                openTagForSecondStep = -1;
                previouslyOccupied = false;
                return internalParser(temp1 , queryIndex+1 , stack , temp1.__flag , 4.0);
                }
            }else{
                return internalParser(resultObject , queryIndex+1 , stack , resultObject.__flag , 4.1);
            }
        }
    }

    let newObject = {}
    newObject.__flag = 0;
    newObject.__args = {};
    newObject.__children = [];
    internalParser(newObject , 0 , [newObject] , newObject.__flag);
    console.log(newObject.__children[0].__children[1].__children[0])
    //console.log(newObject.__children[0].__children[1].__children[3].__children[0].__children[0].__children, "p");
    //return newObject;

}

module.exports = {
    "parser":parser
};