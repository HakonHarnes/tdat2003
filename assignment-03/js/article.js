$(document).ready(function() {
    let id = sessionStorage.getItem('id'); 

    document.querySelector('.title').innerHTML = sessionStorage.getItem('title'); 
    document.querySelector('.image').src = sessionStorage.getItem('image'); 
    document.querySelector('.text').innerHTML = sessionStorage.getItem('text').replace(/(?:\r\n|\r|\n)/g, '<br>'); 

    $('.button-submit').on('click', function() {;
        let input = getInput();
        if (input == null) return;

        registerComment(input); 
    });

    function getInput() {
        let input = {
            nickname: $('.nickname-input').val(), 
            comment: $('.comment-input').val() 
        };

        if(input.nickname.length < 1 || input.comment.length < 1){
            alert('Vennligst fyll ut alle feltene');
            return null;  
        }

        return input;
    }

    function registerComment(comment) {
        let url = 'http://localhost:8080/article/' + id + '/comment';

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify(comment)
        })
            .then(json => {
                alert('Kommentaren din har blitt registrert');
                clearInput();
                getComments(); 
            })
            .catch(error => {
                console.error(error);
                alert('Teknisk feil');
            });
    }

    function getComments() {
        let url = 'http://localhost:8080/article/' + id + '/comment';

        fetch(url, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(json => {
                clearComments(); 
                json.forEach(displayComment)
            })
            .catch(error => console.error(error));
    }

    function clearComments(){
        let wrapper = document.querySelector('.comment-wrapper');

        wrapper.innerHTML = ''; 
    }

    function displayComment(comment){
        let wrapper = document.querySelector('.comment-wrapper');

        let commentElement = document.createElement('p'); 
        commentElement.className = 'comment'; 
        commentElement.innerHTML = '<b>' + comment.nickname + ':</b> ' + comment.comment; 

        wrapper.appendChild(commentElement); 
    }

    function clearInput() {
        $('.nickname').val('');
        $('.comment').val('');
    }

    getComments(); 
});
