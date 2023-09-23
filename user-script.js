// ==UserScript==
// @name     PE Console CodeMirror
// @version  0.1
// @require  https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/codemirror.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/mode/javascript/javascript.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/addon/fold/foldcode.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/addon/fold/brace-fold.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/addon/fold/foldgutter.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/addon/lint/lint.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/addon/lint/json-lint.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/jsonlint/1.6.0/jsonlint.min.js
// @resource codemirror.css https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/codemirror.min.css
// @resource foldgutter.css https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/addon/fold/foldgutter.min.css
// @resource lint.css https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/addon/lint/lint.min.css
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
    // This is lint.css, but the way GM.getResourceUrl works
    // runs afoul of the Content-Security-Policy set by PE.
    addCss("data:text/css;base64,LkNvZGVNaXJyb3ItbGludC1tYXJrZXJze3dpZHRoOjE2cHh9LkNvZGVNaXJyb3ItbGludC10b29sdGlwe2JhY2tncm91bmQtY29sb3I6I2ZmZDtib3JkZXI6MXB4IHNvbGlkICMwMDA7Ym9yZGVyLXJhZGl1czo0cHggNHB4IDRweCA0cHg7Y29sb3I6IzAwMDtmb250LWZhbWlseTptb25vc3BhY2U7Zm9udC1zaXplOjEwcHQ7b3ZlcmZsb3c6aGlkZGVuO3BhZGRpbmc6MnB4IDVweDtwb3NpdGlvbjpmaXhlZDt3aGl0ZS1zcGFjZTpwcmU7d2hpdGUtc3BhY2U6cHJlLXdyYXA7ei1pbmRleDoxMDA7bWF4LXdpZHRoOjYwMHB4O29wYWNpdHk6MDt0cmFuc2l0aW9uOm9wYWNpdHkgLjRzOy1tb3otdHJhbnNpdGlvbjpvcGFjaXR5IC40czstd2Via2l0LXRyYW5zaXRpb246b3BhY2l0eSAuNHM7LW8tdHJhbnNpdGlvbjpvcGFjaXR5IC40czstbXMtdHJhbnNpdGlvbjpvcGFjaXR5IC40c30uQ29kZU1pcnJvci1saW50LW1hcmt7YmFja2dyb3VuZC1wb3NpdGlvbjpsZWZ0IGJvdHRvbTtiYWNrZ3JvdW5kLXJlcGVhdDpyZXBlYXQteH0uQ29kZU1pcnJvci1saW50LW1hcmstd2FybmluZ3tiYWNrZ3JvdW5kLWltYWdlOnVybChkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUFRQUFBQURDQVlBQUFDMDlLN0dBQUFBQVhOU1IwSUFyczRjNlFBQUFBWmlTMGRFQVA4QS93RC9vTDJua3dBQUFBbHdTRmx6QUFBTEV3QUFDeE1CQUpxY0dBQUFBQWQwU1UxRkI5c0pGaFFYRWJoVGc3WUFBQUFaZEVWWWRFTnZiVzFsYm5RQVEzSmxZWFJsWkNCM2FYUm9JRWRKVFZCWGdRNFhBQUFBTWtsRVFWUUkxMk5rZ0lJdkozUVhNakF3ZEROK09hRWJ5c0RBNE1QQXdORE53TUN3aU9ITENkMXpYMDdvNmtCVkdRRUFLQkFOdG9ic2tOTUFBQUFBU1VWT1JLNUNZSUk9KX0uQ29kZU1pcnJvci1saW50LW1hcmstZXJyb3J7YmFja2dyb3VuZC1pbWFnZTp1cmwoZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFBUUFBQUFEQ0FZQUFBQzA5SzdHQUFBQUFYTlNSMElBcnM0YzZRQUFBQVppUzBkRUFQOEEvd0Qvb0wybmt3QUFBQWx3U0ZsekFBQUxFd0FBQ3hNQkFKcWNHQUFBQUFkMFNVMUZCOXNKRHc0Y09DVzEvS0lBQUFBWmRFVllkRU52YlcxbGJuUUFRM0psWVhSbFpDQjNhWFJvSUVkSlRWQlhnUTRYQUFBQUhFbEVRVlFJMTJOZ2dJTC9EQXovR2RBNS94a1kvcVBLTURBd0FBRExad2Y1cnZtK0xRQUFBQUJKUlU1RXJrSmdnZz09KX0uQ29kZU1pcnJvci1saW50LW1hcmtlcntiYWNrZ3JvdW5kLXBvc2l0aW9uOmNlbnRlciBjZW50ZXI7YmFja2dyb3VuZC1yZXBlYXQ6bm8tcmVwZWF0O2N1cnNvcjpwb2ludGVyO2Rpc3BsYXk6aW5saW5lLWJsb2NrO2hlaWdodDoxNnB4O3dpZHRoOjE2cHg7dmVydGljYWwtYWxpZ246bWlkZGxlO3Bvc2l0aW9uOnJlbGF0aXZlfS5Db2RlTWlycm9yLWxpbnQtbWVzc2FnZXtwYWRkaW5nLWxlZnQ6MThweDtiYWNrZ3JvdW5kLXBvc2l0aW9uOnRvcCBsZWZ0O2JhY2tncm91bmQtcmVwZWF0Om5vLXJlcGVhdH0uQ29kZU1pcnJvci1saW50LW1hcmtlci13YXJuaW5nLC5Db2RlTWlycm9yLWxpbnQtbWVzc2FnZS13YXJuaW5ne2JhY2tncm91bmQtaW1hZ2U6dXJsKGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBTUFBQUFvTFE5VEFBQUFObEJNVkVYL3V3RHZyd0QvdXdEL3V3RC91d0QvdXdEL3V3RC91d0QvdXdENnR3RC91d0FBQUFEdXJ3RDJ0UUQ3dUFEK3VnQUFBQUQvdXdEaG1lVFJBQUFBREhSU1RsTUo4bU4xRVljYm1paXhnQUNtN1didUFBQUFWa2xFUVZSNDJuM1BVUXFBSUJCRlVVMUxMYzN1L2pkYk9Kb1cxUDA4REE5R2JhOCtZV0o2Z05Kb05ZSUJ6QUEyY2hCdGg1a0xtRzlZVW9HME5IQVV3Rlh3TzlMdUJRTDFnaUNRYjhnQzlPcm8ydnA1cm5jQ0lZOEw4dUV4NVprQUFBQUFTVVZPUks1Q1lJST0pfS5Db2RlTWlycm9yLWxpbnQtbWFya2VyLWVycm9yLC5Db2RlTWlycm9yLWxpbnQtbWVzc2FnZS1lcnJvcntiYWNrZ3JvdW5kLWltYWdlOnVybChkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQU1BQUFBb0xROVRBQUFBSGxCTVZFVzdBQUM3QUFDeEFBQzdBQUM3QUFBQUFBQzRBQUM1QUFELy8vKzdBQUFVZGNscEFBQUFCblJTVGxNWG5PUlNpd0NLMFpLU0FBQUFUVWxFUVZSNDJtV1BPUTdBUUFnRHVRTHgvejhjc1lSbVBSSUZJd1JHbm9zUnJwYW12a0tpMEZUSWlNQVNSM2hoS1craEFONi90SVdodTlQRFdpVEdORWtUdElPdWNBNU95cjlja1BnQVdtMEdQQm9nNnY0QUFBQUFTVVZPUks1Q1lJST0pfS5Db2RlTWlycm9yLWxpbnQtbWFya2VyLW11bHRpcGxle2JhY2tncm91bmQtaW1hZ2U6dXJsKGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQWNBQUFBSENBTUFBQUR6aktmaEFBQUFDVkJNVkVVQUFBQUFBQUMvdjc5MTRreUhBQUFBQVhSU1RsTUFRT2JZWmdBQUFDTkpSRUZVZU5vMWlvRUpBQUFJd216L0g5MGlGRlNHSmdGTWUzZ2FMWjBvZCs5L0FRWjBBRG9zYllyYUFBQUFBRWxGVGtTdVFtQ0MpO2JhY2tncm91bmQtcmVwZWF0Om5vLXJlcGVhdDtiYWNrZ3JvdW5kLXBvc2l0aW9uOnJpZ2h0IGJvdHRvbTt3aWR0aDoxMDAlO2hlaWdodDoxMDAlfS5Db2RlTWlycm9yLWxpbnQtbGluZS1lcnJvcntiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMTgzLDc2LDgxLC4wOCl9LkNvZGVNaXJyb3ItbGludC1saW5lLXdhcm5pbmd7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDI1NSwyMTEsMCwuMSl9");
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
      lint: true,
      gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      readOnly: (node.disabled ? "nocursor" : false)
    });

    if (prettyPrintExisting) {
      codeMirror.setValue(JSON.stringify(JSON.parse(node.value), undefined, 2));
    }

    codeMirrorReplacements.set(node, codeMirror);

    enableDisableObserver.observe(node, {attributeFilter: ["disabled"]});

    // Sync CodeMirror state back to underlying textarea after user
    // input and fire events so that Ember reacts appropriately.
    codeMirror.on("update", function() {
      let inputEvent = new Event("input");

      try {
        JSON.parse(codeMirror.getValue());
      } catch (e) {
        // Don't sync malformed JSON back to the Classifier.
        // This is different from PE's normal behavior where
        // anything unparsable is just cast to a string.
        //
        // This change prevents a JSON oopsie from auto-promoting
        // to something that can fail puppet agent runs.
        return;
      }

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
    window.jsonlint = jsonlint;
    watchDocumentBody();
  });
})();
