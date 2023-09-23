// ==UserScript==
// @name     PE Console CodeMirror
// @version  0.1
// @require  https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/codemirror.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/mode/javascript/javascript.min.js
// @resource codemirror.css https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/codemirror.min.css
// @grant    GM.getResourceUrl
// @include  https://*.delivery.puppetlabs.net/*
// @run-at   document-start
// ==/UserScript==

(function() {
  function initCodeMirrorCSS() {
    GM.getResourceUrl("codemirror.css").then(value => {
      let cm_css = document.createElement("link");

      cm_css.type = "text/css";
      cm_css.rel = "stylesheet";
      cm_css.href = value;

      document.head.appendChild(cm_css);
    });
  }

  const codeMirrorReplacements = new Set();

  function initCodeMirror(node) {
    if (codeMirrorReplacements.has(node)) return;

    CodeMirror.fromTextArea(node, {
      mode: "application/json",
      lineNumbers: true,
      readOnly: (node.disabled ? "nocursor" : false)
    });

    codeMirrorReplacements.add(node);
  }

  const documentBodyObserver = new MutationObserver(mutations => {
    for (let mutation of mutations) {
      for (let node of mutation.addedNodes) {
        if (!(node instanceof HTMLTextAreaElement)) continue;
        if (node.matches('textarea[class*="class-param-add-value"]')) initCodeMirror(node);
      }
    }
  });

  function watchDocumentBody() {
    documentBodyObserver.observe(document.body, {childList: true, subtree: true});
  }

  addEventListener("DOMContentLoaded", function(){
    initCodeMirrorCSS();
    watchDocumentBody();
  });
})();
