// ==UserScript==
// @name     PE Console CodeMirror
// @version  0.1
// @require  https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/codemirror.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/mode/javascript/javascript.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/addon/fold/foldcode.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/addon/fold/brace-fold.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/addon/fold/foldgutter.min.js
// @resource codemirror.css https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/codemirror.min.css
// @resource foldgutter.css https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/addon/fold/foldgutter.min.css
// @grant    GM.getResourceUrl
// @include  https://*.delivery.puppetlabs.net/*
// @include  https://*.vmpooler-prod.puppet.net/*
// @run-at   document-start
// ==/UserScript==

(function() {
  function initCodeMirrorCSS() {
    let addCss = function(value) {
      let newCss = document.createElement("link");

      newCss.type = "text/css";
      newCss.rel = "stylesheet";
      newCss.href = value;

      document.head.appendChild(newCss);
    }

    GM.getResourceUrl("codemirror.css").then(addCss);
    GM.getResourceUrl("foldgutter.css").then(addCss);
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

  function reactToParameterAdd(node, codeMirror) {
    let button = node.parentElement.parentElement.getElementsByTagName("button")[0];

    button.addEventListener("click", function(){
      // Clearing the CodeMirror will also cause the textarea to be cleared.
      // Schedule for the next animation frame so that this happens after
      // Ember has finished adding the new data.
      window.requestAnimationFrame(function() {
        codeMirror.setValue("");
      });
    });
  }

  function initCodeMirror(node, prettyPrintExisting = false) {
    let codeMirror = CodeMirror.fromTextArea(node, {
      mode: "application/json",
      lineNumbers: true,
      foldGutter: true,
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      readOnly: (node.disabled ? "nocursor" : false)
    });

    if (prettyPrintExisting) {
      codeMirror.setValue(JSON.stringify(JSON.parse(node.value), undefined, 2));
    }

    codeMirrorReplacements.set(node, codeMirror);

    enableDisableObserver.observe(node, {attributeFilter: ["disabled"]});

    // Sync CodeMirror state back to underlying textarea after user
    // input and fire events so that Ember reacts appropriately.
    codeMirror.on("change", function() {
      let inputEvent = new Event("input");
      node.value = codeMirror.getValue();
      node.dispatchEvent(inputEvent);
    });

    return codeMirror;
  }

  function initAddParameter(node) {
    let codeMirror = initCodeMirror(node);

    reactToParameterSelection(node, codeMirror);
    reactToParameterAdd(node,codeMirror);
  }

  function initEditParameter(node) {
    let codeMirror = initCodeMirror(node, true);
  }

  const documentBodyObserver = new MutationObserver(mutations => {
    for (let mutation of mutations) {
      for (let node of mutation.addedNodes) {
        if (!(node instanceof HTMLTextAreaElement)) continue;
        if (codeMirrorReplacements.has(node)) continue;

        if (node.matches('textarea[class*="class-param-add-value"]')) {
          initAddParameter(node);
        } else if (node.matches('td[class*="class-param-value"] textarea')) {
          initEditParameter(node);
        }
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
