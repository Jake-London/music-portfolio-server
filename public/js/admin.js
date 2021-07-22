let coverUpload = document.querySelector('#upload-art');
let discUpload = document.querySelector('#disc-upload-art');

let text = document.querySelectorAll('.preview-container span');
let img = document.querySelectorAll('.preview-container img');

let currentPage = 0;
let totalPages;

let disc = {
    discCoverUrl: '',
    discName: '',
    discArtists: '',
    discSpotifyId: '',
};

function showPreview(textNode, imgNode, file) {
    if (file) {
        let reader = new FileReader();

        textNode.style.display = 'none';
        imgNode.style.display = 'block';

        reader.addEventListener("load", function() {
            console.log(this);
            imgNode.setAttribute("src", this.result);
        });

        reader.readAsDataURL(file);
    } else {
        textNode.style.display = null;
        imgNode.style.display = null;
    }
}


coverUpload.addEventListener("change", (event) => {
    let file = event.target.files[0];
    showPreview(text[0], img[0], file);
});

/* discUpload.addEventListener("change", (event) => {
    let file = event.target.files[0];
    showPreview(text[1], img[1], file);
}); */

let delaySpotifyInfoRequest = (value) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        spotifyInfoRequest(value);
    }, 500)
}

let spotifyInfoRequest = async (value) => {
    let uploadButton = document.querySelector('#disc-upload-submit');
    let previewContainer = document.querySelector('.disc-preview');
    uploadButton.disabled = true;
    uploadButton.classList.remove('upload-btn');

    disc.discCoverUrl = '';
    disc.discSpotifyId = '';
    disc.discName = '';
    disc.discArtists = '';

    
    let array = value.split('/');
    let array2 = array[array.length - 1].split('?');
    let id = array2[0];
    
    let data = [];
    
    let encodedKey = encodeURIComponent('id');
    let encodedValue = encodeURIComponent(id);
    data.push(encodedKey + '=' + encodedValue);
    data = data.join("&");
    
    let request = await fetch('/admin/spotify', {
        method: 'POST',
        body: data,
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
    
    let response = await request.json();
    console.log(response);
    
    if (response.imgUrl && response.status === 'ok') {
        text[1].style.display = 'none';
        img[1].style.display = 'block';
        
        img[1].setAttribute("src", response.imgUrl);
        let spotifyPreviewContent = `<iframe src="https://open.spotify.com/embed/track/${id}" width="100%" height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
        previewContainer.innerHTML = spotifyPreviewContent;

        
        disc.discCoverUrl = img[1].src;
        disc.discSpotifyId = id;
        disc.discName = response.songName;
        
        let arr = [];
        response.songArtists.forEach(artist => {
            arr.push(artist.name);
        });
        
        disc.discArtists = arr.join(',');
        
    }
    
    uploadButton.classList.add('upload-btn');
    uploadButton.disabled = false;
    
}

let uploadDiscography = async () => {

    if (disc.imgUrl !== '') {
        console.log(disc);

        var data = [];

        for (let key in disc) {
            let encodedKey = encodeURIComponent(key);
            let encodedValue = encodeURIComponent(disc[key]);
            data.push(`${encodedKey}=${encodedValue}`);
        }
        data = data.join("&");

        const response = await fetch('/admin/upload/disc', {
            method: 'POST',
            body: data,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });

        const result = await response.json();
        console.log(result);

        createFlashMessage(result.msg, result.status);

    }

}

let createFlashMessage = (msg, status) => {
    let form = document.querySelector('#upload-disc-form');
    let flash = form.querySelectorAll(".success-flash, .error-flash");

    flash.forEach(element => {
        form.removeChild(element);
    });

    let messageContainer = document.createElement('div');
    let message = document.createElement('p');

    message.textContent = msg;
    messageContainer.append(message);

    if (status === 'ok') {
        messageContainer.classList.add('success-flash');
    } else {
        messageContainer.classList.add('error-flash');
    }

    document.querySelector('#upload-disc-form').prepend(messageContainer);
}

let downloadSong = (title, bpm, duration) => {
    console.log(title, duration, bpm);
}

let sellSong = async (id, songItem) => {
    console.log(id);

    const response = await fetch(`/admin/update-available/${id}`, {
        method: 'PATCH'
    });
    const result = await response.json();

    if (result.status === 'ok') {
        let soldIcon = songItem.querySelector('.sold-song');
        if (soldIcon.classList.contains('sold-dashboard')) {
            soldIcon.classList.remove('sold-dashboard');
        } else {
            soldIcon.classList.add('sold-dashboard');
        }
    }

    console.log(result.track);
}

let deleteSong = async (id, songItem) => {
    console.log(id);

    const response = await fetch(`/admin/delete/${id}`, {
        method: 'DELETE'
    });
    const result = await response.json();

    if (result.status === 'ok') {
        let ul = document.querySelector('.song-list');
        ul.removeChild(songItem);
    } else {
        alert("There was an error deleting this file, please try again");
    }

    console.log(result);
}

let deleteDiscography = async (id, discItem) => {
    console.log(id, discItem);

    const response = await fetch(`/admin/discography/delete/${id}`, {
        method: 'DELETE'
    });
    const result = await response.json();

    if (result.status === 'ok') {
        let ul = document.querySelector('.discography-container ul');
        console.log(ul);
        ul.removeChild(discItem);
    } else {
        alert('There was an error deleting this files, please try again');
    }

    console.log(response);
}

let fetchSongs = async (page) => {
    const response = await fetch('/tracklist/' + page);
    
    
    const json = await response.json();
    console.log(json);

    if (!json.err) {
        song_list = json.trackList;

        let ul = document.querySelector('.song-list');

        for (let i = 0; i < song_list.length; i++) {
            let song = song_list[i];
            let temp = song.songPath.split('/');
            let dlPath = `http://${location.host}${song.songPath}`;

            let li = createListItem(song.coverPath, song.songName, song.songBpm, song.songDuration, 'dashboard', dlPath, temp[temp.length - 1], `/track/${song._id}`);

            let del = li.querySelector('.delete-song');
            let sold = li.querySelector('.sold-song');

            del.onclick = function() { deleteSong(song._id, this.parentNode.parentNode); };
            sold.onclick = function() { sellSong(song._id, this.parentNode.parentNode); };

            if (!song.isAvailable) {
                sold.classList.add('sold-dashboard');
            }

            
            ul.appendChild(li);
        }
    }

    let discographyList = document.querySelectorAll('.delete-disc');
    console.log(discographyList);

    for (let i = 0; i < discographyList.length; i++) {
        console.log(discographyList[i]);
        discographyList[i].onclick = function() { deleteDiscography(this.getAttribute('data-id'), this.parentNode.parentNode); };
    }

    let discography_list = document.querySelectorAll('.disc-item img');

    if (discography_list) {
        console.log(discography_list);

        for (let i = 0; i < discography_list.length; i++) {
            /* console.log(discography_list[i].offsetWidth); */

            discography_list[i].style.height = discography_list[i].offsetWidth + 'px';

            if ((i + 1) % 5 == 0) {
                console.log('here');
                console.log(discography_list[i]);
                discography_list[i].parentNode.style.paddingRight = "0px";
            }

        }
    }
    
    return json.count;
}

let clearSongs = () => {
    let list = document.querySelector('.song-list');
    let heading = document.querySelector('.song-item');
    list.textContent = '';
    list.append(heading);
}

document.addEventListener('DOMContentLoaded', async function(event) {
    if (location.href.split(location.host)[1] === '/admin' || location.href.split(location.host)[1] === '/admin/') {
        const count = await fetchSongs(0);
        console.log(`Total records is ${count}`);

        totalPages = Math.ceil(count / 25);

        let pageDom = document.querySelector('.current-page');
        pageDom.innerHTML = `${currentPage + 1}`;

        let next = document.querySelector('.next-item');
        let prev = document.querySelector('.prev-item');
        prev.style.display = 'none';

        next.addEventListener('click', async () => {
            
            if (currentPage+1 < totalPages) {
                currentPage++;
                console.log('Next Page Go');
                pageDom.innerHTML = `${currentPage + 1}`;
                clearSongs();
                fetchSongs(currentPage);

                if (currentPage - 1 >= 0) {
                    prev.style.display = 'inline';
                }
            } 
            if (currentPage == totalPages - 1) {
                next.style.display = 'none';
            }
        });

        prev.addEventListener('click', async () => {
            
            if (currentPage-1 >= 0) {
                currentPage--;
                console.log('Previous Page Go');
                pageDom.innerHTML = `${currentPage + 1}`;
                clearSongs();
                fetchSongs(currentPage);

                if (currentPage + 1 < totalPages) {
                    next.style.display = 'inline';
                }
            } 
            if (currentPage == 0) {
                prev.style.display = 'none';
            }
        });

        document.querySelector('#disc-spotify-link').addEventListener('input', (e) => {
            delaySpotifyInfoRequest(e.target.value);
        });

        document.querySelector('#upload-disc-form').addEventListener('submit', (e) => {
            e.preventDefault();
            uploadDiscography();
        }) 


        
    }
    
});