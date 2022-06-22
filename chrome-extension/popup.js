
let searchBtn = document.getElementById("evc-button");

console.log("Hello world!");
// When the button is clicked, ask the API to search email for emails that match the website domain

searchBtn.addEventListener('click', async () => {

    getCurrentTab().then(currentTab => {

        const domainName = stripUrl(currentTab.url);
        // Construct an API request to Gmail API for messages with the same domain name in the past minute
        changeHolderText(domainName);
    });

});

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

    var result = url
    // Trim off 'www.'
    result = result.replace("www.","")
    const endIndex = result.indexOf(".com") + 4;

    return result.slice(8, endIndex);
}