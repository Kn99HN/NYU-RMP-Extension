/*
Take the message and add all the instructor names to it.
*/
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var listInstructor = [];
    var links = [];
    if( request.message === "clicked_browser_action" ) {
      //let values = document.
      //Using a really gross over-estimation of the number of available id to be 300
      for(var i = 0; i < 300; i++) {
        var id = 'win0divNYU_CLS_DERIVED_HTMLAREA3$' + i
        var values = document.getElementById(id);
        //if the values is null skip to the next iteration
        if(values == null) {
          continue;
        }
        var name = values.getElementsByTagName('td');
        //iterate through the name html collection.
        for(var j = 0; j < name.length; j++) {
          var field = name[j].innerText;
          //Split at Notes for section where there is a Note section
          var fields = field.split('Notes');
          var class_name = field.split('4 units');
          var final_class = class_name[0].split("|")[0];
          //Handle case with Special Topic class
          if(final_class.includes('Topic:')) {
            final_class = final_class.split("Topic:")[1].trim();
            final_class = final_class.split("\n")[0].trim();
          }
          console.log(final_class);
          if(fields[0].includes('with')) {
            var instructor = fields[0].split('with')[1];
            //Handle case where there are two professors for one class
            if(instructor.includes(';')) {
              var professor1 = handleColon(instructor);
              //check if the professor is already there
              if(listInstructor.includes(professor1)) {
                continue;
              }
              //listInstructor.push(professor1);
            } else {
              var professor = handleComma(instructor);
              professor = professor.trim();
              if(listInstructor.includes(professor)) {
                continue;
              }
              listInstructor.push({"Professor": professor, "Class": final_class});
            }
          }
        }
      }
      // Send back the value with the message
      chrome.runtime.sendMessage({"message": "open_new_tab", "url": listInstructor});
    }
  }
);




//handle the case with colons, having two professor in one class
function handleColon(instructor) {
  instructor = instructor.replace(',', '');
  instructor = instructor.split(';');
  return instructor[0];
}

//Handle the case with comma
function handleComma(instructor) {
  var instructors = instructor.split(',');
  var professor = instructors[0] + instructors[1];
  if(professor.includes('Visit the Bookstore')) {
    professor = professor.replace('Visit the Bookstore','')
  }
  return professor;
}

/*ARCHIVED for Future Usage
function add_link(link, prof_name) {
  for(var i = 0; i < 300; i++) {
    var id = 'win0divNYU_CLS_DERIVED_HTMLAREA3$' + i
    var values = document.getElementById(id);
    //if the values is null skip to the next iteration
    if(values == null) {
      continue;
    }
    var name = values.getElementsByTagName('td');
    //iterate through the name html collection.
    for(var j = 0; j < name.length; j++) {
      var field = name[j].innerText;
      //Split at Notes for section where there is a Note section
      var fields = field.split('Notes')
      if(fields[0].includes('with')) {
        var instructor = fields[0].split('with')[1];
        //Handle case where there are two professors for one class
        if(instructor.includes(';')) {
          var professor1 = handleColon(instructor);
          //check if the professor is already there
          if(professor1 === prof_name) {
            var professor = document.createElement('a');
            professor.setAttribute('href',link);
            professor.setAttribute('target',"_blank");
            professor.innerHTML = prof_name;
            if(name[j].contains(id) === false) {
              name[j].appendChild(link_prof)
            }
          }
        } else {
          var professor = handleComma(instructor);
          if(professor.trim() === prof_name.trim()) {
            var link_prof = document.createElement('a');
            link_prof.setAttribute('href',link);
            link_prof.setAttribute('id', prof_name)
            link_prof.setAttribute('target',"_blank");
            link_prof.innerHTML = prof_name;
            var id = document.getElementById(prof_name);
            console.log('Iteration ' + link + ' professor: ' + prof_name);
            if(name[j].contains(id) === false) {
              name[j].appendChild(link_prof)
            }
          }
        }
      }
    }
  }
}

else if(request.message = "send_link") {
  //add the link to the location with matching professor name
  chrome.storage.local.get('List', function(result){
    var testResult = result;
    var profName = testResult['List'];
    if(profName != null) {
      for(var i = 0; i < profName.length; i++) {
        var prof_name = profName[i]['Prof_name'].replace('\n','');
        var link = profName[i]['link'].replace('\n','');
        add_link(link, prof_name);
      }
    }
  });
}*/
