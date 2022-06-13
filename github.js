async function requestSubmit(event) {
    event.preventDefault();
    const inputValue = document.querySelector('.js-search-input').value;
    const searchQuery = inputValue.trim();
    document.querySelector('.js-search-input').disabled = true;
    try {
        const results = await searchGithub(searchQuery);
        displayResults(infoGithub(results));
    } catch (err) {
        const p = document.createElement('p');
        p.innerHTML = `Nous sommes désolés l'utlisateur ${searchQuery} est introuvable`;
        p.style.textAlign = 'center';
        p.style.color = 'red';
        document.querySelector('.js-search-form').insertAdjacentElement('beforeend', p);
        setTimeout(()=>{
            document.querySelector('.js-search-form').removeChild(p);
        }, 5000);
    }
    document.querySelector('.js-search-input').disabled = false;
    document.querySelector('.js-search-input').value = '';
}

async function searchGithub(login) {
    const request = `https://api.github.com/users/${login}/repos`;
    const response = await axios.get(request);
    if (response.status != 200) {
        throw Error(response.statusText);
    }
    return response.data;
}

function infoGithub(infos) {
    let user = [];
    let repository = [];
    if(infos.length > 0){
        user.push({
            'name': infos[0].owner.login,
            'avatar': infos[0].owner.avatar_url,
            'url': infos[0].owner.html_url,
        });
    }
    for(repo of infos){
        repository.push({
            'name' : repo.name,
            'url' : repo.html_url
        });
    }
    return [user, repository];
}

function linkRepos(repos){
    let links = '';
    for(a of repos){
        links += `<a href="${a.url}" target="_blank">${a.name}</a>`
    }
    return links;
}

function displayResults(results) {
    const searchResults = document.querySelector('.js-search-results');
    searchResults.insertAdjacentHTML(
        'beforeend',
        `<div class="result-item">
            <div class="left">
                <img src='${results[0][0].avatar}' width='200'>
            </div>
            <div class="left">
                <div class="text">
                    <p>Name : ${results[0][0].name}</p>
                    <p>Github : <a href="${results[0][0].url}" target="_blank">Link</a></p>
                    <p>Public Repos : <span> ${results[1].length} </span> </p>
                </div>
            </div>
            <div class="left">
                <div class="dropdown">
                    <button class="dropbtn">Get Repos</button>
                    <div class="dropdown-content">
                        ${linkRepos(results[1])}
                    </div>
                </div>
            </div>
        </div>`
    );
}
document.querySelector('.js-search-results').addEventListener('click', e => {
    if(e.target.classList.contains('dropbtn')){
        e.target.classList.toggle('down');
        e.target.nextElementSibling.classList.toggle('active');
    }
});

document.querySelector('.js-search-form').addEventListener('submit', requestSubmit);