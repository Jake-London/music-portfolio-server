let isAdmin = false;
let pageNum = 0;
let end = false;

let toggleMobileMenu = () => {
    let navMenu = document.querySelector('.nav-links');
    navMenu.style.display !== 'flex' ? navMenu.style.display = 'flex' : navMenu.style.display = 'none';
}

let getSongFromList = (id) => {

    for (let i = 0; i < song_list.length; i++) {
        let obj = song_list[i];
        
        if (obj.hasOwnProperty('_id')) {
            if (obj._id === id) {
                current_index = i;
                return obj;
            }
        }
    }
    return null;

}

let newSong = (elem) => {
    console.log(elem);
    // console.log(elem.value);
    let song_item = elem.parentNode.parentNode;
    
    if (current_song_item === song_item) {
        setPlayState('.play-song');
    } else {

        if (current_song_item) {
            let itemPlay = current_song_item.querySelector('.play-song').children[0];
            let itemPause = current_song_item.querySelector('.play-song').children[1];

            if (itemPause.style.display === "inline") {
                itemPause.style.display = "none";
                itemPlay.style.display = "inline";
            }
        }

        current_song_item = song_item;

        isPlaying = true;
        let player = document.querySelector(".player");
        let footer = document.querySelector(".footer");
    
        footer.style.marginBottom = '82px';
        player.style.display = "block";
        console.log(song_item);
    
        let song_container = document.querySelector('.content-container');
        song_container.style.marginBottom = player.offsetHeight + 'px';
        
        let song_from_db = getSongFromList(song_item.getAttribute('data-id'));
    
        if (song_from_db != null) {
    
            let song_for_player = song_from_db;
            
            console.log(song_for_player);
            setPlayer(song_for_player, current_song_item.querySelector('.play-song'));
        }
    }

    
}

let fetchTracks = async (pageNum) => {
    
    if (!end) {
        const response = await fetch('/tracklist/' + pageNum);
        const json = await response.json();
        console.log('Response: ', json.trackList);

        if (!json.err) {
            song_list = [...song_list, ...json.trackList];

            let ul = document.querySelector('.song-list');

            for (let i = 0; i < json.trackList.length; i++) {
                let song = json.trackList[i];

                let li = createListItem(song.coverPath, song.songName, song.songBpm, song.songDuration, 'home', '', '', `/track/${song._id}`);

                li.setAttribute('data-id', song._id);
                
                let playButton = li.querySelector('.play-song');
                playButton.onclick = function() {newSong(this);};
                playButton.children[1].style.display = 'none';

                
                ul.appendChild(li);
            }

            /* let discography_list = document.querySelectorAll('.disc-item img');

            if (discography_list) {
                console.log(discography_list);

                for (let i = 0; i < discography_list.length; i++) {
                    // console.log(discography_list[i].offsetWidth);

                    discography_list[i].parentNode.style.height = discography_list[i].offsetWidth + 'px';

                    if ((i + 1) % 5 == 0) {
                        console.log('here');
                        console.log(discography_list[i]);
                        discography_list[i].parentNode.style.paddingRight = "0px";
                    }

                }
            } */
        } else {
            end = true;
        }
    }

    console.log(`End reached: ${end}`);
    
}

let getLastSong = () => {
    let allSongs = document.querySelectorAll('.song-item');
    let lastSong = allSongs[allSongs.length - 1];
    return lastSong;
}


let timer;
let delaySearch = (value) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        searchRequest(value);
    }, 500)
}

let createPreviewItem = (song) => {
    let li = document.createElement('li');
    li.classList.add('preview-item');

    let img = document.createElement('img');
    img.src = song.coverPath;

    let a = document.createElement('a');
    a.classList.add('title-link');
    a.textContent = song.songName;
    a.href = `/track/${song._id}`;

    li.appendChild(img);
    li.appendChild(a);

    return li;
}

let searchRequest = async (value) => {

    let ul = document.querySelector('.preview-list');
    ul.textContent = '';

    if (value) {
        let params = new URLSearchParams({name: value});
        let response = await fetch(`${window.location}search?${params}`);
        let json = await response.json();

        json.forEach(song => {
            ul.appendChild(createPreviewItem(song));
        });
        console.log(json);
    }


}


document.addEventListener('DOMContentLoaded', async function(event) {

    if (screen.width <= 800) {
        let navMenu = document.querySelector('.nav-links');
        navMenu.style.display = 'none';
    }

    if (location.href.split(location.host)[1] === '/') {
        await fetchTracks(pageNum);
        pageNum++;
        
    
        /* console.log(song_list); */

        let callback = (entries, observer) => {
            entries.forEach(async (entry) => {
                if (entry.isIntersecting) {
                    await fetchTracks(pageNum);
                    pageNum++;

                    observer.disconnect();
                    if (!end) {
                        observer.observe(getLastSong());
                    }
                }
            });
        }
        
        let observer = new IntersectionObserver(callback);
        observer.observe(getLastSong());


        document.querySelector('.search-form').addEventListener('submit', function(e) {
            e.preventDefault();
        });

        document.querySelector('.form-search').addEventListener('input', (e) => {
            delaySearch(e.target.value);
        });

        document.querySelector('.form-search').addEventListener('focus', (e) => {
            console.log('focused');
            let preview = document.querySelector('.search-preview-container');
            preview.style.display = 'block';
            
        });


        document.querySelector('.form-search').addEventListener('focusout', (e) => {
            console.log('lost focus');
            let previewItems = document.querySelectorAll('.preview-list .title-link');
            let found = false;
            previewItems.forEach(element => {
                console.log(element);
                if (element === e.relatedTarget) {
                    found = true;
                }
            });

            if (!found) {
                if (screen.width <= 800) {
                    setTimeout(function() {
                        let preview = document.querySelector('.search-preview-container');
                        preview.style.display = 'none';
                    }, 500);
                } else {
                    let preview = document.querySelector('.search-preview-container');
                    preview.style.display = 'none';
                }
            }
        })
        

        document.querySelector('audio').addEventListener('ended', function() {
            console.log('Song finished');
            nextSong();
        })
    }

    
    
});