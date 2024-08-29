import { writeFile } from 'fs';

const host = 'https://v3.football.api-sports.io/';
// const endpoint = 'status';
// const endpoint = 'teams/statistics?season=2023&team=33&league=39';

///////testing ---- uncommend above when done!!!!!!/////////
const endpoint = 'teams?league=39&season=2023'; ///get all teams from premier league"
///////end testing/////////

const API_KEY = process.env.API_KEY;
const API_HOST = host;

const url = `${host}${endpoint}`;

//single call -> write to file the response
const getData = async () => {
  try {
    const res = await fetch(url, {
      headers: {
        'x-rapidapi-host': API_HOST,
        'x-apisports-key': API_KEY,
      },
    });

    const contentType = res.headers.get('content-type');
    if (!res.ok) {
      throw new Error(`Response status nu este ok...: ${res.status}`);
    } else if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Hmmm... raspuns nu este JSON!: ${contentType}`);
    }

    const result = await res.json();

    writeFile(
      'request.json',
      JSON.stringify(result),
      {
        encoding: 'utf8',
      },
      (err) => {
        if (err) {
          throw new Error('Ceva nu a mers la scrierea fisierului...');
        }
      }
    );
    // console.log(result);
  } catch (err) {
    console.error(err);
  }
};

//recursive function to get 2 (or more teams data)
const callApi = async (endpoint, params = []) => {};

getData();
