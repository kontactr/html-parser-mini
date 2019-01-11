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

    let checkForDirectEnd = false;
    let checkForSingleProp = false;
    let inputBlocked = false;

    let queryLength = query.length;

    function internalParser(resultObject , queryIndex , stack , flag , step=-1){
        //console.log(query[queryIndex-1] , "$" , queryCache , "%" , previousCache , "&" , step)

        if(queryIndex >= queryLength){
            return stack[0];
        }

        if(query[queryIndex].charCodeAt(0) == 10){
            return internalParser(resultObject , queryIndex+1 , stack , resultObject.__flag);
        }

        if(flag == 0){
            if(query[queryIndex] == ' '){
                return internalParser(resultObject , queryIndex+1 , stack , resultObject.__flag);
            }else if(query[queryIndex] == '<'){
                resultObject.__flag = 1;
                return internalParser(resultObject , queryIndex , stack , resultObject.__flag);
            }else if( alphanumeric(query[queryIndex]) ){
                return resultObject;
            }else{
                return resultObject;
            }

        }else if(flag == 1){
            console.log(previousCache , queryCache , query[queryIndex]);
            if(query[queryIndex] == '<'){
                let newObject = {};
                newObject.__flag = 1;
                newObject.__args = {};
                newObject.__children = [];
                resultObject.__children.push(newObject);
                stack.push(newObject);
                return internalParser(newObject , queryIndex+1 , stack , newObject.__flag , 1);
            }

            else if(query[queryIndex] == ' '){
                if(queryCache){
                    inputBlocked = true;
                }
                return internalParser(resultObject , queryIndex+1 , stack , resultObject.__flag , 2);
            }

            else if(query[queryIndex] == '='){
                if(queryCache){
                    previousCache = queryCache;
                    queryCache = '';
                    inputBlocked = false;
                }
                return internalParser(resultObject , queryIndex+1 , stack , resultObject.__flag , 2);
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
                return internalParser(resultObject , queryIndex+1 , stack , resultObject.__flag , 5);
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
                if(checkForDirectEnd){
                    resultObject.__flag = 4;
                    return internalParser(resultObject , queryIndex , stack , resultObject.__flag , 4);
                }else{
                    resultObject.__flag = 2;
                    return internalParser(resultObject , queryIndex , stack , resultObject.__flag , 4);
                }
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
                return internalParser(resultObject , queryIndex+1 , stack , resultObject.__flag , 3);

            }

            
        }
    }

    let newObject = {}
    newObject.__flag = 0;
    newObject.__args = {};
    newObject.__children = [];
    internalParser(newObject , 0 , [newObject] , newObject.__flag);
    console.log(newObject.__children , "p");
    //return newObject;

}

module.exports = {
    "parser":parser
};