# Smart Lexer
Smart way to replace and transform your code to a different code

The primary objective of this utility is to transform parameters and rename functions of an arbitrary source code statically

## Mandatory dependencies

### Flow Parser
This application uses flow-parser, use the below command to install flow-parser

```
npm install flow-parser --save
```

### PEG.js
This application uses PEG.js for advanced parsing, use the below command to install PEG.js

```
npm install pegjs --save
```

### Handlebars
This application uses Handlebars for advanced parsing, use the below command to install Handlebars

```
npm install handlebars --save
```

### Browserify
This application uses Browserify to make the javascript work in JavaFX as a standalone application

```
npm install browserify --save
browserify smartlexer.js --standalone smartlexer -v -o > bundle.js
```

## Optional dependencies

### JavaFX
Only required for running in GUI<br/>
Automatically gets downloaded into local folder, no need to download and install JavaFX.

 
## Example Use Case (SQL)
I have chosen SQL to transform from T-SQL function to PLSQL function

`CHARINDEX('t', 'Customer')`<br/>
`INSTR('Customer', 't')`

In case, if the function name only needs to be replaced, then it is easy

But, here the parameter 1 becomes 2 and 2 becomes 1

## Template Methodology
Currently experimenting with a complicated JSON structure like a database

    "template":
    [
        {
            "fr":
            {
                "name":"CHARINDEX",
                "args":["1:L","2:L"]
            },
            "to":
            {
                "name":"INSTR",
                "args":["2:L","1:L"]
            }
        }
    ]
Template syntax reference

| Abbreviation  | Expansion           | Example  |
| ------------- |:-------------:| -----:|
| I      | Identifier | "args":["1:I"] |
| L      | Literal      |   "args"["1:L"] |
| CE | CallExpression      |   "args":["1:CE"] |
| BE | BinaryExpression      |   "args":["1:BE"] |

This file should be named as "database.json" and put in the root folder or passed as a 3rd parameter

## Example Output
&#10240;  <!-- Hack to add whitespace -->

<p align="center">
  <img src="/docs/static/screenshot-1.png">
</p>

## Documentation

[Wiki Pages](https://github.com/dickensas/smartlexer/wiki)

## TODO

- [x] 1 - Rename a CallExpression 
- [x] 2 - Shuffle the parameters of CallExpression
- [ ] 3 - Change Identifier to Literal
- [ ] 4 - Change Literal to Identifier
- [ ] 5 - Detect SQL JOIN connectivity
- [ ] 6 - Rule engine integration, like drools.... etc
- [x] 7 - Emit functions to the developer for custom code
- [ ] 8 - Advanced intent beautifier
- [ ] 9 - EXCEL/CSV as template data source
- [-] 10  - Test programming languages like Java, Kotlin, C... etc.,
- [ ] 11  - XML transform facility
- [ ] 12  - Lex path detection and replace strategy
- [x] 13  - Node.js command line support
- [x] 14  - Parse Simple C++ without missing any tokens
- [x] 15  - PEG.js Testing
- [x] 16  - Mocha Testing
- [x] 17  - Handlebars + PEG.js idea
- [x] 18  - Use handlebars to make the javascript work inside JavaFX
- [x] 19  - fetch syntax to Soap UI XML
- [-] 20  - Python PEG.js Grammer (In Progress)

## Usage GUI (Requires Java)
The code is ready to execute

If you have gradle in path, then invoke gradle as

     gradle assemble

If you have wrapper for linux

     ./gradlew assemble

If you have wrapper for windows

     .\gradlew assemble

Then execute bellow task to start the application window

     .\gradlew run

## Usage Node.js

     node smartlexer.js <source file> <listener javascript file> <database json file>

## Reference

[javascript.pegjs from PEG.js examples](https://github.com/pegjs/pegjs/blob/master/examples/javascript.pegjs)
     
## License

[MIT](/LICENSE)