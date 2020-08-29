# Smart Lexer
Smart way to replace and transform your code to a different code

The primary objective of this utility is to tranform parameters and rename functions of an arbritary code statically

## Technology Used
This application uses flow_parser and JavaFX
https://cdn.jsdelivr.net/npm/flow-parser@0.132.0/flow_parser.js

This file needs to be copied and pasted to the root of the folder

Download JavaFX

Change the build.gradle.kts accordingly

"--module-path=C:\\MyFiles\\javafx-sdk-11.0.2\\lib"

 
## Example (SQL)
I have chosen SQL to tranform from SQL server function to PLSL function

CHARINDEX('t', 'Customer')
INSTR('Customer', 't')

In case if the function name only needs to be replaced, then it is easy

But, here the paramter 1 becomes 2 and 2 becomes 1

## Template Methodology
Currently experimenting with a compilcated JSON structure like a database

## Example Output

<p align="center">
  <img src="docs/static/banner.png">
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