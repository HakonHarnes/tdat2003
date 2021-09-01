$(document).ready(function() {
    let livefeed = document.querySelector('.livefeed');

    function getLivefeed() {
        let url = 'http://localhost:8080/article';

        fetch(url, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(json => {
                livefeed.innerHTML = '';
                json.forEach(updateLivefeed);
            })
            .catch(error => console.error(error));
    }

    function updateLivefeed(article) {
        let hour = (article.hour < 10 ? '0' : '') + article.hour;
        let minute = (article.minute < 10 ? '0' : '') + article.minute;

        livefeed.innerHTML += '<p><b>' + hour + ':' + minute + ':</b> ' + article.title + '</p>';
    }

    window.setInterval(function() {
        getLivefeed();
        console.log('UPDATING LIVEFEED');
    }, 30000);

    //on refresh
    getLivefeed();
});
