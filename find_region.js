const { Client } = require('pg');

const regions = [
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-central-1',
  'ap-southeast-1', 'ap-northeast-1', 'ap-northeast-2',
  'ap-south-1', 'sa-east-1', 'ca-central-1'
];

const ref = 'qgyrlshqwshvylbhjtbh';
const pass = 'Diabalo@666';

async function testRegions() {
  console.log('Testing regions...');
  for (const r of regions) {
    const client = new Client({
      host: `aws-0-${r}.pooler.supabase.com`,
      port: 6543,
      database: 'postgres',
      user: `postgres.${ref}`,
      password: pass,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000
    });
    
    try {
      await client.connect();
      console.log(`\n\n✅ SUCCESS: Region is ${r}`);
      await client.end();
      process.exit(0);
    } catch (err) {
      process.stdout.write('.');
    }
  }
  console.log('\n❌ None of the regions worked. Are you sure the project still exists?');
}

testRegions();