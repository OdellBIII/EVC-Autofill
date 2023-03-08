
window.addEventListener('load', init);

function copyToClipboard(){

    let emailVerificationCode = document.getElementById("evc-holder").innerText;
    navigator.clipboard.writeText(emailVerificationCode);

}

function createEmailInput(){

    let newElementContainer = document.createElement("div");
    newElementContainer.className = "email-input-container";
    let newEmailContainer = document.createElement("div");
    newEmailContainer.className = "email-list-child-outer";

    let newEmailInput = document.createElement("input");
    newEmailInput.type = "text";
    newEmailInput.className = "new-email-input";
    newEmailInput.addEventListener('change', function(e){

        const newEmailAddress = e.target.value;
        if(newEmailAddress !== ""){

            addEmail(newEmailAddress);
        }else{

            renderEmails();
        }

        saveEmailBtn.disabled = false;
    });

    newEmailContainer.appendChild(newEmailInput);
    newElementContainer.appendChild(newEmailContainer);

    return newElementContainer;
}

function addEmail(emailAddress){

    chrome.storage.local.get(['emails'], function(result){
        console.log(result);

        if(result.emails != undefined){

            result.emails.push(emailAddress);
            console.log(result.emails);
            chrome.storage.local.set({'emails' : result.emails}, function(){

                renderEmails();
            });
        }else{
            console.log(result.emails);
            chrome.storage.local.set({'emails' : [emailAddress]});

        }
    });
}

function removeEmail(emailAddress){

    console.log("Removing " + emailAddress + "from list");
    chrome.storage.local.get(['emails'], function(result){
        console.log(result);

        if(result.emails != undefined){

            let newEmailArray = result.emails.filter(currentEmailAddress => {

                return emailAddress !== currentEmailAddress;
            });

            chrome.storage.local.set({'emails' : newEmailArray}, function(){

                renderEmails();
            });
        }
    });
}

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

    let emailElement = createEmailButton(emailAddress);

    let liElement = document.createElement("li");
    liElement.appendChild(emailElement);

    return liElement;
}

function createEmailButton(emailAddress){

    
    let emailButtonItem = document.createElement("div");
    let emailButton = document.createElement("div");
    emailButton.className = "email-list-child-outer";
    emailButton.addEventListener("click", emailButtonEventListener);
    emailButton.name = emailAddress;

    let emailButtonText = document.createElement("p");
    emailButtonText.className = "email-list-child-text";
    emailButtonText.innerText = emailAddress;

    let deleteEmailButton = createDeleteEmailButton(emailAddress);

    emailButton.appendChild(emailButtonText);

    emailButtonItem.appendChild(emailButton);
    emailButtonItem.appendChild(deleteEmailButton);

    return emailButtonItem;
}

function createDeleteEmailButton(emailAddress){

    let deleteEmailButtonContainer = document.createElement("div");
    deleteEmailButtonContainer.className = "delete-button-container";

    let deleteEmailButton = document.createElement("button");
    //deleteEmailButton.textContent = "x";
    //deleteEmailButton.title = emailAddress;
    deleteEmailButton.addEventListener("click", deleteEmailEventListener);
    deleteEmailButton.className = "delete-button";

    let deleteEmailButtonImage = document.createElement("img");
    deleteEmailButtonImage.src = "images/delete-button.png";
    deleteEmailButtonImage.alt = emailAddress;

    deleteEmailButton.appendChild(deleteEmailButtonImage);
    deleteEmailButtonContainer.appendChild(deleteEmailButton);

    return deleteEmailButtonContainer;
}

function deleteEmailEventListener(e){

    const emailAddress = e.target.alt;

    removeEmail(emailAddress);
}

function emailButtonEventListener(e){

    const emailAddress = e.currentTarget.name;
    const domain = stripUrl(getCurrentTab());
    const noreplyEmail = 'noreply@' + domain;

    const requestUrl = 'https://evc-web.herokuapp.com/checkEmail?senderEmail=' + noreplyEmail + '&receiverEmail=' + emailAddress; 
    fetch(requestUrl).then(response => {

        return response.json();
    }).then( verificationCodeObj => {

        console.log(verificationCodeObj);
        changeHolderText(verificationCodeObj.code);
    });

}

// Remove the tab object for the currently open tab
async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

// Change the holder text to val
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

function init(){

    renderEmails();

    let saveEmailBtn = document.getElementById("save-email-button");

    // When the button is clicked, add email to the list of emails to be displayed
    saveEmailBtn.addEventListener('click', function() {

        let emailList = document.getElementById("email-list");
        let newEmailInput = createEmailInput();
        let newEmailListEle = document.createElement("li");
        newEmailListEle.appendChild(newEmailInput);
        emailList.appendChild(newEmailListEle);
        saveEmailBtn.disabled = true;
    });

    let copyToClipboardIcon = document.getElementById("copy-to-clipboard");

    copyToClipboardIcon.addEventListener('click', copyToClipboard);
}