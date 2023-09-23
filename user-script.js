// ==UserScript==
// @name     PE Console CodeMirror
// @version  0.1
// @require  https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/codemirror.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/mode/javascript/javascript.min.js
// @grant    none
// @include  https://*.delivery.puppetlabs.net/*
// @run-at   document-start
// ==/UserScript==

(function() {
  function initCodeMirrorCSS() {
    let cm_css = document.createElement("link");

    cm_css.type = "text/css";
    cm_css.rel = "stylesheet";
    cm_css.href = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/codemirror.min.css";

    document.head.appendChild(cm_css);
  }

  function initTextareaObservers() {
    let observer = new MutationObserver(mutations => {

      for(let mutation of mutations) {
        // examine new nodes, is there anything to highlight?

        for(let node of mutation.addedNodes) {
          // we track only elements, skip other nodes (e.g. text nodes)
          if (!(node instanceof HTMLElement)) continue;

          // check the inserted element for being a code snippet
          if (node.matches('textarea[class*="class-param-add-value"]')) {
            node.value = "hello, world"

            CodeMirror.fromTextArea(node, {
              mode: "application/json",
              lineNumbers: true
            });
          }
        }
      }

    });

    observer.observe(document.body, {childList: true, subtree: true});
  }

  addEventListener("DOMContentLoaded", function(){
    initCodeMirrorCSS();
    initTextareaObservers();
  });
})();
