let list = document.getElementById("search_resultsRows").children;
let links = [];
for (let i=0; i < list.length; i++){
    links.push(list[i].href);
}
var j = 0;
while(list[j].offsetHeight===0 || j > list.length) {
    j++;
}
window.open(links[j], '_blank');
j++;
var interval = setInterval(() => {
    while(list[j].offsetHeight===0 || j > list.length) {
        j++;
    }
    if(j > list.length)
        clearInterval(interval);
    console.log("interval: " + j);
    // list[j].click();
    window.open(links[j], '_blank');
    j++;
},120000);
