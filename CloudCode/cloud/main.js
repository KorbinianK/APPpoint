// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
var moment = require('cloud/moment.js');
var moment = require("cloud/moment-timezone-with-data.js");

Parse.Cloud.define("roomList", function (request, response) {
  var query = new Parse.Query("Room");
  query.include("Docent");
  query.find({
    success: function (results) {
      var List = [];
      for (i in results) {
        var item = {};
        var object = results[i];
        var user = object.get('Docent');
        if (user != null) {
          var docentName = user.get("lastName") + " " + user.get("firstName");
          item['docent'] = docentName;
          item['docentObject'] = user;
          item['email'] = user.get("email");
        }
        item['roomName'] = object.get('roomName');
        item['roomBuild'] = object.get('roomBuild');
        item['roomDesc'] = object.get('roomDesc');
        item['status'] = object.get('available');
        List.push(item);

      }
      sortByKey(List, "roomName");
      response.success(List);
    },
    error: function () {
      response.error("query failed");
    }
  });

});

Parse.Cloud.define("singleDocent", function (request, response) {
  var query = new Parse.Query("Docent");

  query.equalTo("email", request.params.email)

  query.include("Room");

  query.first({
    success: function (result) {

      response.success(result.id);

    },
    error: function () {
      response.error("query failed");
    }
  });
});

Parse.Cloud.define("docentList", function (request, response) {
  var query = new Parse.Query("Docent");
  query.include("Room");

  if (request.params.status == "emptyOnly") {
    query.equalTo("Room", null);
  } else if (request.params.status === "user") {
    query.notEqualTo("Room", null);
  } else {

  }
  query.find({
    success: function (results) {
      var List = [];
      var emptyItem = {};
      if (request.params.status = !"user") {
        emptyItem['firstName'] = "Remove ";
        emptyItem['lastName'] = "Docent";
        emptyItem['delete'] = true;

        List.push(emptyItem);
      }
      for (i in results) {
        var docent = {};
        var object = results[i];
        if (request.params.email != null) {
          response.success(object.id);
          break;
        } else {
          docent['firstName'] = object.get('firstName');
          docent['lastName'] = object.get('lastName');
          docent['email'] = object.get('email');
          docent['subject1'] = object.get('subject1');
          docent['subject2'] = object.get('subject2');
          docent['subject3'] = object.get('subject3');
          var Room = object.get("Room");
          if (Room != null) {
            docent['room'] = Room.get('roomName');
          }
          docent['docent'] = object;
          docent['docentObject'] = object;


          List.push(docent);
        }

      }

      sortByKey(List, "lastName");
      response.success(List);
    },
    error: function () {
      response.error("query failed");
    }
  });
});


