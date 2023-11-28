const json_file = process.argv[2];

require('dotenv').config();
const fs = require('fs');
const { parser } = require('stream-json');
const { streamArray } = require('stream-json/streamers/StreamArray');
const { Client } = require('@elastic/elasticsearch');

const client = new Client({
  node: process.env.ELASTIC_HOST,
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD,
  },
  tls: {
    ca: process.env.ELASTIC_TLS_CRT,
    rejectUnauthorized: false,
  },
});

const splice_size = 100000;
const es_json = [];
const delay = Date.now();

let json_file_count = 0;

const stream = fs.createReadStream(json_file);
stream
  .pipe(parser())
  .pipe(streamArray())
  .on('data', (d) => processData(d.value))
  .on('end', () => endProcess());

async function endProcess() {
  console.log(
    `End convert process json file to es bulk json type (+${
      Date.now() - delay
    }ms)`,
  );
  console.log(
    `Json raw count : ${json_file_count}, ES bulk json raw count : ${es_json.length}`,
  );
  await esBulk();
}

async function processData(data) {
  json_file_count++;

  es_json.push({
    index: {
      _index: 'board_community',
      _id: data.board_id.toString(),
    },
  });
  es_json.push({
    board_id: data.board_id,
    board_title: data.board_title,
    board_contents: data.board_contents,
    board_type: data.board_type,
    user_name: data.user_name,
  });
}

async function esBulk() {
  const bulk_count = Math.ceil(es_json.length / splice_size);

  for (let i = 0; i < bulk_count; i++) {
    const response = await client.bulk({
      body: i + 1 != bulk_count ? es_json.splice(0, splice_size) : es_json,
    });
    console.log(
      `[${i + 1}] ES bulk commit raw size : ${response.items.length}`,
    );
  }
}
