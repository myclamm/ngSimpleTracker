Simple Tracker
==========
Basic template for tracking user clicks through your website using an Angular directive

### Installation & Usage
- bower install ml-simple-tracker
- Load module in index.html:
```sh
<script bower_components/ml-simple-tracker/dist/simpletracker.js></script>
```
- Inject into your Angular App
```sh
angular.module('yourApp',['userTracker'])
```
- Choose the POST route you'd like the click data sent to
```sh
angular.module('yourApp')
  .config(function(dataHandlerProvider){
    dataHandlerProvider.path = 'whateverPathYourServerUses'
  })
```
- Include 'tracker' directive on any DOM elements to begin tracking user clicks
```sh
<div tracker eventName='nameTheClickEvent'></div>
```
### End Result
- The path your user has taken through your website (as tracked by clicks) will be sent to your server every 15 seconds, along with any information you've stored in the user's cookie, in this format:
```sh
{
path: [{eventName:'eventName', absUrl:'urlOfClick', date:'timeOfClick'},{eventName,absUrl,date},etc...]
sessionData: cookieData
}
```
