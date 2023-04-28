// Constants

const Universal = "https://uv-v4.netlify.app/#?c=&m=&s=&cv=&manifest=";
const Mirador = "https://projectmirador.org/embed/?iiif-content=";
const Clover = "https://samvera-labs.github.io/clover-iiif/?iiif-content=";

// Load databases

var page = document.getElementById("page").innerHTML;
document.getElementById("page").innerHTML = "Loading...";

var resid = await fetch(
  "https://tomdeneire.github.io/fablepictor/identifiers.json"
);
const identifiers = await resid.json();
var resmeta = await fetch(
  "https://tomdeneire.github.io/fablepictor/metadata.json"
);
const metadata = await resmeta.json();
var resindex = await fetch(
  "https://tomdeneire.github.io/fablepictor/index.json"
);
const index = await resindex.json();

document.getElementById("page").innerHTML = page;
document.getElementById("total").innerHTML = Object.keys(identifiers).length;

// Extract random suggestions

var suggestions = "";
const indexKeys = Object.keys(index);
const numberOfKeywords = indexKeys.length;
for (let i = 0; i < 20; i++) {
  let random = Math.floor(Math.random() * numberOfKeywords);
  let keyword = indexKeys[random];
  let a = `<a onclick="document.getElementById('search').value = '${keyword}'; submit()">${keyword}</a> `;
  suggestions = suggestions + a;
}
document.getElementById("suggestions").innerHTML = suggestions;

// Enable enter

var input = document.getElementById("search");
input.addEventListener("keypress", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("submit").click();
  }
});

// Animals

let animals = new Set();
Object.values(metadata).forEach((data) => {
  if (data["A"] != null) {
    animals.add(`${data["A"]}`);
  }
});
let cols_sorted = Array.from(animals);
cols_sorted.sort();

var select_box = document.getElementById("collections");
for (var i = 0; i < cols_sorted.length; i++) {
  var option = document.createElement("option");
  option.innerHTML = cols_sorted[i];
  option.value = cols_sorted[i];
  select_box.appendChild(option);
}

let categories = "";
cols_sorted.forEach((category) => {
  let a = `<a onclick="document.getElementById('search').value = 'category:${category}'; submit()">${category}</a> `;
  categories = categories + a;
});
document.getElementById("categories").innerHTML = categories;

// Help functions

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function onlySelected(value, index, self) {
  return self.indexOf(value) === index;
}

// Submit function

window.submit = function () {
  document.getElementById("result").innerHTML = "";
  // Validate search input
  let search = document.getElementById("search").value;
  search = search.toLowerCase();
  if (search == "") {
    return;
  }
  let result = [];
  if (search.startsWith("category:")) {
    // Perform categories search
    let searches = search.split("category:");
    let animal = searches[1];
    Object.keys(metadata).forEach((hash) => {
      if (metadata[hash]["A"] == animal) {
        result = result.concat(hash);
      }
    });
  } else {
    // Perform normal search
    let searches = search.split("+");
    searches.forEach((term) => {
      let termResult = index[term];
      if (termResult != undefined) {
        result = result.concat(termResult);
      }
    });
    // Apply "+"
    if (searches.length > 1) {
      searches.forEach((term) => {
        term = term.trim();
        let termResult = index[term];
        if (termResult != undefined) {
          result = result.filter((x) => termResult.includes(x));
        } else {
          result = [];
        }
      });
      result = result.filter(onlyUnique);
    }
  }
  // Filter by animal
  let animal = document.getElementById("collections").value;
  if (animal != "all") {
    result = result.filter((hash) => metadata[hash]["A"] == animal);
  }
  // Fill result template
  let html = "<table>";
  if (result != null) {
    let size = Object.keys(result).length;
    html = `${html}<tr><td></td><td>${size} results</td></tr>`;
    result.forEach((hash) => {
      let img = identifiers[hash];
      if (img.endsWith("/full/0/default.jpg")) {
        img = img.replaceAll("/full/0/default.jpg", "/150,/0/default.jpg");
      }
      let a = `<a target="_blank" href="${img}">
            <img src="${img}" alt="thumbnail" width="150"></a>`;
      let manifest = metadata[hash]["M"];
      let permalink = metadata[hash]["P"];
      let title = metadata[hash]["S"];
      let impressum = "";
      if (metadata[hash]["L"] != "") {
        impressum = impressum + metadata[hash]["L"];
      }
      if (metadata[hash]["D"] != "") {
        impressum = impressum + " " + metadata[hash]["D"];
      }
      if (impressum != "") {
        title += "<br>" + impressum;
      }
      let fable = metadata[hash]["F"];
      if (fable != undefined) {
        title += `<br>"${fable}"`;
      }
      let desc =
        title +
        "<p>" +
        `<a target="_blank" href="${permalink}">${permalink}</a>` +
        "<p>" +
        `<a target="_blank" href="${manifest}">${manifest}</a>`;
      let viewers = `<p><a target="_blank" href="${
        Universal + manifest
      }">View with Universal</a>
            <br><a target="_blank" href="${
              Mirador + manifest
            }">View with Mirador</a>
            <br><a target="_blank" href="${
              Clover + manifest
            }">View with Clover</a>`;
      html = `${html}<tr><td>${a}</td><td>${desc + viewers}</td></tr>`;
    });
  } else {
    html = `${html}<tr><td></td><td>0 results</td></tr>`;
  }
  document.getElementById("result").innerHTML = html + "</table>";
};

// Set focus

window.onload = function () {
  document.getElementById("search").focus();
};
