PE Console CodeMirror
=====================

This repository contains a GreaseMonkey script that replaces `<textarea>`
inputs in the Puppet Enterprise Console with [CodeMirror][1] editor
components configured to edit JSON.

This script is intended for demonstration purposes only to show how
the Console could behave with a different input method for JSON data.
Do not use this script with a production instance of Puppet Enterprise.
Possible side effects may include, but are not limited to:

  - Fatal errors that render the Console unusable.
  - Performance issues that render the Console unusable.
  - Loss of configuration data entered via the console.
  - Corruption of configuration data entered via the console.

Do not use this script with a production instance of Puppet Enterprise.

Notes
-----

This script was developed against Firefox on macOS, mileage may
vary with other browsers and operating systems.

In particular, Chrome seems to enforce `Content-Security-Policy`
in a manner that conflicts with adding CSS to the PE console
pages. Adding the following to the configuration for
the `localhost:4430` proxy in `/etc/puppetlabs/nginx/conf.d/proxy.conf`
may work around the issue:

```
proxy_hide_header Content-Security-Policy
```

The `pe-nginx` service will need to be re-started to pick up
new configuration. This modification weakens the security
stance of PE, so, do not use this script with a production
instance of Puppet Enterprise.

[1]: https://codemirror.net/5/index.html
