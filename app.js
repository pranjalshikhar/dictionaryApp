let input = document.querySelector('#input');
let searchBtn = document.querySelector('#search');
let apiKey = '1014fad9-9aad-4a4a-924d-7587b38b4e8c';
let notFound = document.querySelector('.not__found');
let defBox = document.querySelector('.def');
let audioBox = document.querySelector('.audio');
let loading = document.querySelector('.loading');



searchBtn.addEventListener('click', function(e) {
    e.preventDefault();

    // Clear old data
    audioBox.innerHTML = '';
    notFound.innerText = '';
    defBox.innerText = '';

    // Get input data
    let word = input.value;

    // Call API.. get data

    if (word === '') {
        alert("Word is required.");
        return;
    }

    getData(word);

})


async function getData(word) {
    loading.style.display = 'block';

    // Ajax Call
    const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKey}`);
    const data = await response.json();


    // if empty data
    if (!data.length) {
        loading.style.display = 'none';
        notFound.innerText = 'No Result Found!';
        return;
    }

    // If result is suggestions
    if (typeof data[0] === 'string') {
        loading.style.display = 'none';
        let heading = document.createElement('h3');
        heading.innerText = 'Did you mean?';
        notFound.appendChild(heading);

        data.forEach(element => {
            let suggestion = document.createElement('span');
            suggestion.classList.add('suggested');
            suggestion.innerText = element;
            notFound.appendChild(suggestion);
        })

        return;
    }


    // Result Found
    loading.style.display = 'none';
    let definition = data[0].shortdef[0];
    defBox.innerText = definition;

    // Sound
    const soundName = data[0].hwi.prs[0].sound.audio;
    if (soundName) {
        renderSound(soundName);
    }


    console.log(data);
}


function renderSound(soundName) {
    let subfolder = soundName.charAt(0);
    let soundSrc = `https://media.merriam-webster.com/soundc11/${subfolder}/${soundName}.wav?key=${apiKey}`;

    let aud = document.createElement('audio');
    aud.src = soundSrc;
    aud.controls = true;
    audioBox.appendChild(aud);
}