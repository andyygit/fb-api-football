//render1
//  clear storage
//  attach event listeners

//variables

//event listeners
const keyupListener = async (e) => {
  let keyPressCount = e.target.value.length;
  if (keyPressCount > 3) {
    try {
      const res = await fetch(`http://${window.location.host}/h2h`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ team: e.target.value })
      });
      if (!res.ok) {
        throw new Error(`Status not ok: ${res.status}`);
      }
      const json = await res.json();
      const builder = new Listbuilder(json);
      builder.build();
    } catch (err) {
      console.log(`Fetch error: ${err}`);
    }
  }
};

const changeListener = async (e) => {
  let countryId = document.getElementById('league').value;
  try {
    const res = await fetch(`http://${window.location.host}/h2h/${countryId}`);
    if (!res.ok) {
      throw new Error(`Status not ok: ${res.status}`);
    }
    const json = await res.json();
    const builder = new Listbuilder(json);
    builder.build();
  } catch (err) {
    console.log(`Fetch error: ${err}`);
  }
};

//classes
class Store {
  getData(key) {
    let data;
    if (localStorage.getItem(key) === null) {
      return false;
    } else {
      data = localStorage.getItem(key);
    }
    return data;
  }
  addData(key, value) {
    localStorage.setItem(key, value);
  }
  delData() {
    localStorage.clear();
  }
  empty() {
    if (localStorage.length == 0) {
      return true;
    }
    return false;
  }
  length() {
    return localStorage.length;
  }
  set stage(stage) {
    this.addData('stage', stage);
  }
  get stage() {
    return !this.getData('stage') ? 0 : this.getData('stage');
  }
}

class UI {
  constructor(stage) {
    this.stage = stage;
    this.template = document.getElementById('my-template');
  }
  render() {
    switch (this.stage) {
      case 0:
        let source = this.template.content.getElementById('output');
        let content = document.importNode(source, true);
        let team = content.getElementById('team');
        let league = content.getElementById('league');
        team.innerHTML = this.stage == 0 ? 'Pick team 1' : 'Pick team 2';
        league.innerHTML = 'League';
        team.addEventListener('keyup', keyupListener);
        league.addEventListener('change', changeListener);
        document.getElementById('wrapper').appendChild(content);
        break;
      default:
        console.error('no such case in UI.render');
    }
  }
  clear() {
    // clear content
  }
}

class Listbuilder {
  constructor(dataSource) {
    this.searchResults = document.getElementById('searchResults');
    this.dataSource = dataSource;
  }
  build() {
    if (this.searchResults.childElementCount != 0) {
      this.searchResults.firstElementChild.remove();
    }
    let output = document.createElement('ul');
    this.dataSource.forEach((item) => {
      let li = document.createElement('li');
      for (const [key, value] of Object.entries(item)) {
        li.setAttribute(`data-${key}`, value);
        if (key == 'name') {
          li.appendChild(document.createTextNode(value));
        }
      }
      // li.addEventListener('click', activate);
      output.appendChild(li);
    });
    this.searchResults.appendChild(output);
  }
}

//helper functions
const init = () => {
  const storage = new Store();
  storage.delData();
  storage.stage = 0;
  const ui = new UI(storage.stage);
  ui.render();
};

document.addEventListener('DOMContentLoaded', init);
