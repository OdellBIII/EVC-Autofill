
window.addEventListener('load', renderEmails);

let saveEmailBtn = document.getElementById("save-email-button");
let removeAllEmailsBtn = document.getElementById("remove-all-emails-button");

// When the button is clicked, add email to the list of emails to be displayed
saveEmailBtn.addEventListener('click', async () => {

    const newEmail = document.getElementById("emailForm").value;
    chrome.storage.local.get(['emails'], function(result){
        console.log(result);

        if(result.emails != undefined){

            result.emails.push(newEmail);
            console.log(result.emails);
            chrome.storage.local.set({'emails' : result.emails}, function(){

                renderEmails();
            });
        }else{
            console.log(result.emails);
            chrome.storage.local.set({'emails' : [newEmail]});

        }
    });
});

// When the button is clicked, all email addresses are cleared from local google storage
removeAllEmailsBtn.addEventListener('click', async () =>{

    chrome.storage.local.set({'emails' : []}, function(){

        renderEmails();
    });

});

// Creates buttons for the emails and inserts them into page
function renderEmails(){

    let emailList = document.getElementById("email-list");
    // Clear current children from list
    while(emailList.hasChildNodes()){
        emailList.removeChild(emailList.firstChild);
    }

    console.log("Render function called!");
    // Get emails
    chrome.storage.local.get(['emails'], function(result){

        let emails = result.emails;
        // Iterate over emails
        for(let i = 0; i < emails.length; i++){
            // Create button for each email and make child of an object
            let emailAddress = emails[i];
            let emailListChild = createEmailListChild(emailAddress);
            emailList.appendChild(emailListChild);
        }
    });
}

function createEmailListChild(emailAddress){

    let emailButton = document.createElement("button");
    emailButton.textContent = emailAddress;
    emailButton.name = emailAddress;
    emailButton.addEventListener("click", emailButtonEventListener);

    let liElement = document.createElement("li");
    liElement.appendChild(emailButton);

    return liElement;
}

function emailButtonEventListener(e){

    const emailAddress = e.target.name;
    //const domain = stripUrl(getCurrentTab());
    //const noreplyEmail = 'noreply@' + domain;
    const noreplyEmail = 'magictre1234@gmail.com';

    const requestUrl = 'https://evc-web.herokuapp.com/checkEmail?senderEmail=' + noreplyEmail + '&receiverEmail=' + emailAddress; 
    fetch(requestUrl).then(response => {

        return response.json();
    }).then( verificationCodeObj => {

        console.log(verificationCodeObj);
        changeHolderText(verificationCodeObj.code);
    });

}

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

function changeHolderText(val){

    let evcHolder = document.getElementById("evc-holder");
    evcHolder.innerHTML = val;
}

// Strip url to just the domain
function stripUrl(url){

    let result = url;
    // Trim off 'www.'
    result = result.replace("www.","")
    const endIndex = result.indexOf(".com") + 4;

    return result.slice(8, endIndex);
}