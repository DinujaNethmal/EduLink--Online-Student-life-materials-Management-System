const mongoose = require('mongoose');
const dns = require('dns');

// DNS BYPASS
const mocks = {
  'ac-rbseehg-shard-00-00.qb8qsmb.mongodb.net': '159.41.171.178',
  'ac-rbseehg-shard-00-01.qb8qsmb.mongodb.net': '159.41.171.194',
  'ac-rbseehg-shard-00-02.qb8qsmb.mongodb.net': '159.41.171.188'
};
const origLookup = dns.lookup;
dns.lookup = (h, o, c) => (mocks[h] ? (typeof o === 'function' ? o(null, mocks[h], 4) : c(null, mocks[h], 4)) : origLookup(h, o, c));

const uris = [
  'mongodb://dinujanethmal119_db_user:n8ZHGoWOtXU6e1wx@ac-rbseehg-shard-00-00.qb8qsmb.mongodb.net:27017,ac-rbseehg-shard-00-01.qb8qsmb.mongodb.net:27017,ac-rbseehg-shard-00-02.qb8qsmb.mongodb.net:27017/?ssl=true&replicaSet=atlas-10qkof-shard-0&authSource=admin&tlsAllowInvalidCertificates=true'
];

async function test() {
  for (let uri of uris) {
    console.log(`\nTesting URI (TLS Insecure): ${uri.replace(/:.*@/, ':****@')}`);
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
      console.log('✅ SUCCESS: Connected!');
      await mongoose.disconnect();
      process.exit(0);
    } catch (err) {
      console.log(`❌ FAILED: ${err.name} - ${err.message}`);
    }
  }
}

test();
