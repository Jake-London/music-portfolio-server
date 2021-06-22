let coverUpload = document.querySelector('#upload-art');
let discUpload = document.querySelector('#disc-upload-art');

let text = document.querySelectorAll('.preview-container span');
let img = document.querySelectorAll('.preview-container img');

let currentPage = 0;
let totalPages;

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

discUpload.addEventListener("change", (event) => {
    let file = event.target.files[0];
    showPreview(text[1], img[1], file);
});

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
    
    }
    return json.count;
}

let clearSongs = () => {
    let list = document.querySelector('.song-list');
    list.textContent = '';
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
        })


        
    }
    
});