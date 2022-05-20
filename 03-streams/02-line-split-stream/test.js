const LineSplitStream = require('./LineSplitStream');
const os = require('os');
const sinon = require('sinon');

const lines = new LineSplitStream({encoding: 'utf-8'});
const onData = sinon.spy();
//
// lines.on('data', console.log);
// lines.on('end', () => console.log('end'));
lines.on('error', (error) => console.log('error:', error));

lines.on('data', onData);
lines.on('end', () => {
  console.log('end');
  console.log('1:', onData.firstCall.args[0]);
  console.log('2:', onData.secondCall.args[0]);
  console.log('3:', onData.thirdCall.args[0]);
});


// lines.write(`a${os.EOL}b`);
lines.write('a');
lines.write(`b${os.EOL}c`);
lines.write(`d${os.EOL}e`);
lines.write('f');

lines.end();





