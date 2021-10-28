require('child_process').execSync(
  'node ./node_modules/ts-node/dist/bin.js ./index.ts',
  { stdio: 'inherit' },
);
