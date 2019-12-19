// i18n module should return strings in format:
// `TANKERBEGIN${translation}:${keyset}:${key}TANKEREND`
const regexp = /TANKERBEGIN(.*?)TANKEREND/g;
const CLASSNAME_HOVERED = 'tanker-devtools-hovered';

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    // when link is hovered in devtools panel
    if (message.type === 'tanker-devtools-select-item') {
        document.querySelectorAll('.' + CLASSNAME_HOVERED).forEach(item =>
            item.classList.remove(CLASSNAME_HOVERED)
        );

        const matchedElements = document.querySelectorAll('.' + message.data);

        matchedElements.forEach(item =>
            item.classList.add(CLASSNAME_HOVERED)
        );

        matchedElements[0].scrollIntoView();
    }
});

function getTextNodesIn(node) {
    const textNodes = [];

    function getTextNodes(node) {
        if (node.nodeType === 3) {
            textNodes.push(node);

            return;
        }

        for (let i = 0, len = node.childNodes.length; i < len; ++i) {
            getTextNodes(node.childNodes[i]);
        }
    }

    getTextNodes(node);

    return textNodes;
}

const textNodes = getTextNodesIn(document.body);
const data = [];

// inject styles to highligth strings selected in devtools panel
const styleElem = document.createElement('style');
styleElem.innerHTML = `
    .${CLASSNAME_HOVERED} {
        outline: 3px dotted red;
    }
`;
document.head.appendChild(styleElem);

// keep only letters
function dropExtraSymbols(str) {
    return str
        .split('')
        .filter(char => char.toLowerCase() !== char.toUpperCase())
        .join('');
}

textNodes.forEach(node => {
    node.nodeValue = node.nodeValue.replace(regexp, function(_, str) {
        const [translation, keyset, key] = str.split(':');
        const className = 'tanker-' + dropExtraSymbols(keyset) + '-' + dropExtraSymbols(key);

        data.push({
            keyset,
            key,
            translation,
            className
        });

        node.parentNode.classList.add(className);

        return translation;
    });
});

chrome.extension.sendMessage({ type: 'tanker-devtools-items', data });
