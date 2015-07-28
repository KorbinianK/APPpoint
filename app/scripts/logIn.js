var currentUser = Parse.User.current();
        if (currentUser) {
            (function(){
             if(currentUser.get("isAdmin")){
                 document.location.href = "/admin.html";

             }
                if(currentUser.get("isTeacher")){
                  document.location.href = "/dozent.html#!/dozent.html";
              }
              else{
                  $(".teacherRole").hide();
              }
              })();
          } else {

              $(".teacherRole").hide();
            }
