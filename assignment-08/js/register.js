$(document).ready(function() {
    let editing = false;
    let articles = [];

    $('.button-register').on('click', function() {
        let input = getInput();
        if (input == null) return;

        let id = $('.article-picker').val();
        editing ? updateArticle(input, id) : registerArticle(input);
    });

    $('.article-picker').on('change', function() {
        let id = $('.article-picker').val();

        if (id > 0) {
            for (let i = 0; i < articles.length; i++) if (articles[i].article_id == id) updateFields(articles[i]);

            if (!editing) {
                addDeleteButton();
                editing = true;
            }
        } else {
            clearInput();
            removeDeleteButton();
            editing = false;
        }
    });

    function getInput() {
        let input = {
            title: $('.title').val(),
            hour: 0,
            minute: 0,
            text: $('.text').val(),
            image: $('.image').val(),
            category: $('.category').val(),
            priority: $('.checkbox').is(':checked')
        };

        for (let key in input) {
            if (input[key].length == 0 || input[key] == null) {
                alert('Vennligst fyll ut alle feltene');
                return null;
            }
        }

        let now = new Date();

        input.hour = now.getHours();
        input.minute = now.getMinutes();

        return input;
    }

    function registerArticle(article) {
        let url = 'http://localhost:8080/article';

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify(article)
        })
            .then(json => {
                alert('Saken din har blitt registrert');
                clearInput();
                getArticles();
            })
            .catch(error => {
                console.error(error);
                alert('Teknisk feil');
            });
    }

    function updateArticle(article, id) {
        let url = 'http://localhost:8080/article/' + id;

        fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify(article)
        })
            .then(json => {
                alert('Saken din har blitt oppdatert');
                reset();
            })
            .catch(error => {
                console.error(error);
                alert('Teknisk feil');
            });
    }

    function deleteArticle(id) {
        let url = 'http://localhost:8080/article/' + id;

        fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        })
            .then(json => {
                alert('Saken din har blitt slettet');
                reset();
            })
            .catch(error => {
                console.error(error);
                alert('Teknisk feil');
            });
    }

    function getArticles() {
        let url = 'http://localhost:8080/article';

        fetch(url, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(json => {
                articles = [];
                clearArticlePicker();

                for (let i = 0; i < json.length; i++) {
                    articles.push(json[i]);
                    setArticlePicker(json[i]);
                }
            })
            .catch(error => console.error(error));
    }

    function clearArticlePicker() {
        let articlePicker = document.querySelector('.article-picker');
        articlePicker.innerHTML = '<option value=-1>Ny sak</option>';
    }

    function setArticlePicker(article) {
        let articlePicker = document.querySelector('.article-picker');

        articlePicker.innerHTML += '<option value="' + article.article_id + '">' + article.title + '</option>';
    }

    function clearInput() {
        $('.article-picker').val('-1');
        $('.title').val('');
        $('.text').val('');
        $('.image').val('');
        $('.category').val('');
        $('.checkbox').prop('checked', false);
    }

    function updateFields(article) {
        $('.title').val(article.title);
        $('.text').val(article.text);
        $('.image').val(article.image);
        $('.category').val(article.category);
        $('.checkbox').prop('checked', article.priority);
    }

    function addDeleteButton() {
        let container = document.querySelector('.button-container');

        let button = document.createElement('button');
        button.className = 'button-delete';
        button.innerHTML = 'Slett sak';

        button.onclick = function() {
            let id = $('.article-picker').val();

            deleteArticle(id);
        };

        container.appendChild(button);
        container.style.gridTemplateColumns = '1fr 1fr';
        container.style.gridGap = '10px';
    }

    function removeDeleteButton() {
        let container = document.querySelector('.button-container');

        container.removeChild(container.children[1]);
        container.style.gridTemplateColumns = '1fr';
        container.style.gridGap = '0px';
    }

    function reset() {
        clearInput();
        getArticles();
        editing = false;
        removeDeleteButton();
    }

    getArticles();
});
