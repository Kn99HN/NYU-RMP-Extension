// Called when the user clicks on the browser action and make a popup
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.browserAction.setPopup({popup: 'popup.html'});
});

/*
Listening for button clicked
*/
document.addEventListener('DOMContentLoaded', function () {
    var value = document.getElementById('btn');
    if(value != null) {
        value.addEventListener('click', myAlert);
    }
});

/*
Send message to content scripts
*/
function myAlert() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
}

/*
Send the link to the content scripts
*/
function sendLink() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message":"send_link"});
  });
}

//Retrieve value from content scripts and attach the links to the GUI
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "open_new_tab" ) {
      var list = request.url;
      createPane();
      //Iterate through the list of instructor and get links for each
      for(var i = 0; i < list.length; i++) {
        var className = list[i]["Class"];
        searchProf(list[i]["Professor"], list[i]["Class"], function(name, className, link) { //missing the link
           var professor = document.createElement('a');
           professor.setAttribute('href',link);
           professor.setAttribute('target',"_blank");
           professor.innerHTML = name + ': ' + className;
           var container = document.getElementById('Professor');
           if(container != null) {
             container.appendChild(professor);
           }
        });
      }
    }
    hideButton();
    footer();
  }
);
//Set up the author tag
function footer() {
  var author = document.getElementById('author');
  var title = document.createElement('div');
  var links = document.createElement('a');
  links.setAttribute('href','https://www.linkedin.com/in/khanh-nguyen-4b1393b0/');
  links.setAttribute('target','_blank');
  links.setAttribute('style','color: white')
  links.innerHTML = 'Khanh Nguyen'
  title.setAttribute('style','background-color:#800080; color: white');
  title.innerHTML = "Made By "
  if(author != null) {
    title.appendChild(links);
    author.appendChild(title);
  }
}
//Set up the pane after button is clicked
function createPane() {
  var container = document.getElementById('container');
  var title = document.createElement('h3');
  var hr = document.createElement('hr');
  title.innerHTML = "Available Professor";
  if(container != null) {
    container.appendChild(title);
    container.appendChild(hr);
  }
}
//Hide the button after clicked
function hideButton() {
  var value = document.getElementById('btn');
  if(value != null) {
    value.style.visibility = 'hidden';
    value.parentNode.removeChild(value);
  }
}
/*
Search Professor Name using XMLHttpRequest and check if their query has New York University name in it.
If so, append a link.
*/
function searchProf(name, class_name, callback) {
  if(name != undefined) {
      var names = name.toString().split(" ");
      var firstName = names[0];
      var lastName = names[1];
      var req = new XMLHttpRequest();
      var param = '';
      for(var i =  0; i < names.length - 1; i++) {
        param += names[i] + '+';
      }
      param += names[names.length - 1];
      //Make a XMLHttpRequest to the server using all the available name
      req.open("GET", 'https://www.ratemyprofessors.com/search.jsp?query=' + param, true);
      req.onreadystatechange = function() {
            if (req.readyState == 4) {
              if(req.status == 200) {
                var text = req.responseText;
                if(text.includes('New York University') === true || text.includes('NYU')) {
                  var dummy = document.createElement('html');
                  dummy.innerHTML = text;
                  professors = dummy.getElementsByClassName('listing PROFESSOR');
                  //Iterate through all the professors with same name to find those at NYU
                  for(var i = 0; i < professors.length; i++) {
                    var school = professors[i].getElementsByClassName('sub');
                    if(school[0].textContent.includes('New York University')
                    || school[0].textContent.includes('NYU')) {
                      link = 'https://www.ratemyprofessors.com' + professors[i].innerHTML.match(/href="([^"]*)/)[1];
                    }
                  }
                  callback(name, class_name, link);
                }
              }
            }
        };
        req.send();
  }
}
