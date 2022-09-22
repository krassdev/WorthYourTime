// Modified from https://github.com/mdn/webextensions-examples/tree/82217a05bc09650c1a234a6ad5b18709c2e13526/emoji-substitution

// Thanks to: https://stackoverflow.com/questions/1547574/regex-for-prices
const priceRegex = /(USD|EUR|€|\$)\s?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2}))|(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)\s?(USD|EUR|€|\$)/gm;
const priceOnlyRegex = /\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})/gm;

function replaceText (node) {
  // For all text nodes
  if (node.nodeType === Node.TEXT_NODE) {
    if (node.parentNode && node.parentNode.nodeName === 'TEXTAREA') {
      return;
    }

    // Replace every substring matching the priceRegex, with 
    let content = node.textContent;
    const match = content.match(priceOnlyRegex);
    const converted = parseFloat(match) / 10;
    const hours = Math.floor(converted);
    const minutes = Math.round((converted - hours)*60);

    content = content.replaceAll(priceRegex, hours+" hours and "+minutes+" minutes");

    node.textContent = content;
  }
  else {
    for (let i = 0; i < node.childNodes.length; i++) {
      replaceText(node.childNodes[i]);
    }    
  }
}

replaceText(document.body);

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        const newNode = mutation.addedNodes[i];
        replaceText(newNode);
      }
    }
  });
});
observer.observe(document.body, {
  childList: true,
  subtree: true
});