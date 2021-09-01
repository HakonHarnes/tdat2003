let url = "http://bigdata.stud.iie.ntnu.no/sentiment/webresources/sentiment/log?api-key=Happy!!!";
let colors = ["#f21a09", "#f34335", "#edf434", "#57e83f", "#2cd111"];

document.querySelector(".submit-button").addEventListener("click", e => {
    let text   = document.querySelector(".input").value;

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        }, 
        body: JSON.stringify({ sentence: text })
    })
        .then(response => response.json())
        .then(json => {
            let color = colors[JSON.stringify(json.value)]; 
            document.documentElement.style.setProperty("--color", color); 
        })
        .catch(error => console.log("Error ", error)); 
})