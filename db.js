import sqlite3 from 'sqlite3';
import { getData } from './api.js';

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
        let stmt = db.prepare(
          'INSERT INTO Countries (name, code, flag) VALUES ($name, $code, $flag)'
        );
        apiResponse.response.forEach((country) => {
          stmt.run({
            $name: country.name,
            $code: country.code,
            $flag: country.flag
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
            $countryname: league.country.name
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
                  $national: item.team.national ? 1 : 0
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

/////////////////////////////////
//end init DB
/////////////////////////////////

teamsDataPerCountry(120);
