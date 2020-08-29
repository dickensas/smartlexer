# Smart Lexer
Smart way to replace and transform your code to a different code

The primary objective of this utility is to transform parameters and rename functions of an arbitrary source code statically

## Mandatory dependencies
This application uses flow_parser and JavaFX
https://cdn.jsdelivr.net/npm/flow-parser@0.132.0/flow_parser.js

`flow_parser.js` This file needs to be copied and pasted to the root of the folder

Download JavaFX

Change the build.gradle.kts accordingly

`"--module-path=C:\\MyFiles\\javafx-sdk-11.0.2\\lib"`

 
## Example Use Case (SQL)
I have chosen SQL to transform from SQL server function to PLSL function

CHARINDEX('t', 'Customer')<br/>
INSTR('Customer', 't')

In case if the function name only needs to be replaced, then it is easy

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

This file should be named as "database.json" and put in the root folder

## Example Output
&#10240;  <!-- Hack to add whitespace -->

<p align="center">
  <img src="/docs/static/screenshot-1.png">
</p>

## TODO

- [x] 1 - Rename a CallExpression 
- [x] 2 - Shuffle the parameters of CallExpression
- [ ] 3 - Change Identifier to Literal
- [ ] 4 - Change Literal to Identifier
- [ ] 5 - Detect SQL JOIN connectivity
- [ ] 6 - Rule engine integration, like drools.... etc
- [ ] 7 - Emit functions to the developer for custom code
- [ ] 8 - Advanced intent beautifier  

## Usage
The code is ready to execute

If you have gradle in path, then invoke gradle as

     gradle assemble

If you have wrapper for linux

     ./gradlew assemble

If you have wrapper for windows

     .\gradlew assemble

Then execute bellow task to start the OpenGL Window

     .\gradlew run