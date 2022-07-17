

// Strip url to just the domain
function stripUrl(url){

    var result = url
    // Trim off 'www.'
    result = result.replace("www.","")
    const endIndex = result.indexOf(".com") + 4;

    return result.slice(8, endIndex);
}

function constructVerificationEmail(domainName){

    const verificationCodeEmail = 'noreply@' + domainName;

    return verificationCodeEmail;
}