
let searchBtn = document.getElementById("evc-button");
let emailForm = document.getElementById("emailForm");
let evcHolder = document.getElementById("evc-holder");

// When the button is clicked, ask the API to search email for emails that match the website domain
searchBtn.addEventListener('click', async () => {

    chrome.tabs.getCurrent(currentTab => {

        const domainName = stripUrl(currentTab.url);
        const verificationCodeEmail = 'noreply@' + domainName;
        const email = emailForm.value;
        // Construct an API request to Gmail API for messages with the same domain name in the past minute
        chrome.identity.getAuthToken( {'interactive' : true}, (token) => {

            changeHolderText(token);
        });
    });

});

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

function changeHolderText(val){

    evcHolder.innerHTML = val;
}

// Strip url to just the domain
function stripUrl(url){

    var result = url
    // Trim off 'www.'
    result = result.replace("www.","")
    const endIndex = result.indexOf(".com") + 4;

    return result.slice(8, endIndex);
}
/*
function start() {
  // 2. Initialize the JavaScript client library.
  gapi.client.init({
    'apiKey': 'AIzaSyBhyGyVaiDraTihyNOtL-tfyF0DPIMnzaA',
    // Your API key will be automatically added to the Discovery Document URLs.
    'discoveryDocs': ['https://gmail.googleapis.com/$discovery/rest?version=v1'],
    // clientId and scope are optional if auth is not required.
    'clientId': '122228461155-8rjqlq3168l5jpim8ls87cng9hesvsv9.apps.googleusercontent.com',
    'scope': 'profile',
  }).then(function() {
    // 3. Initialize and make the API request.
    return gapi.client.gmail.users.messages.list({
      'userId': 'me',
      'q': "from: "
    });
  }).then(function(response) {
    console.log(response.result);
  }, function(reason) {
    console.log('Error: ' + reason.result.error.message);
  });
};
*/