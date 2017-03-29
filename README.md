# Google Authentication API Client for SuiteScript

[Documentation](https://cloud.google.com/nodejs/getting-started/authenticate-users) and [source code](https://github.com/google/google-auth-library-nodejs) by Google

More information about [SuiteScript](http://www.netsuite.com/portal/developers/resources/suitescript.shtml)

## Build

Clone the repository from GitHub  

```sh
git clone git://github.com/icarebenefits/google-auth-library-suitescript
cd google-auth-library-suitescript
```

After you clone the repository, download the dependency modules for both the SDK and build tool:

```sh
npm install
```
### Suite Script 1.x library

TBD

### Suite Script 2.x module

```sh
node dist-tools/ss-builder.js 1> google-auth.js
```

## Usage and Debug

### In Suite Script 1.x

TBD

### In Suite Script 2.x

Create OAuth2 object and get URL to Google login page.

```javascript
define(['SuiteScripts/google-auth', 'N/runtime', 'N/url'], function (gAuth, runtime, url) {
  // assume we are in Suitelet context to render a custom page
  function execute(context) {
    ...
    // read configuration
    var script = runtime.getCurrentScript();
    var clientId = script.getParameter('custscript_gauthclientid');
    var clientSecret = script.getParameter('custscript_gauthclientsecret');

    // generate current URL
    var redirectUrl = url.resolveScript({
      scriptId: script.id, 
      deploymentId: script.deploymentId,
      returnExternalUrl: true,
    });

    // create OAuth object
    var oauth2 = new gAuth.OAuth2(clientId, clientSecret, redirectUrl);

    var loginRedirect = oauth2.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/userinfo.email',
      login_hint: 'Please login with an iCare Benefits email',
    });
    ...
  }
});
```

## License

This library is licensed under Apache 2.0. Full license text is
available in [LICENSE][copying].

[copying]: https://github.com/icarebenefits/google-auth-library-netsuite/tree/master/LICENSE
