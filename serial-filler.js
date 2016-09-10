chrome.contextMenus.create({
  title: "Hello",
  type : "normal",
  contexts : ["editable"],
  onclick: function(info, tab) { 
    send(tab, "remek2")
  }
});

function send(tab, generatedValue) {
  chrome.tabs.sendMessage(tab.id, { generatedValue });
}