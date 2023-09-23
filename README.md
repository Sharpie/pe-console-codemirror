PE Console CodeMirror
=====================

This repository contains a GreaseMonkey script that replaces `<textarea>`
inputs in the Puppet Enterprise Console with [CodeMirror][1] editor
components configured to edit JSON.

This script is intended for demonstration purposes only to show how
the Console could behave with a different input method for JSON data.
Do not use this script on a production instance of Puppet Enterprise.
Possible side effects may include, but are not limited to:

  - Fatal errors that render the Console unusable.
  - Performance issues that render the Console unusable.
  - Loss of configuration data entered via the console.
  - Corruption of configuration data entered via the console.

Do not use this script on a production instance of Puppet Enterprise.

[1]: https://codemirror.net/5/index.html
