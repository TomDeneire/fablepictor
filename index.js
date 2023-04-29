// Help functions

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function onlySelected(value, index, self) {
  return self.indexOf(value) === index;
}

function getSelectedText(elementId) {
  var elt = document.getElementById(elementId);

  if (elt.selectedIndex == -1) return null;

  return elt.options[elt.selectedIndex].text;
}

// Load data

const page = document.getElementById("page").innerHTML;
document.getElementById("page").innerHTML = "Loading...";

const resid = await fetch(
  "https://tomdeneire.github.io/fablepictor/identifiers.json"
);
const identifiers = await resid.json();
const resmeta = await fetch(
  "https://tomdeneire.github.io/fablepictor/metadata.json"
);
const metadata = await resmeta.json();
const resindex = await fetch(
  "https://tomdeneire.github.io/fablepictor/index.json"
);
const index = await resindex.json();

document.getElementById("page").innerHTML = page;
document.getElementById("total").innerHTML = Object.keys(identifiers).length;

// Set focus
document.getElementById("search").focus();

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

// Show random suggestions

const indexKeys = Object.keys(index);
const numberOfKeywords = indexKeys.length;
for (let i = 0; i < 20; i++) {
  const random = Math.floor(Math.random() * numberOfKeywords);
  const keyword = indexKeys[random];
  const suggestion = `<a onclick="document.getElementById('search').value = '${keyword}'; submit()">${keyword}</a> `;
  document.getElementById("suggestions").innerHTML += suggestion;
}

// Animal collections

const animals = new Set();
Object.values(metadata).forEach((data) => {
  if (data["A"] != null) {
    animals.add(`${data["A"]}`);
  }
});
const cols_sorted = Array.from(animals);
cols_sorted.sort();

const collectionsSelect = document.getElementById("collections");
for (var i = 0; i < cols_sorted.length; i++) {
  const option = document.createElement("option");
  option.innerHTML = cols_sorted[i];
  option.value = cols_sorted[i];
  collectionsSelect.appendChild(option);
}

cols_sorted.forEach((category) => {
  const categoryLink = `<a onclick="document.getElementById('search').value = 'category:${category}'; submit()">${category}</a> `;
  document.getElementById("categories").innerHTML += categoryLink;
});

// Search function
function Search(search) {
  let result = [];
  if (search.startsWith("category:")) {
    // Categories search
    let searches = search.split("category:");
    let animal = searches[1];
    Object.keys(metadata).forEach((hash) => {
      if (metadata[hash]["A"] == animal) {
        result = result.concat(hash);
      }
    });
  } else {
    // Normal search
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
  const animal = document.getElementById("collections").value;
  if (animal != "all") {
    result = result.filter((hash) => metadata[hash]["A"] == animal);
  }
  return result;
}

// Show result function

function ShowResult(result) {
  let html = "<table>";
  let size = Object.keys(result).length;
  html = `${html}<tr><td></td><td>${size} results</td></tr></table>`;
  html += "<div>";
  let count = 0;
  result.forEach((hash) => {
    count += 1;
    // Build data elements
    let img = identifiers[hash];
    if (img.endsWith("/full/0/default.jpg")) {
      img = img.replaceAll("/full/0/default.jpg", "/300,/0/default.jpg");
    }
    const thumbnail = `<a target="_blank" href="${img}">
            <img src="${img}" alt="thumbnail" width="300"></a>`;
    const manifest = metadata[hash]["M"];
    const permalink = metadata[hash]["P"];
    const short = metadata[hash]["S"];
    let title = metadata[hash]["S"];
    let impressum = "";
    if (metadata[hash]["L"] != "") {
      impressum = impressum + metadata[hash]["L"];
    }
    if (metadata[hash]["D"] != "") {
      impressum = impressum + ", " + metadata[hash]["D"];
    }
    if (impressum != "") {
      title += "<br>" + impressum;
    }
    let fable = metadata[hash]["F"];
    if (fable != undefined) {
      title += `<br>"${fable}"`;
    }
    const description =
      title +
      "<p>" +
      `<a target="_blank" href="${permalink}">${permalink}</a>` +
      "<p>" +
      `<a target="_blank" href="jsonviewer?url=${manifest}">${manifest}</a>`;
    const viewer = document.getElementById("viewer").value;
    const viewerName = getSelectedText("viewer");
    const viewerLink = `
        <p><a target="_blank" href="${
          viewer + manifest
        }">View with ${viewerName}</a>
            <br>`;
    // Fill template
    if (count % 2 != 0) {
      html += `<div class="row">
<div class="col-sm-6 mb-3 mb-sm-0">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">${short}</h5>
        <p class="card-text">${thumbnail}</p>
        <p class="card-text">${description}${viewerLink}</p>
      </div>
    </div>`;
    } else {
      html += `<div class="col-sm-6">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">${short}</h5>
        <p class="card-text">${thumbnail}</p>
        <p class="card-text">${description}${viewerLink}</p>
      </div>
    </div>
  </div>
</div>`;
    }
    html += "</div>";
    document.getElementById("result").innerHTML = html;
  });
}

// Submit function

window.submit = function () {
  document.getElementById("result").innerHTML = "";

  let search = document.getElementById("search").value;
  search = search.toLowerCase();
  if (search == "") {
    return;
  }

  const result = Search(search);
  if (result != undefined) {
    ShowResult(result);
  }
};
