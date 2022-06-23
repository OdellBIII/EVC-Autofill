
chrome.runtime.onInstalled.addListener(() => {

    chrome.action.onClicked.addListener((currentTab) => {

        const domainName = stripUrl(currentTab.url);
        const verificationCodeEmail = 'noreply@' + domainName;

        console.log("Hello world!");
        chrome.identity.getAuthToken( {'interactive' : true}, (token) => {
            console.log("Inside of callback");
            console.log(token);
        });
    });

});

// Strip url to just the domain
function stripUrl(url){

    var result = url
    // Trim off 'www.'
    result = result.replace("www.","")
    const endIndex = result.indexOf(".com") + 4;

    return result.slice(8, endIndex);
}