//class to hold individual doors, stores specific data on doors, completed by 2 calls Door and DoorStatus
class DoorObject {
    constructor(name, type, controllerID, doorID, uniqID,) {
        let date = new Date();
        this.name = name;
        this.type = type;
        this.controllerID = controllerID;
        this.doorID = doorID;
        this.uniqID = uniqID;
        this.state = null;
        this.selected = true;
        this.curTime = date.toISOString();
        this.timeStamp = 0;
        this.summary = null;
        this.isOpen = false;
        this.ifForced = false;
        this.isOverrideOn = false;
    }
    getCurTime(){ this.curTime};
    getName(){return this.name}
}

class ControllerObject {
    constructor(name, id, rowVersion){
        let date = new Date();
        this.id = id;
        this.name = name;
        this.rowVersion = rowVersion;
        this.state = null;
        this.selected = true;
        this.curTime = date;
        this.IP = null;
    }
    getId(){return this.id}
    getName(){return this.name}
}

class moduleObject {
    constructor(){

    }
}

class nodeControllerList {
    constructor(){
        this.controllers = [];
    }

    newController(name, id){
        var c = new ControllerObject(name, id);
        //  for(let i=0;this.controllers.length;i++){
        //      console.log(this.controllers[i].id)
        //  }

        if(this.controllers.find(e => e.id === id)){
            var oldController = this.controllers.find(e => e.id === id);
            try{
                for (var key in oldController){
                    if(oldController.hasOwnProperty(key)){
                        try{
                            var controllerKey;
                            controllerKey = oldController[key];
                            if(controllerKey != c[key]){
                                c[key] = oldController[key];
                            }
                            else{
                                
                            }
                        }
                        catch(e){

                        }
                    }
                }
            }
            catch(e){
            }

            return c    
        }
        else{
            this.controllers.push(c)
            //console.log("adding")
            return c
        }
        
    }

    updateController(id, state, curTime, IP){
        //console.log(this.doors.findIndex(e => e.uniqID === uniqID))
        // var d = new DoorObject(uniqID, state, curTime, TimeStamp)
        //console.log(uniqID, state, curTime, TimeStamp)
        if(this.controllers.find(e => e.id === id)){
           // console.log("true")
            var oldController = this.controllers.find(e => e.id === id)
            //console.log("OLD OLD DOOR", oldDoor)
            try{
                //console.log('trying')
                oldController.state = state;
                oldController.curTime = curTime;
                oldController.IP = IP;
                //console.log("new old door", oldDoor);
        }
        catch(f){
            console.log(f)
        }
            //return d    
        }
        else{
            //this.doors.push(d)
           //console.log(d)
            //console.log("adding")
            //return d
        }
    }    

    get allControllers(){
        return this.controllers;
    }
}


//class to hold collection of doors
class nodeDoorList {
    constructor(){
        this.doors = []
    }
    newDoor(name, type, controllerID, doorID, uniqID){
        //console.log(this.doors.findIndex(e => e.uniqID === uniqID))
        var d = new DoorObject(name, type, controllerID, doorID, uniqID)
        
        if(this.doors.find(e => e.uniqID === uniqID)){
           // console.log("true")
            var oldDoor = this.doors.find(e => e.uniqID === uniqID)
            //console.log(oldDoor)
            try{
                //console.log('trying')
            for (var key in oldDoor) {
                //console.log("for");
                if (oldDoor.hasOwnProperty(key)) {
                    try {
                        var doorKey;
                        doorKey = oldDoor[key];
                        //console.log("trying");
                        if(doorKey != d[key]){
                            d[key] = oldDoor[key];
                            //console.log("updated")
                        }
                        else{
                            //console.log("made it")
                        }
                        
                    }
                    catch(g) {
                        console.log(g);
                    }
                }
            }
        }
        catch(f){
            console.log(f)
        }
            return d    
        }
        else{
            this.doors.push(d)
           //console.log(d)
            //console.log("adding")
            return d
        }
    }

    updateDoor(uniqID, state, curTime, summary, isOpen, ifForced, isOverrideOn){
        //console.log(this.doors.findIndex(e => e.uniqID === uniqID))
        // var d = new DoorObject(uniqID, state, curTime, TimeStamp)
        //console.log(uniqID, state, curTime, TimeStamp)
        if(this.doors.find(e => e.uniqID === uniqID)){
           // console.log("true")
            var oldDoor = this.doors.find(e => e.uniqID === uniqID)
            //console.log("OLD OLD DOOR", oldDoor)
            try{
                //console.log('trying')
                oldDoor.state = state;
                oldDoor.curTime = curTime;
                oldDoor.summary = summary;
                oldDoor.isOpen = isOpen;
                oldDoor.ifForced = ifForced;
                oldDoor.isOverrideOn = isOverrideOn;
                //console.log("new old door", oldDoor);
        }
        catch(f){
            console.log(f)
        }
            //return d    
        }
        else{
            //this.doors.push(d)
           //console.log(d)
            //console.log("adding")
            //return d
        }
    }

    
    //returns all doors in array
    get allDoors(){
        return this.doors
    }
    //update doors in array
    // set updateDoors(name, type, controllerID, doorID){
    //     let d = new DoorObject(name, type, controllerID, doorID, uniqID)

    //     //for ( var key in )

    // }
}

class InputObject {
    constructor(name, id, controllerId){
        let date = new Date();
        this.id = id;
        this.name = name;
        this.rowVersion = 0;
        this.summary = null;
        this.selected = true;
        this.curTime = date.toISOString();
        this.controllerID = controllerId;
    }
    getId(){return this.id}
    getName(){return this.name}
}

class nodeInputList {
    constructor(){
        this.inputs = [];
    }

    newInput(name, id, controllerId){
        var c = new InputObject(name, id, controllerId);

        if(this.inputs.find(e => e.id === id)){
            var oldInput = this.inputs.find(e => e.id === id);
            try{
                for (var key in oldInput){
                    if(oldInput.hasOwnProperty(key)){
                        try{
                            var inputKey;
                            inputKey = oldInput[key];
                            if(inputKey != c[key]){
                                c[key] = oldInput[key];
                            }
                            else{
                                
                            }
                        }
                        catch(e){

                        }
                    }
                }
            }
            catch(e){
            }

            return c    
        }
        else{
            this.inputs.push(c)

            return c
        }
        
    }

    updateInput(id, summary, curTime){
        //console.log("updating inputs")
        //console.log(id)
        if(this.inputs.find(e => e.id === id)){
            
            var oldInput = this.inputs.find(e => e.id === id)
            // console.log("this is the old summary before update: "+ oldInput.summary)
            try{

                oldInput.summary = summary;
                // console.log("this is the  summary: "+ summary)
                // console.log("this is the old summary: "+ oldInput.summary)
                oldInput.curTime = curTime;

        }
        catch(f){
            console.log(f)
        }

        }
        else{

        }
    }    

    get allInputs(){
        return this.inputs;
    }
}


module.exports = { DoorObject, nodeDoorList, ControllerObject, nodeControllerList, InputObject, nodeInputList}