chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    alert('got' + request.generatedValue);
});
