function parsedTree(query){

    function alphanumeric(inputtxt)
    { 
        var letters = /^[0-9a-zA-Z]+$/;
        if(inputtxt.match(letters))
            return true;
        else
            return false;
    }

    let queryCache = '';
    let previousQueryCache = '';
    function internalParser(resultObject , queryIndex ,  stack , flag){


        if(flag === 0){
            if(query[queryIndex] == ' '){
                return internalParser(resultObject , queryIndex+1 , stack , stack.length>0?stack[stack.length - 1].__flag:0);
            }else if(query[queryIndex] == '<'){
                let newObject = {};
                newObject.__flag = 1;
                newObject.__temp = '';
                newObject.__secondTemp = {flag:false , index:''};
                if(resultObject == null){
                    resultObject = {}
                    resultObject.__flag = 0;
                    resultObject.__temp = '';
                    resultObject.__secondTemp = {flag:false , index:''};
                    stack.push(resultObject);
                }
                stack.push(newObject);
                if(resultObject.siblings)
                resultObject.siblings.push(newObject);
                else
                resultObject.siblings = [newObject];
                return internalParser(newObject , queryIndex+1 , stack , stack[stack.length-1].__flag);
            }else{
                return;
            }
        }else if(flag === 1){
            if(query[queryIndex] == ' ' && queryCache == ''){
                return internalParser(resultObject , queryIndex+1 , stack , stack[stack.length - 1].__flag);
            }else if(alphanumeric(query[queryIndex])){
                queryCache += query[queryIndex];
                return internalParser(resultObject , queryIndex+1 , stack , stack[stack.length - 1].__flag);
            }else if(query[queryIndex] == ' ' && queryCache && previousQueryCache == ''){
                if(!resultObject.tag){
                resultObject.tag = queryCache;
                queryCache = '';
                return internalParser(resultObject , queryIndex+1 , stack , stack[stack.length - 1].__flag);
                }else{
                    if(resultObject.__temp == ''){
                    resultObject.__temp = queryCache;
                    queryCache = '';
                    return internalParser(resultObject , queryIndex+1 , stack , stack[stack.length - 1].__flag);
                    }else{
                        resultObject[resultObject.__temp] = true;
                        resultObject.__temp = queryCache;
                        queryCache = '';
                        return internalParser(resultObject , queryIndex+1 , stack , stack[stack.length - 1].__flag);
                    }
                }
            }else if(query[queryIndex] == '=' && queryCache == ''){
                if(resultObject.__temp){
                previousQueryCache = resultObject.__temp;
                resultObject.__temp = '';
                return internalParser(resultObject , queryIndex+1 , stack , stack[stack.length - 1].__flag);
                }else{
                    return;
                }
            }else if(query[queryIndex] == ' ' && previousQueryCache && resultObject.__temp == ''){
                resultObject[previousQueryCache] = queryCache;
                queryCache = '';
                previousQueryCache = '';
                return internalParser(resultObject , queryIndex+1 , stack , stack[stack.length - 1].__flag);
            }else if(query[queryIndex] == '>'){
                if(previousQueryCache){
                    resultObject[previousQueryCache] = queryCache;
                    queryCache = '';
                    previousQueryCache = '';
                }else if(resultObject.__temp){
                    resultObject[resultObject.__temp] = true;
                    resultObject[queryCache] = true;
                    resultObject.___temp = '';
                    queryCache = '';
                }else if(queryCache){
                    resultObject[query] = true;
                    queryCache = '';
                }
                resultObject.__flag = 2;
                return internalParser(resultObject , queryIndex+1 , stack , stack[stack.length - 1].__flag);
            }
        }else if(flag == 2){

            if( query[queryIndex] == ' ' || alphanumeric(query[queryIndex])){
                if(query[queryIndex] == '/'){
                    if(resultObject.__secondTemp.flag){
                        resultObject.flag = 3;
                        resultObject.__secondTemp = {flag: false, index: ''};
                        return internalParser(resultObject , queryIndex+1 , stack , stack[stack.length - 1].__flag);
                    }else{
                        return;
                    }
                }else{
                    if(resultObject.__secondTemp.flag){
                        let newTempQueryIndex = resultObject.__secondTemp.index;
                        resultObject.__secondTemp = {flag: false , index: ''};
                        
                        return internalParser(resultObject , newTempQueryIndex,stack,)
                    }
                queryCache += query[queryIndex];
                return internalParser(resultObject , queryIndex+1 , stack , stack[stack.length - 1].__flag);
                }
            }else if(query[queryIndex] == '<'){
                let textContent = queryCache;
                if(resultObject.children){
                    let newObject = {};
                    newObject.textContent = textContent;
                    resultObject.children.push(newObject);
                    queryCache = '';
                }
                resultObject.__secondTemp = {flag: true , index: queryIndex};
                return internalParser(resultObject , queryIndex+1 , stack,stack[stack.length - 1].__flag);
                
            }


        }



    }



    let rootElement = {};
    rootElement.__flag = 0;
    return internalParser(null , 0 , [] , 0)
}