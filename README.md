<h1 align="center"> FelixWrapper </h1>
  <p align="center">
    <a href="https://david-dm.org/ParadoxalCorp/FelixBot-wrapper" target="_blank"><img src="https://david-dm.org/ParadoxalCorp/FelixBot-wrapper/status.svg" alt="Dependencies"></a>
    <a href="https://github.com/ParadoxalCorp/FelixBot-wrapper/blob/master" target="_blank"><img src="https://img.shields.io/github/stars/ParadoxalCorp/FelixBot-wrapper.svg?style=social&label=Star" alt="Github Stars"></a>
    <a href="https://github.com/ParadoxalCorp/FelixBot-wrapper/issues" target="_blank"><img src="https://img.shields.io/github/issues/ParadoxalCorp/FelixBot-wrapper.svg" alt="Github Issues"></a>
  </p>

  This is a wrapper for the API of Felix, a Discord bot

  This wrapper covers 100% of Felix's API and will be updated at the same time as Felix's API is

  All methods are async and returns promise, errors are in most case rejected

### Constructor

```js
const FelixWrapper = require("felix-wrapper");

let wrapper = new FelixWrapper({
    url: "",
    token: "",
    timeout: 42
});
```

  | Property | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | Required. The base url of the domain to request to |
| token | <code>String</code> | Optional. The token (private or public), optional but required for almost all endpoints |
| timeout | <code>Number</code> | Optional. The time in ms before requests should be aborted, default is 3000

### wrapper.status()

**Returns**: A boolean based on whether Felix's API is up or not

### wrapper.getUserData(user, options)

**Returns**: The user object/array of user objects 

  | Params | Type | Description |
| --- | --- | --- |
| user | <code>Object OR Array</code> | Required. The user ID or an array of IDs of the user(s) to fetch |
| options | <code>Object</code> | Optional. An object of options |
| options.timeout | <code>Number</code> | Optional. The time in ms before this request should be aborted, default is wrapper.timeout |

### wrapper.postUserData(user, options)

**Restricted to private tokens**

**Returns**: The posted user object if the operation is successful, otherwise reject an error


  | Params | Type | Description |
| --- | --- | --- |
| user | <code>Object</code> | Required. The user object to POST, will update or create a new database entry |
| options | <code>Object</code> | Optional. An object of options |
| options.timeout | <code>Number</code> | Optional. The time in ms before this request should be aborted, default is wrapper.timeout |

### wrapper.getGuildData(guild, options)

**Returns**: The guild object/array of guild objects 

  | Params | Type | Description |
| --- | --- | --- |
| guild | <code>Object OR Array</code> | Required. The guild ID or an array of IDs of the guild(s) to fetch |
| options | <code>Object</code> | Optional. An object of options |
| options.timeout | <code>Number</code> | Optional. The time in ms before this request should be aborted, default is wrapper.timeout |

### wrapper.postGuildData(guild, options)

**Restricted to private tokens**

**Returns**: The posted guild object if the operation is successful, otherwise reject an error


  | Params | Type | Description |
| --- | --- | --- |
| guild | <code>String</code> | Required. The guild object to POST, will update or create a new database entry |
| options | <code>Object</code> | Optional. An object of options |
| options.timeout | <code>Number</code> | Optional. The time in ms before this request should be aborted, default is wrapper.timeout |

### wrapper.fetchClientValue(value)

**Restricted to private tokens**

**Returns**: The value

  | Params | Type | Description |
| --- | --- | --- |
| value | <code>String</code> | Required. The value to fetch, this will be interpreted as a property name of the client object |