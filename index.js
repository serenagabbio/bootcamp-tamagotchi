const Tamagotchi = require('./src/tamagotchi');

let thirdArg = process.argv[2];

if (thirdArg && thirdArg.split('=')[0] == '--name') {
  let tamagotchi = new Tamagotchi(thirdArg.split('=')[1]);

} else {
  //let tamagotchi = new Tamagotchi('pippo');
  console.log('Error: You have to specify a name for your creature like this: node index.js --name=ExampleName');
}