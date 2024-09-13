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
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ team: e.target.value }),
      });
      if (!res.ok) {
        throw new Error(`Status not ok: ${res.status}`);
      }
      const json = await res.json();
      return json;
    } catch (err) {
      console.log(`Fetch error: ${err}`);
    }
  }
};

const changeListener = async () => {
  let countryId = document.getElementById('league').value;
  try {
    const res = await fetch(`http://${window.location.host}/h2h/${countryId}`);
    if (!res.ok) {
      throw new Error(`Status not ok: ${res.status}`);
    }
    const json = await res.json();
    return json;
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
    return !this.getData('stage') ? 0 : parseInt(this.getData('stage'));
  }
}

class MyForm extends HTMLElement {
  constructor() {
    super();
    this.template = document.getElementById('my-template');
  }
  connectedCallback() {
    const source = this.template.content.getElementById('output');
    const output = document.importNode(source, true);
    this.appendChild(output);
  }
}
customElements.define('my-form', MyForm);

// class Listbuilder {
//   constructor(dataSource) {
//     this.searchResults = document.getElementById('searchResults');
//     this.dataSource = dataSource;
//   }
//   build() {
//     if (this.searchResults.childElementCount != 0) {
//       this.searchResults.firstElementChild.remove();
//     }
//     let output = document.createElement('ul');
//     output.setAttribute(`data-searchcriteria`, this.dataSource.searchcriteria);
//     this.dataSource.returndata.forEach((item) => {
//       let li = document.createElement('li');
//       for (const [key, value] of Object.entries(item)) {
//         li.setAttribute(`data-${key}`, value);
//         if (key == 'name') {
//           li.appendChild(document.createTextNode(value));
//         }
//       }
//       output.appendChild(li);
//       if (this.dataSource.searchcriteria == 'teams') {
//         output.addEventListener('click', saveTeamToStore);
//       } else if (this.dataSource.searchcriteria == 'leagues') {
//         output.addEventListener('click', saveLeagueToStore);
//       }
//     });
//     this.searchResults.appendChild(output);
//   }
// }

//init
const init = () => {
  const storage = new Store();
  storage.delData();
  storage.stage = 1;
};

// document.addEventListener('DOMContentLoaded', init);
