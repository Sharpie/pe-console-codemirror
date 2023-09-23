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

  const codeMirrorReplacements = new Map();

  const enableDisableObserver = new MutationObserver(mutations => {
    for (let mutation of mutations) {
      let node = mutation.target;
      let codeMirror = codeMirrorReplacements.get(node);

      codeMirror.setOption("readOnly", (node.disabled ? "nocursor" : false));
    }
  });

  function reactToParameterSelection(node, codeMirror) {
    // This one is a bit tricky. MutationObserver does not get events for
    // when the value of input fields is modified by other JavaScript code
    // or user actions.
    //
    // So, we add an event listener on the class parameter selector to
    // update CodeMirror with new defaults if a user selects a parameter.
    let selector = node.parentElement.parentElement.getElementsByTagName("select")[0];
    let updateCodeMirror = function() {
      codeMirror.setValue(node.value);
    }

    selector.addEventListener("change", function(){
      // Do the update on the next animation frame as the actual change
      // to the textinput value usually occurs just after this event
      // fires.
      window.requestAnimationFrame(updateCodeMirror);
    });
  }

  function initCodeMirror(node) {
    if (codeMirrorReplacements.has(node)) return;

    let codeMirror = CodeMirror.fromTextArea(node, {
      mode: "application/json",
      lineNumbers: true,
      readOnly: (node.disabled ? "nocursor" : false)
    });

    codeMirrorReplacements.set(node, codeMirror);
    reactToParameterSelection(node, codeMirror);
    enableDisableObserver.observe(node, {attributeFilter: ["disabled"]});
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
