import sqlite3 from 'sqlite3';
import { getData } from './api.js';
import fs from 'fs';
import readline from 'readline';

sqlite3.verbose();

/////////////////////////////////
//init DB, run in console 1 by 1
//not exported
/////////////////////////////////

const initDatabase = () => {
  let db = new sqlite3.Database('footbalData.db', (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to database');
    }
    db.close((err) => {
      if (err) {
        console.log(err.message);
      }
      console.log('Close the database connection.');
    });
  });
};

const countries = () => {
  let db = new sqlite3.Database('footbalData.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to database');
    }
    db.serialize(() => {
      db.run(
        'CREATE TABLE Countries (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, code TEXT, flag TEXT)',
        (err) => {
          console.log(err);
        }
      );
    });
    db.close((err) => {
      if (err) {
        console.log(err.message);
      }
      console.log('Close the database connection.');
    });
  });
};

const countriesData = async () => {
  try {
    const apiResponse = await getData('teams/countries');

    let db = new sqlite3.Database('footbalData.db', sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Connected to database');
      }
      db.serialize(() => {
        let stmt = db.prepare('INSERT INTO Countries (name, code, flag) VALUES ($name, $code, $flag)');
        apiResponse.response.forEach((country) => {
          stmt.run({
            $name: country.name,
            $code: country.code,
            $flag: country.flag,
          });
        });
        stmt.finalize();
      });
      db.close((err) => {
        if (err) {
          console.log(err.message);
        }
        console.log('Close the database connection.');
      });
    });
  } catch (err) {
    console.log(err);
  }
};

const leagues = () => {
  let db = new sqlite3.Database('footbalData.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to database');
    }
    db.serialize(() => {
      db.run(
        'CREATE TABLE Leagues (id INTEGER PRIMARY KEY AUTOINCREMENT, api_footbal_id INTEGER, name TEXT, type TEXT, countryname TEXT)',
        (err) => {
          console.log(err);
        }
      );
    });
    db.close((err) => {
      if (err) {
        console.log(err.message);
      }
      console.log('Close the database connection.');
    });
  });
};

const leaguesData = async () => {
  try {
    const apiResponse = await getData('leagues');

    let db = new sqlite3.Database('footbalData.db', sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Connected to database');
      }
      db.serialize(() => {
        let stmt = db.prepare(
          'INSERT INTO Leagues (api_footbal_id, name, type, countryname) VALUES ($pi_footbal_id, $name, $type, $countryname)'
        );
        apiResponse.response.forEach((league) => {
          stmt.run({
            $pi_footbal_id: league.league.id,
            $name: league.league.name,
            $type: league.league.type,
            $countryname: league.country.name,
          });
        });
        stmt.finalize();
      });
      db.close((err) => {
        if (err) {
          console.log(err.message);
        }
        console.log('Close the database connection.');
      });
    });
  } catch (err) {
    console.log(err);
  }
};

const teams = () => {
  let db = new sqlite3.Database('footbalData.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to database');
    }
    db.serialize(() => {
      db.run(
        'CREATE TABLE Teams (id INTEGER PRIMARY KEY AUTOINCREMENT, api_footbal_id INTEGER, name TEXT, code TEXT, country_id INTEGER, national INTEGER)',
        (err) => {
          console.log(err);
        }
      );
    });
    db.close((err) => {
      if (err) {
        console.log(err.message);
      }
      console.log('Close the database connection.');
    });
  });
};

const teamsDataPerCountry = async (country_id) => {
  let db = new sqlite3.Database('footbalData.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to database');
    }
    db.serialize(() => {
      db.get('SELECT name FROM Countries where id = $id', { $id: country_id }, async (err, row) => {
        if (err) {
          console.log(err.message);
        }
        try {
          const apiResponse = await getData(`teams?country=${encodeURIComponent(row.name)}`);

          let db = new sqlite3.Database('footbalData.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
              console.error(err.message);
            } else {
              console.log('Connected to database');
            }
            db.serialize(() => {
              let stmt = db.prepare(
                'INSERT INTO Teams (api_footbal_id, name, code, country_id, national) VALUES ($api_footbal_id, $name, $code, $country_id, $national)'
              );
              apiResponse.response.forEach((item) => {
                stmt.run({
                  $api_footbal_id: item.team.id,
                  $name: item.team.name,
                  $code: item.team.code,
                  $country_id: country_id,
                  $national: item.team.national ? 1 : 0,
                });
              });
              stmt.finalize();
            });
            db.close((err) => {
              if (err) {
                console.log(err.message);
              }
              console.log('Close the database connection.');
            });
          });
        } catch (err) {
          console.log(err);
        }
      });
    });
    db.close((err) => {
      if (err) {
        console.log(err.message);
      }
      console.log('Close the database connection.');
    });
  });
};

const extractToFindSpecialChars = () => {
  try {
    let db = new sqlite3.Database('footbalData.db', sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Connected to database');
      }
      db.serialize(() => {
        db.all('SELECT * from Teams', (err, rows) => {
          rows.forEach((row) => {
            // console.log(`${row.id} *** ${row.api_footbal_id} *** ${row.name}`);
            fs.writeFileSync('out.txt', `${row.id} *** ${row.api_footbal_id} *** ${row.name}\n`, {
              flag: 'a+',
            });
          });
        });
      });
      db.close((err) => {
        if (err) {
          console.log(err.message);
        }
        console.log('Close the database connection.');
      });
    });
  } catch (err) {
    console.log(err);
  }
};

const findSpecialChars = async (filename) => {
  let found = new Set();
  let fileStream = fs.createReadStream(filename);
  let rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (let line of rl) {
    let regex = /[^a-zA-Z0-9 *{3}]/;
    let specialChar = line.match(regex);
    if (specialChar) {
      found.add(specialChar[0]);
    }
  }
  let arr = Array.from(found);
  console.log(arr.join(''));
};

/////////////////////////////////
//end init DB
/////////////////////////////////

/////////////////////////////////
// teamsDataPerCountry(261);
// finish importing teams in db - 261 countries, 24384 teams
/////////////////////////////////

// extractToFindSpecialChars();
// findSpecialChars('out.txt'); - to use as visual help in search page
// â, à, á, ã, ä, Á, å, Å, Ä, ā, ą, ă, Â, ả, ạ
// ç, Č, Č, ć, č, Ć, Ç
// đ, ď, Ď, Đ
// ë, é, è, É, ê, ě, ē, ė, ę, ə
// œ, æ, Æ
// ğ
// ï, í, ı, İ, Í̂, î, ì, ī, Î, ĩ
// Ķ
// ļ, ł, Ł, ľ, Ľ
// ñ, ň, ņ, ń
// ó, ö, Ö, õ, ô, ø, Ø, ő, Ó, ò, ŏ, ồ
// ř, Ř
// ß, ş, Ş, Š, š, ș, Ś, ś, Ș
// ť, ţ, ț, Ț, Ţ, Ť̊­
// ú, ü, Ú, ů, û̌, ű, ū, ų, Ü
// ý, Ý
// ž, Ž, ź, Ż, ż
