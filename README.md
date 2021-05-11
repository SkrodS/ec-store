# EC-store
### My final project of WESWEB01 and WEUWEB01.

## Dependencies
- Node.js
- MongoDB

# Installation and start up
0. Make sure that Node.js and MongoDB is installed correctly.
1. Clone the repository with: `git clone https://github.com/SkrodS/final-project.git`
2. Install packages with: `npm install`
3. Rename ".env-template" to ".env", in Linux with: `mv .env-template .env`
4. Uncomment the lines 54 to 98 in the file "./resources/routes/mongodb.js".
5. Start mongodb with: `sudo mongodb`
6. Start node.js with: `node index.js`
7. Shutdown node.js with <kbd>CTRL</kbd>+<kbd>C</kbd> in the terminal.
8. Comment the lines 54 to 98 in the file "./resources/routes/mongodb.js".
9. Start node.js with: `node index.js`
10. Done
### The website should now be running on "localhost:3000"