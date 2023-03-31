/*
  MIT License Copyright 2021, 2022 - Bitpool Pty Ltd
*/

module.exports = function (RED) {
  const {
    DoorObject,
    nodeDoorList,
    ControllerObject,
    nodeControllerList,
    InputObject,
    nodeInputList,
  } = require("./common");
  const { ToadScheduler, SimpleIntervalJob, Task } = require("toad-scheduler");
  const fetch = require("node-fetch");
  // const https = require("https");
  var parser = require("xml2json");

  var options = {
    object: true,
    reversible: false,
    coerce: false,
    sanitize: true,
    trim: true,
    arrayNotation: false,
    alternateTextNode: false,
  };

  function bpBitpoolIntegriti(config) {
    RED.nodes.createNode(this, config);

    var node = this;
    var globalContext = this.context().global;

    node.bpintegritiDisplayName = config.bpintegritiDisplayName;
    node.bpChkShowDateOnLabel = config.bpChkShowDateOnLabel;
    node.bpChkShowDebugWarnings = config.bpChkShowDebugWarnings;
    node.bpintegritiEndpoint = config.bpintegritiEndpoint;
    node.bpintegritiEndpointPort = config.bpintegritiEndpointPort;
    node.bpintegritiDoorInclude = config.bpintegritiDoorInclude;
    this.scheduler = new ToadScheduler();

    //Endpoints
    RED.httpAdmin.get("/bitpool-integriti-data/getTree", getTreeCallback);
    RED.httpAdmin.get(
      "/bitpool-integriti-data/setSelected",
      setSelectedCallback
    );

    //doorList
    let doorArray = new nodeDoorList();
    //console.log(node.nodeDoorList);
    globalContext.set("doorList", doorArray.allDoors);
    //this.nodeDoorList = globalContextContext.get("doorArray");
    let controllerArray = new nodeControllerList();
    globalContext.set("controllerList", controllerArray.allControllers);
    let inputArray = new nodeInputList();
    globalContext.set("inputList", inputArray.allInputs);

    this.status({});

    node.on("input", function (msg) {
      try {
        dl = globalContext.get("doorList");
        cl = globalContext.get("controllerList");
        il = globalContext.get("inputList");
        //console.log("this when at this point")

        const task = new Task("simple task", () => {
          // if (dl != null) {
          //   try {
          //     var server = String(node.bpintegritiEndpoint);
          //     var port = String(node.bpintegritiEndpointPort);
          //     var doorList =
          //       "/DB/DoorState?query_size=5000&query_page=1&sort_property=ID&sort_direction=asc";
          //     var URL = server + ":" + port + doorList;
          //     fetch(URL)
          //       .then((res) => res.text())
          //       .then((res) => {
          //         resJson = parser.toJson(res, options);
          //         //node.warn("Request Sent to: " + URL);                   // This outputs a log to the node red command line
          //         msg.payload = resJson; //set mjson to message payload
          //         //node.send(msg);
          //         var tempDoors = resJson.Results.DoorState;
          //         //console.log(tempDoors)

          //         for (var key in tempDoors) {
          //           if (tempDoors.hasOwnProperty(key)) {
          //             try {
          //               try {
          //                 let date = new Date();

          //                 var uniqID = tempDoors[key].ID[1];
          //                 var state = tempDoors[key].State;
          //                 var curTime = date.toISOString();
          //                 var summary = tempDoors[key].Summary;
          //                 var isOpen = tempDoors[key].IsOpen;
          //                 var ifForced = tempDoors[key].Forced;
          //                 var isOverrideOn = tempDoors[key].IsOverrideOn;
          //                 //var TimeStamp = tempDoors[key].TimeStamp;
          //               } catch (e) {
          //                 node.warn(e);
          //               }
          //               try {
          //                 //const newDoorObj = new DoorObject(name, type, controllerID, doorID);
          //                 try {
          //                   doorArray.updateDoor(
          //                     uniqID,
          //                     state,
          //                     curTime,
          //                     summary,
          //                     isOpen,
          //                     ifForced,
          //                     isOverrideOn
          //                   );
          //                   //console.log(uniqID, state, curTime, TimeStamp)
          //                 } catch (e) {
          //                   node.warn(e);
          //                 }
          //                 //node.warn("doorArray");
          //                 //node.nodeDoorList.push(newDoor);
          //               } catch (e) {
          //                 node.warn(e);
          //               }

          //               // door['Name'] = tempDoors[key].Name[0];

          //               // node.warn("trying");
          //             } catch {
          //               //node.warn("failed");
          //             }
          //           }
          //         }
          //       });
          //   } catch (err) {
          //     console.log(err);
          //   }
          // }
          if (dl != null) {
            try {
              var server = String(node.bpintegritiEndpoint);
              var port = String(node.bpintegritiEndpointPort);
              var doorList =
                "/DB/DoorState?query_size=5000&query_page=1&sort_property=ID&sort_direction=asc";
              var URL = server + ":" + port + doorList;
          
              fetchWithTimeout(URL)
                .then((res) => res.text())
                .then((res) => {
                  resJson = parser.toJson(res, options);
                  msg.payload = resJson;
                  var tempDoors = resJson.Results.DoorState;
          
                  for (var key in tempDoors) {
                    if (tempDoors.hasOwnProperty(key)) {
                      let date = new Date();
          
                      var uniqID = tempDoors[key].ID[1];
                      var state = tempDoors[key].State;
                      var curTime = date.toISOString();
                      var summary = tempDoors[key].Summary;
                      var isOpen = tempDoors[key].IsOpen;
                      var ifForced = tempDoors[key].Forced;
                      var isOverrideOn = tempDoors[key].IsOverrideOn;
          
                      try {
                        doorArray.updateDoor(
                          uniqID,
                          state,
                          curTime,
                          summary,
                          isOpen,
                          ifForced,
                          isOverrideOn
                        );
                      } catch (e) {
                        node.warn(e);
                      }
                    }
                  }
                })
                .catch((err) => {
                  console.log(err);
                  node.warn(err);
                });
            } catch (err) {
              console.log(err);
            }
          }
          // if (cl != null) {
          //   try {
          //     var server = String(node.bpintegritiEndpoint);
          //     var port = String(node.bpintegritiEndpointPort);
          //     var doorList =
          //       "/DB/ControllerState?query_size=5000&query_page=1&sort_property=ID&sort_direction=asc";
          //     var URL = server + ":" + port + doorList;
          //     fetch(URL)
          //       .then((res) => res.text())
          //       .then((res) => {
          //         resJson = parser.toJson(res, options);
          //         //node.warn("Request Sent to: " + URL);                   // This outputs a log to the node red command line
          //         msg.payload = resJson; //set mjson to message payload
          //         //node.send(msg);
          //         var tempControllers = resJson.Results.ControllerState;
          //         //console.log(tempControllers)

          //         if (tempControllers.length > 0) {
          //           tempControllers = tempControllers;
          //         } else {
          //           tempControllers = [tempControllers];
          //         }

          //         for (var key in tempControllers) {
          //           if (tempControllers.hasOwnProperty(key)) {
          //             try {
          //               try {
          //                 let date = new Date();
          //                 //console.log(tempControllers[key].ID[1])

          //                 //console.log(curTime)
          //                 var id = tempControllers[key].ID[1];
          //                 var state = tempControllers[key].ConnectionStatus;
          //                 var curTime = date;
          //                 var IP = tempControllers[key].CurrentAddress;
          //               } catch (e) {
          //                 node.warn(e);
          //               }
          //               try {
          //                 const newControllerObj = new ControllerObject(
          //                   id,
          //                   state,
          //                   curTime,
          //                   IP
          //                 );
          //                 try {
          //                   controllerArray.updateController(
          //                     id,
          //                     state,
          //                     curTime,
          //                     IP
          //                   );
          //                   console.log(uniqID, state, curTime, IP);
          //                 } catch (e) {
          //                   node.warn(e);
          //                 }
          //                 //node.warn("doorArray");
          //                 //node.nodeControllerList.push(newController);
          //               } catch (e) {
          //                 node.warn(e);
          //               }

          //               // door['Name'] = tempControllers[key].Name[0];

          //               // node.warn("trying");
          //             } catch {
          //               //node.warn("failed");
          //             }
          //           }
          //         }
          //       });
          //   } catch (err) {
          //     console.log(err);
          //   }
          // }
          if (cl != null) {
            try {
              var server = String(node.bpintegritiEndpoint);
              var port = String(node.bpintegritiEndpointPort);
              var doorList =
                "/DB/ControllerState?query_size=5000&query_page=1&sort_property=ID&sort_direction=asc";
              var URL = server + ":" + port + doorList;
          
              fetchWithTimeout(URL)
                .then((res) => res.text())
                .then((res) => {
                  resJson = parser.toJson(res, options);
                  msg.payload = resJson;
                  var tempControllers = resJson.Results.ControllerState;
          
                  if (tempControllers.length > 0) {
                    tempControllers = tempControllers;
                  } else {
                    tempControllers = [tempControllers];
                  }
          
                  for (var key in tempControllers) {
                    if (tempControllers.hasOwnProperty(key)) {
                      let date = new Date();
                      var id = tempControllers[key].ID[1];
                      var state = tempControllers[key].ConnectionStatus;
                      var curTime = date;
                      var IP = tempControllers[key].CurrentAddress;
          
                      try {
                        controllerArray.updateController(id, state, curTime, IP);
                      } catch (e) {
                        node.warn(e);
                      }
                    }
                  }
                })
                .catch((err) => {
                  console.log(err);
                  node.warn(err);
                });
            } catch (err) {
              console.log(err);
            }
          }
          // 
          if (il != null) {
            try {
              var server = String(node.bpintegritiEndpoint);
              var port = String(node.bpintegritiEndpointPort);
              var inputList =
                "/DB/InputState?query_size=5000&query_page=1&sort_property=ID&sort_direction=asc";
              var URL = server + ":" + port + inputList;
          
              fetchWithTimeout(URL)
                .then((res) => res.text())
                .then((res) => {
                  resJson = parser.toJson(res, options);
                  msg.payload = resJson;
                  var tempInputs = resJson.Results.InputState;
          
                  for (var key in tempInputs) {
                    if (tempInputs.hasOwnProperty(key)) {
                      let date = new Date();
                      var id = tempInputs[key].ID[1];
                      var curTime = date.toISOString();
                      var summary = tempInputs[key].Summary;
          
                      try {
                        inputArray.updateInput(id, summary, curTime);
                      } catch (e) {
                        node.warn(e);
                      }
                    }
                  }
                })
                .catch((err) => {
                  console.log(err);
                  node.warn(err);
                });
            } catch (err) {
              console.log(err);
            }
          }
        });

        const job = new SimpleIntervalJob({ seconds: 30 }, task);

        this.scheduler.addSimpleIntervalJob(job);
      } catch (e) {
        console.log("Issue initializing client: ", e);
      }

      const task2 = new Task("poll slected doors", () => {
        // if(inputArray != null){
        //   let inputs = globalContext.get("inputList");

        //   for (let i = 0; i < inputs.length; i++){
        //     fullName = inputs[i].name;
        //     doorName = fullName.substring(0, fullName.indexOf(' '));
        //     pointName= fullName.substring(fullName.indexOf(' ') + 1);

        //     console.log(doorName + " - "+pointName+ " - "+inputs[i].summary);

        //     rootTopic = "test/" + doorName + "/" + pointName;
        //     msg.topic = rootTopic;
        //     msg.payload = inputs[i].summary;
        //     sendMsg(msg);

        //   }
        // }

        if (doorArray != null) {
          let doors = globalContext.get("doorList");
          let controllers = globalContext.get("controllerList");
          let inputs = globalContext.get("inputList");

          for (let i = 0; i < controllers.length; i++) {
            cId = controllers[i].id;

            for (let z = 0; z < inputs.length; z++) {
              if (inputs[z].controllerID == cId) {
                fullName = inputs[z].name;
                doorName = fullName.substring(0, fullName.indexOf(" "));
                pointName = fullName.substring(fullName.indexOf(" ") + 1);

                console.log(
                  controllers[i].name +
                    " - " +
                    doorName +
                    " - " +
                    pointName +
                    " - " +
                    inputs[z].summary
                );

                rootTopic =
                  "integriti/" +
                  controllers[i].name +
                  "/Inputs/" +
                  doorName +
                  "/";
                msg.topic = rootTopic + pointName;
                msg.payload = inputs[z].summary;

                sendMsg(msg);
              }
            }

            for (let j = 0; j < doors.length; j++) {
              //console.log(doors[j].controllerID +"  ---  "+ cId)
              //console.log("about to match door to controller")
              if (doors[j].controllerID == cId) {
                //console.log(doors[i].getName())
                //console.log("about to check selection", doors[j].selected)
                if (doors[j].selected == true) {
                  for (let k = 0; k > doors[j].length; k++) {}
                  //console.log(doors[j].name)

                  rootTopic =
                    "integriti/" +
                    controllers[i].name +
                    "/Doors/" +
                    doors[j].name +
                    "/";
                  msg.topic = rootTopic + "state";
                  msg.payload = doors[j].state;
                  sendMsg(msg);

                  rootTopic =
                    "integriti/" +
                    controllers[i].name +
                    "/Doors/" +
                    doors[j].name +
                    "/";
                  msg.topic = rootTopic + "summary";
                  msg.payload = doors[j].summary;
                  sendMsg(msg);

                  rootTopic =
                    "integriti/" +
                    controllers[i].name +
                    "/Doors/" +
                    doors[j].name +
                    "/";
                  msg.topic = rootTopic + "open";
                  msg.payload = doors[j].isOpen;
                  sendMsg(msg);

                  rootTopic =
                    "integriti/" +
                    controllers[i].name +
                    "/Doors/" +
                    doors[j].name +
                    "/";
                  msg.topic = rootTopic + "forced";
                  msg.payload = doors[j].ifForced;
                  sendMsg(msg);

                  rootTopic =
                    "integriti/" +
                    controllers[i].name +
                    "/Doors/" +
                    doors[j].name +
                    "/";
                  msg.topic = rootTopic + "override";
                  msg.payload = doors[j].isOverrideOn;
                  sendMsg(msg);
                }
              }
            }
            //console.log(controllers[i].selected)
            if (controllers[i].selected) {
              rootTopic = "integriti/" + controllers[i].name + "/";
              msg.topic = rootTopic + "state";
              msg.payload = controllers[i].state;
              sendMsg(msg);

              rootTopic = "integriti/" + controllers[i].name + "/";
              msg.topic = rootTopic + "id";
              msg.payload = controllers[i].id;
              sendMsg(msg);

              rootTopic = "integriti/" + controllers[i].name + "/";
              msg.topic = rootTopic + "IP";
              msg.payload = controllers[i].IP;
              sendMsg(msg);
            }
            let date = new Date();
            let currentTime = date;
            let oldTime = controllers[i].curTime;
            let fiveMin = 1 * 60 * 1000;
            let offline = currentTime - oldTime > fiveMin;

            if (offline) {
              rootTopic = "integriti/" + controllers[i].name + "/";
              msg.topic = rootTopic + "status";
              msg.payload = false;
              sendMsg(msg);
            } else {
              rootTopic = "integriti/" + controllers[i].name + "/";
              msg.topic = rootTopic + "status";
              msg.payload = true;
              sendMsg(msg);
            }
          }

          // }
          // for(let j = 0; j<doors.length; j++){
          // dId = doors[j].name;
          // console.log(dId)
          // }
          // for(var key in doors){
          //   let value = doors[key];
          //   door = (`${key}: `, value)
          //console.log(doors);
          //console.log(controllers)
          // }
        }
      });
      const job2 = new SimpleIntervalJob({ seconds: 30 }, task2);

      this.scheduler.addSimpleIntervalJob(job2);

      // try {
      //   var server = String(node.bpintegritiEndpoint);
      //   var port = String(node.bpintegritiEndpointPort);
      //   var doorList =
      //     "/DB/Door?query_size=5000&query_page=1&sort_property=ID&sort_direction=asc";
      //   var URL = server + ":" + port + doorList;
      //   fetch(URL)
      //     .then((res) => res.text())
      //     .then((res) => {
      //       resJson = parser.toJson(res, options);
      //       //node.warn("Request Sent to: " + URL);                   // This outputs a log to the node red command line
      //       msg.payload = resJson; //set mjson to message payload
      //       // node.send(msg);
      //       var tempDoors = resJson.Results.Door;

      //       for (var key in tempDoors) {
      //         if (tempDoors.hasOwnProperty(key)) {
      //           try {
      //             var name = tempDoors[key].Name;
      //             var type = tempDoors[key].Type;

      //             try {
      //               var controllerID = tempDoors[key].ControllerID;
      //               var doorID = tempDoors[key].ID[0];
      //               var uniqID = tempDoors[key].ID[1];
      //               //console.log(curTime)
      //             } catch (e) {
      //               node.warn(e);
      //             }
      //             try {
      //               //const newDoorObj = new DoorObject(name, type, controllerID, doorID);
      //               try {
      //                 doorArray.newDoor(
      //                   name,
      //                   type,
      //                   controllerID,
      //                   doorID,
      //                   uniqID
      //                 );
      //               } catch (e) {
      //                 node.warn(e);
      //               }
      //               //node.warn("doorArray");
      //               //node.nodeDoorList.push(newDoor);
      //             } catch (e) {
      //               node.warn(e);
      //             }

      //             // door['Name'] = tempDoors[key].Name[0];

      //             // node.warn("trying");
      //           } catch {
      //             //node.warn("failed");
      //           }
      //         }
      //       }

      //       globalContext.set("doorList", doorArray.allDoors);
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //       node.warn(err);
      //     });
      // } catch (err) {
      // } finally {
      // }
      const fetchWithTimeout = (url, options, timeout = 5000) => {
        return Promise.race([
          fetch(url, options),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timed out')), timeout)
          ),
        ]);
      };
      
      try {
        var server = String(node.bpintegritiEndpoint);
        var port = String(node.bpintegritiEndpointPort);
        var doorList =
          "/DB/Door?query_size=5000&query_page=1&sort_property=ID&sort_direction=asc";
        var URL = server + ":" + port + doorList;
      
        fetchWithTimeout(URL)
          .then((res) => res.text())
          .then((res) => {
            resJson = parser.toJson(res, options);
            msg.payload = resJson;
            var tempDoors = resJson.Results.Door;
      
            for (var key in tempDoors) {
              if (tempDoors.hasOwnProperty(key)) {
                var name = tempDoors[key].Name;
                var type = tempDoors[key].Type;
      
                try {
                  var controllerID = tempDoors[key].ControllerID;
                  var doorID = tempDoors[key].ID[0];
                  var uniqID = tempDoors[key].ID[1];
                } catch (e) {
                  node.warn(e);
                }
      
                try {
                  doorArray.newDoor(name, type, controllerID, doorID, uniqID);
                } catch (e) {
                  node.warn(e);
                }
              }
            }
      
            globalContext.set("doorList", doorArray.allDoors);
          })
          .catch((err) => {
            console.log(err);
            node.warn(err);
          });
      } catch (err) {
        node.warn(err);
      }
      
      // try {
      //   //console.log(buildVueTree());
      // } catch (e) {
      //   console.log(e);
      // }

      // //build controller array
      // try {
      //   var server = String(node.bpintegritiEndpoint);
      //   var port = String(node.bpintegritiEndpointPort);
      //   var controllerList =
      //     "/DB/Controller?query_size=5000&query_page=1&sort_property=ID&sort_direction=asc";
      //   var URL = server + ":" + port + controllerList;
      //   fetch(URL)
      //     .then((res) => res.text())
      //     .then((res) => {
      //       resJson = parser.toJson(res, options);
      //       //node.warn("Request Sent to: " + URL);                   // This outputs a log to the node red command line
      //       msg.payload = resJson; //set mjson to message payload
      //       //node.send(msg);
      //       var tempControllers = resJson.Results.Controller;

      //       for (var key in tempControllers) {
      //         if (tempControllers.hasOwnProperty(key)) {
      //           try {
      //             var name = tempControllers[key].Name;
      //             var Id = tempControllers[key].ID[0];
      //             try {
      //               try {
      //                 controllerArray.newController(name, Id);
      //                 //node.warn(controllerArray);
      //               } catch (e) {
      //                 node.warn(e);
      //               }
      //             } catch (e) {
      //               node.warn(e);
      //             }
      //           } catch {
      //             node.warn("failed");
      //           }
      //         }
      //       }

      //       globalContext.set("controllerList", controllerArray.allControllers);
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //       node.warn(err);
      //     });
      // } catch (err) {
      // } finally {
      // }

      
      try {
        //console.log(buildVueTree());
      } catch (e) {
        console.log(e);
      }
      
      //build controller array
      try {
        var server = String(node.bpintegritiEndpoint);
        var port = String(node.bpintegritiEndpointPort);
        var controllerList =
          "/DB/Controller?query_size=5000&query_page=1&sort_property=ID&sort_direction=asc";
        var URL = server + ":" + port + controllerList;
      
        fetchWithTimeout(URL)
          .then((res) => res.text())
          .then((res) => {
            resJson = parser.toJson(res, options);
            msg.payload = resJson;
            var tempControllers = resJson.Results.Controller;
      
            for (var key in tempControllers) {
              if (tempControllers.hasOwnProperty(key)) {
                var name = tempControllers[key].Name;
                var Id = tempControllers[key].ID[0];
      
                try {
                  controllerArray.newController(name, Id);
                } catch (e) {
                  node.warn(e);
                }
              }
            }
      
            globalContext.set("controllerList", controllerArray.allControllers);
          })
          .catch((err) => {
            console.log(err);
            node.warn(err);
          });
      } catch (err) {
        node.warn(err);
      }
      
      // try {
      //   console.log("initialising the inputs");
      //   var server = String(node.bpintegritiEndpoint);
      //   var port = String(node.bpintegritiEndpointPort);
      //   var inputList =
      //     "/DB/Input?query_size=5000&query_page=1&sort_property=ID&sort_direction=asc";
      //   var URL = server + ":" + port + inputList;
      //   fetch(URL)
      //     .then((res) => res.text())
      //     .then((res) => {
      //       resJson = parser.toJson(res, options);
      //       //node.warn("Request Sent to: " + URL);                   // This outputs a log to the node red command line
      //       msg.payload = resJson; //set mjson to message payload
      //       //node.send(msg);
      //       var tempInputs = resJson.Results.Input;

      //       for (var key in tempInputs) {
      //         if (tempInputs.hasOwnProperty(key)) {
      //           try {
      //             var name = tempInputs[key].Name;
      //             var id = tempInputs[key].ID[1];
      //             var controllerId = tempInputs[key].ControllerID;
      //             //console.log(controllerId)
      //             try {
      //               if (name.includes("MQX4")) {
      //                 try {
      //                   inputArray.newInput(name, id, controllerId);
      //                 } catch (e) {
      //                   node.warn(e);
      //                 }
      //               }
      //             } catch (e) {
      //               node.warn(e);
      //             }
      //           } catch {
      //             node.warn("failed");
      //           }
      //         }
      //       }

      //       globalContext.set("inputList", inputArray.allInputs);
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //       node.warn(err);
      //     });
      // } catch (err) {
      // } finally {
      // }

      
      try {
        console.log("initialising the inputs");
        var server = String(node.bpintegritiEndpoint);
        var port = String(node.bpintegritiEndpointPort);
        var inputList =
          "/DB/Input?query_size=5000&query_page=1&sort_property=ID&sort_direction=asc";
        var URL = server + ":" + port + inputList;
      
        fetchWithTimeout(URL)
          .then((res) => res.text())
          .then((res) => {
            resJson = parser.toJson(res, options);
            msg.payload = resJson;
            var tempInputs = resJson.Results.Input;
      
            for (var key in tempInputs) {
              if (tempInputs.hasOwnProperty(key)) {
                var name = tempInputs[key].Name;
                var id = tempInputs[key].ID[1];
                var controllerId = tempInputs[key].ControllerID;
      
                if (name.includes("MQX4")) {
                  try {
                    inputArray.newInput(name, id, controllerId);
                  } catch (e) {
                    node.warn(e);
                  }
                }
              }
            }
      
            globalContext.set("inputList", inputArray.allInputs);
          })
          .catch((err) => {
            console.log(err);
            node.warn(err);
          });
      } catch (err) {
        node.warn(err);
      }
      
      //end build controller array
      //build input array

      //end build inputarray

      function sendMsg(msg) {
        node.send(msg);
        //console.log("sending message")
      }
    });

    function getTreeCallback(req, res) {
      res.send(buildVueTree());
      //res.send("hello cam");
    }

    function buildVueTree() {
      var vueStr = [];
      var doorsInController = [];
      var doorStep = [];
      doors = globalContext.get("doorList");
      controllers = globalContext.get("controllerList");

      for (let i = 0; i < controllers.length; i++) {
        cId = controllers[i].id;
        count = 0;
        for (let j = 0; j < doors.length; j++) {
          //console.log(doors[j].controllerID +"  ---  "+ cId)
          if (doors[j].controllerID == cId) {
            //console.log(doors[i].getName())
            doorsInController.push({
              key: i + "-0-" + count,
              label: doors[j].getName(),
              icon: "pi pi-fw pi-stop",
              selected: false,
              children: null,
              selected: doors[j].selected,
            });
            count++;
          }
        }

        doorStep.push({
          key: i + "-0",
          label: "Doors",
          icon: "pi impi-fw pi-table",
          children: doorsInController,
          selected: controllers[i].selected,
        });
        // console.log(doorStep);

        doorStep.push({
          key: i + "-2",
          label: controllers[i].getName(),
          icon: "pi pi-fw pi-stop",
          selected: true,
          children: null,
          selected: true,
        });

        vueStr.push({
          key: i,
          label: controllers[i].getName(),
          icon: "pi impi-fw pi-table",
          children: doorStep,
          selected: controllers[i].selected,
        });
        doorStep = [];
        doorsInController = [];
      }

      // for(let i = 0; i<doors.length; i++){
      //   vueStr.push({"key":i, "label":doors[i].getName(),"icon": "pi-fw pi-sitemap", "children":null});
      // }
      //console.log(vueStr);

      return vueStr;
    }

    function setSelectedCallback(req, res) {
      doors = globalContext.get("doorList");
      //console.log(doors);
      selectedDevices = JSON.parse(req.query.data);

      //console.log(selectedDevices);
      for (let i = 0; i < doors.length; i++) {
        //search for matching door names, if match select = true, if not found select = false;
        let obj = doors[i];
        try {
          if (selectedDevices.find((e) => e === obj.name)) {
            obj.selected = true;
            //console.log("its true")
          } else {
            //console.log("its false")
            try {
              obj.selected = false;
            } catch (e) {
              console.log(e, "there was an issue");
            }
          }
        } catch (e) {
          console.log("null label");
        }
      }

      globalContext.set("doorList", doors);
      //console.log(doors)
    }

    //console.log(typeof req);
    // res.sendStatus(200);
  }

  RED.nodes.registerType("bp-integriti", bpBitpoolIntegriti);
};