function sortByKey(array, key) {
  return array.sort(function (a, b) {
    var x = a[key];
    // console.log(x);

    var y = b[key];
    // console.log(y);
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

function objSort() {
  var args = arguments,
    array = args[0],
    case_sensitive, keys_length, key, desc, a, b, i;

  if (typeof arguments[arguments.length - 1] === 'boolean') {
    case_sensitive = arguments[arguments.length - 1];
    keys_length = arguments.length - 1;
  } else {
    case_sensitive = false;
    keys_length = arguments.length;
  }

  return array.sort(function (obj1, obj2) {
    for (i = 1; i < keys_length; i++) {
      key = args[i];
      if (typeof key !== 'string') {
        desc = key[1];
        key = key[0];
        a = obj1[args[i][0]];
        b = obj2[args[i][0]];
      } else {
        desc = false;
        a = obj1[args[i]];
        b = obj2[args[i]];
      }

      if (case_sensitive === false && typeof a === 'string') {
        a = a.toLowerCase();
        b = b.toLowerCase();
      }

      if (!desc) {
        if (a < b) return -1;
        if (a > b) return 1;
      } else {
        if (a > b) return -1;
        if (a < b) return 1;
      }
    }
    return 0;
  });

}

Parse.Cloud.define("setDocentToRoom", function (request, response) {
  var query = new Parse.Query("Docent");
  query.include("Room");
  query.equalTo("email", request.params.email);
  query.first({
    success: function (user) {
      var room = new Parse.Query("Room");
      var foundRoom;
      room.equalTo("roomName", request.params.roomName);
      room.first({
        success: function (room) {
          foundRoom = room;
          room.set("available", false);
          room.set("Docent", user);
          room.save(null, {
            success: function (object) {
              var user = object.get("Docent");
              user.set("Room", object);
              user.save(null, {
                success: function (result) {
                  response.success(result);
                },
                error: function (error) {
                  alert("Error: " + error.code + " " + error.message);
                }
              });
            },
            error: function (error) {}
          });
        },
        error: function (error) {}
      });
    },
    error: function (error) {}
  });

});

Parse.Cloud.define("remFromRoom", function (request, response) {
  var room = new Parse.Query("Room");
  room.equalTo("roomName", request.params.roomName);
  room.first({
    success: function (foundRoom) {
      foundRoom.set("available", true);
      foundRoom.set("Docent", null);
      foundRoom.save(null, {
        success: function (result) {
          var query = new Parse.Query("Docent");
          query.equalTo("email", request.params.email);
          query.first({
            success: function (docent) {
              docent.set("Room", null);
              docent.save(null, {
                success: function (result) {
                  response.success(result);
                },
                error: function (error) {
                  alert("Error: " + error.code + " " + error.message);
                }
              });
            },
            error: function (error) {
              alert("Error: " + error.code + " " + error.message);
            }
          });
        },
        error: function (error) {
          alert("Error: " + error.code + " " + error.message);
        }
      });
    },
    error: function (error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });

});


Parse.Cloud.define("dateList", function (request, response) {
  var query = new Parse.Query("Slots");
  var Docent = Parse.Object.extend("Docent");
  var docent = new Docent();
  docent.id = request.params.docent;
  query.include("Docent");
  query.equalTo("Docent", docent);
  query.find({
    success: function (results) {
      response.success(results);
    },
    error: function () {
      response.error("query failed");
    }
  });
});


Parse.Cloud.define("createAppointment", function (request, response) {
  Parse.Cloud.useMasterKey();
  var userEmail = request.params.userEmail;
  var docentId = request.params.docentId;
  var slotStartTime = request.params.slotStartTime;
  var slotDate = request.params.slotDate;
  var docentQuery = new Parse.Query(Parse.User);
  var user = Parse.User.current();
  docentQuery.include("Docent");
  docentQuery.equalTo("Docent", {
    __type: "Pointer",
    className: "Docent",
    objectId: docentId
  });
  docentQuery.first({
    success: function (docent) {

      var slotQuery = new Parse.Query("Slots");
      var foundDocent = docent;
      var docentPointer = docent.get("Docent");
      var id = docentPointer.id;
      slotQuery.include("Docent");
      slotQuery.equalTo("Docent", {
        __type: "Pointer",
        className: "Docent",
        objectId: id
      });
      slotQuery.find({
        success: function (slots) {

          var date;
          var count;
          var resultSlots = slots;

          for (i in resultSlots) {
            var slot = resultSlots[i];
            var date = slot.get("date");
            var getSlots = slot.get("Slots");
            var comp1 = JSON.stringify(date)
              .substring(0, 90);
            var comp2 = JSON.stringify(slotDate)
              .substring(0, 90);
            if (comp1 === comp2) {

              var arr = getSlots;
              for (j in arr) {
                if (arr[j].startTime === slotStartTime) {
                  var app = arr[j];

                  break;
                }

              }

              if (app != undefined || app != null) {

                app.availability = false;

                slot.save(null, {
                  success: function (result) {

                    var Appointment = Parse.Object.extend("Appointment");
                    var appointment = new Appointment();
                    appointment.set("date", slotDate);
                    appointment.set("startTime", app.startTime);
                    appointment.set("endTime", app.endTime);
                    appointment.set("user", user);
                    appointment.set("Docent", foundDocent);
                    appointment.save(null, {
                      success: function (result) {
                        response.success(result);
                      },
                      error: function (error) {
                        response.error("save appointment failed");
                      }

                    });

                  },
                  error: function (error) {
                    alert("Error: " + error.code + ", " + error.message);
                  }
                });
              }

            }
          }
          console.log(JSON.stringify(date));
          console.log(JSON.stringify(slotDate));
          // response.error("save appointment failed");
        },
        error: function () {
          response.error("slots query failed");
        }

      });
    },
    error: function () {
      response.error("docent query failed");
    }
  });

});

Parse.Cloud.define("appointmentList", function (request, response) {
  var moment = require('cloud/moment.js');
  var moment = require("cloud/moment-timezone-with-data.js");
  var query = new Parse.Query("Appointment");
  query.include("Docent");
  query.include("Docent.Docent");
  query.include("user");
  query.equalTo("user", {
    __type: "Pointer",
    className: "_User",
    objectId: request.params.id
  });
  query.find({
    success: function (results) {
      var List = [];
      for (i in results) {
        var item = {};
        var object = results[i];
        var date = object.get('date');
        var docent = object.get('Docent');
        item["date"] = date;
        item['startTime'] = object.get('startTime');
        item['endTime'] = object.get('endTime');
        item['docent'] = docent;
        item['docentId'] = docent.get("Docent")
          .id;
        item['docentName'] = docent.get('lastName') + " " + docent.get('firstName');
        List.push(item);

      }
      objSort(List, 'd', 'endTime');
      response.success(List);

    },
    error: function () {
      console.log("d");
      response.error("query failed");
    }
  });
});

Parse.Cloud.define("appointmentListDocent", function (request, response) {
  var moment = require('cloud/moment.js');
  var moment = require("cloud/moment-timezone-with-data.js");
  var query = new Parse.Query("Appointment");

  query.include("docent");
  query.include("user");
  query.equalTo("docent", {
    __type: "Pointer",
    className: "_User",
    objectId: request.params.id
  });
  query.find({
    success: function (results) {
      var List = [];
      for (i in results) {
        var item = {};
        var object = results[i];
        var date = object.get('date');
        console.log(date);
        var user = object.get('user');
        item["date"] = date;
        item['startTime'] = object.get('startTime');
        item['endTime'] = object.get('endTime');
        item['user'] = user;
        item['userName'] = user.get('lastName') + " " + user.get('firstName');
        List.push(item);
      }

      objSort(List, 'date', 'endTime');
      response.success(List);
    },
    error: function () {
      console.log("d");
      response.error("query failed");
    }
  });
});


Parse.Cloud.define("removeDocentSlots", function (request, response) {
  Parse.Cloud.useMasterKey();
  var docent = request.params.docent;

  var slotsQuery = new Parse.Query("Slots");
  slotsQuery.include("Docent");
  slotsQuery.equalTo("Docent", {
    __type: "Pointer",
    className: "Docent",
    objectId: request.params.docent
  });
  slotsQuery.find({
    success: function (results) {
      if (results.length != 0) {
        for (i in results) {
          results[i].destroy(); //destroys the rows with Docent in "slots"
        }
      }
      response.success("Slots deleted");
    },
    error: function (error) {}
  });
});

Parse.Cloud.define("removeDocentRoom", function (request, response) {
  Parse.Cloud.useMasterKey();
  var docent = request.params.docent;

  var roomQuery = new Parse.Query("Room");
  roomQuery.include("Docent");
  roomQuery.equalTo("Docent", {
    __type: "Pointer",
    className: "Docent",
    objectId: request.params.docent
  });
  roomQuery.first({
    success: function (object) {
      if (object != null) {
        object.set("Docent", null);
        object.save();
      }
      response.success("Room deleted");
    },
    error: function (error) {}
  });
});

Parse.Cloud.define("removeDocentDocent", function (request, response) {
  Parse.Cloud.useMasterKey();
  var docent = request.params.docent;
  var docentQuery = new Parse.Query("Docent");

  docentQuery.equalTo("objectId", docent);
  docentQuery.first({
    success: function (object) {

      object.destroy();

      response.success("Docent deleted");
    },
    error: function (error) {
      response.error("Docent error");
    }
  });
});


Parse.Cloud.define("removeDocentUser", function (request, response) {
  Parse.Cloud.useMasterKey();
  var docent = request.params.docent;
  var userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo("username", docent);

  userQuery.first({
    success: function (object) {
      if (object != null) {
        object.destroy();
      }
      response.success("Docent deleted");
    },
    error: function (error) {}
  });
});

Parse.Cloud.define("removeDocentAppointments", function (request, response) {
  Parse.Cloud.useMasterKey();
  var appointmentQuery = new Parse.Query("Appointment");
  var docent = request.params.docent;
  appointmentQuery.include("docent");
  appointmentQuery.equalTo("docent", docent);
  appointmentQuery.find({
    success: function (results) {

      if (results.length = !0) {
        for (i in results) {

          results[i].destroy(); //destroys the rows with Docent in "Appointment"
        }
        response.success("Appointments deleted");
      }
    },
    error: function (error) {}
  });
});

Parse.Cloud.define("delUserAppointments", function (request, response) {
  Parse.Cloud.useMasterKey();
  var appointmentQuery = new Parse.Query("Appointment");
  var startTime = request.params.startTime;
  var slotDate = request.params.date;

  appointmentQuery.include("user");
  appointmentQuery.include("Docent");
  appointmentQuery.equalTo("user", {
    __type: "Pointer",
    className: "_User",
    objectId: request.params.id
  });
  appointmentQuery.equalTo("Docent", {
    __type: "Pointer",
    className: "_User",
    objectId: request.params.docentUserId
  });
  appointmentQuery.find({
    success: function (appointments) {
      for (i in appointments) {
        if (appointments[i].get("startTime") === startTime) {

          appointments[i].destroy();
          break;
        }
      }
      // response.success(appointments);
    },
    error: function (error) {

    }
  });
  var slotQuery = new Parse.Query("Slots");
  slotQuery.include("Docent");
  slotQuery.equalTo("Docent", {
    __type: "Pointer",
    className: "Docent",
    objectId: request.params.docentId
  });
  slotQuery.find({
    success: function (slots) {
      // response.success(request.params.docentId);
      for (i in slots) {
        var slot = slots[i];
        var date = slot.get("date");
        var getSlots = slot.get("Slots");
        var comp1 = JSON.stringify(date)
          .substring(0, 90);
        var comp2 = JSON.stringify(slotDate)
          .substring(0, 90);
        if (comp1 === comp2) {
          var arr = getSlots;
          for (j in arr) {
            if (arr[j].startTime === startTime) {
              var app = arr[j];
              break;
            }
          }
          if (app != undefined || app != null) {
            app.availability = true;
            slot.save(null, {
              success: function (result) {
                response.success("success");
              },
              error: function (error) {
                alert("Error: " + error.code + ", " + error.message);
              }
            });
          }
        }
      }

    },
    error: function (error) {

    }
  });

});
