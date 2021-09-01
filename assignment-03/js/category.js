function getArticles(category) {
        let url = 'http://localhost:8080/article/category/' + category;

        fetch(url, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(json => json.forEach(displayArticle))
            .catch(error => console.error(error));
    }

    function displayArticle(article){
        let content = document.querySelector('.content');

        let wrapper = document.createElement('div'); 
        wrapper.className = 'article'; 

        let imageWrapper = document.createElement('div'); 
        imageWrapper.className = 'image-wrapper'; 

        let image = document.createElement('img'); 
        image.src = article.image; 

        let title = document.createElement('h1'); 
        title.innerHTML = article.title; 

        content.appendChild(wrapper); 
        wrapper.appendChild(imageWrapper);
        wrapper.appendChild(title);  
        imageWrapper.appendChild(image); 

        wrapper.onclick = function() {
            sessionStorage.setItem('id', article.article_id); 
            
            sessionStorage.setItem('title', article.title); 
            sessionStorage.setItem('image', article.image); 

            sessionStorage.setItem('text', article.text); 

            window.location.href = 'article.html';
        };
    }
