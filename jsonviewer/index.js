const url = window.location.search.split("?url=")[1];

const response = await fetch(url);
const object = await response.json();
let html = JSON.stringify(object, null, 4);
// console.log(html);
html = html.replace(/\n/g, "<br>");
html = html.replace(/\s/g, "&nbsp;");
document.getElementById("jsonstring").innerHTML = html;
