import { writeFile } from 'fs';
import { URL } from 'url';

const host = 'https://v3.football.api-sports.io/';
const t1l1 = [2023, 33, 39];
const t2l2 = [2023, 577, 310];

const API_KEY = process.env.API_KEY;
const API_HOST = host;

//api call
const getData = async (endpoint, params) => {
  let url = new URL(`${host}${endpoint}`);
  if (params) {
    url.searchParams.append('season', params[0]);
    url.searchParams.append('team', params[1]);
    url.searchParams.append('league', params[2]);
  }

  try {
    let res = await fetch(url, {
      headers: {
        'x-rapidapi-host': API_HOST,
        'x-apisports-key': API_KEY
      }
    });

    const contentType = res.headers.get('content-type');
    if (!res.ok) {
      throw new Error(`Response status nu este ok...: ${res.status}`);
    } else if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Hmmm... raspuns nu este JSON!: ${contentType}`);
    }

    const result = await res.json();
    return result;
  } catch (err) {
    console.error(err);
  }
};

//h2h 2 teams
const h2hStatistics = async (endpoint, team1, team2, returnData = []) => {
  let sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  };
  let result = await getData(endpoint, team1);
  returnData.push(result);
  await sleep(1000);
  result = await getData(endpoint, team2);
  returnData.push(result);
  writeFile(
    'local/request.js',
    `const data = ${JSON.stringify(returnData)}`,
    {
      encoding: 'utf8'
    },
    (err) => {
      if (err) {
        throw new Error('Ceva nu a mers la scrierea fisierului...');
      }
    }
  );
};

// h2hStatistics('teams/statistics', t1l1, t2l2);

let status = await getData('status');
console.log(status);
