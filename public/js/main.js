let isPlaying = false;
let isMuted = false;
let isAdmin = false;

let current_index;
let min_index = 0;

let volume_slider = document.querySelector('.volume-slider');

let seek_slider = document.querySelector('.seek-slider');
/* let current_time = document.querySelector('.current-time');
let end_time = document.querySelector('.end-time'); */

let updateTimer;

let current_track = document.createElement('audio');
let current_song_item;
document.body.appendChild(current_track);


let song_list = [];


let pageNum = 0;
let end = false;



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

let prevSong = () => {
    let temp = current_index;
    temp -= 1;

    if (temp < song_list.length && temp >= min_index) {
        current_index = temp;
        let song_at_index = document.querySelectorAll('.song-item')[current_index + 1];
        console.log(song_at_index);

        let play_button = song_at_index.querySelector('.play-song');
        console.log(play_button);

        newSong(play_button);

        return;
    }

    console.log("Error, first song in list, can't go back further");
}

let nextSong = () => {
    let temp = current_index;
    temp += 1;

    if (temp < song_list.length && temp >= min_index) {
        current_index = temp;
        let song_at_index = document.querySelectorAll('.song-item')[current_index + 1];
        console.log(song_at_index);

        let play_button = song_at_index.querySelector('.play-song');
        console.log(play_button);

        newSong(play_button);
        
        return;
    }

    console.log("Error, last song in list, can't go forward");
}

let setPlayer = (song, node) => {

    let player = document.querySelector(".player");

    let play = document.querySelector('.player-play').children[0];
    let pause = document.querySelector('.player-play').children[1];

    let itemPlay = node.children[0];
    let itemPause = node.children[1];

    let player_title = player.querySelector(".player-title");
    let player_img = player.querySelector(".player-art").children[0];
    player_img.src = song.coverPath;
    player_title.children[0].innerHTML = song.songName;

    current_track.src = song.songPath;
    console.log(current_track);
    
    current_track.load();
    current_track.play();

    play.style.display = "none";
    pause.style.display = "inline";

    itemPlay.style.display = "none";
    itemPause.style.display = "inline";

    isPlaying = true;

    current_track.volume = 0.5;
    volume_slider.value = 50;

    updateTimer = setInterval(seekUpdate, 100);

    console.log("Song index is: " + current_index);

}

let setPlayState = (id) => {

    console.log('setPlayState');

    let play = document.querySelector('.player-play').children[0];
    let pause = document.querySelector('.player-play').children[1];

    let itemPlay = current_song_item.querySelector(id).children[0];
    let itemPause = current_song_item.querySelector(id).children[1];

    if (isPlaying === false) {
        play.style.display = "none";
        pause.style.display = "inline";

        itemPlay.style.display = "none";
        itemPause.style.display = "inline";

        current_track.play();
    } else if (isPlaying === true) {
        pause.style.display = "none";
        play.style.display = "inline";
        
        itemPause.style.display = "none";
        itemPlay.style.display = "inline";
        
        current_track.pause();
    }

    isPlaying = !isPlaying;

    console.log("Playing song: " + isPlaying);
}

let toggleVolume = () => {

    let unmuted = document.querySelector('.fa-volume-up');
    let muted = document.querySelector('.fa-volume-mute');

    if (isMuted === false) {
        unmuted.style.display = "none";
        muted.style.display = "inline";
    } else if (isMuted === true) {
        muted.style.display = "none";
        unmuted.style.display = "inline";
        //set volume to 50%
    }

    isMuted = !isMuted;

    if (!isMuted) {
        current_track.volume = 50 / 100;
        volume_slider.value = 50;
    } else {
        current_track.volume = 0;
    }

}

let setVolume = () => {

    let value = volume_slider.value;
    console.log(value);

    let unmuted = document.querySelector('.fa-volume-up');
    let muted = document.querySelector('.fa-volume-mute');

    if (value === "1") {
        unmuted.style.display = "none";
        muted.style.display = "inline";
        isMuted = true;
    } else {
        muted.style.display = "none";
        unmuted.style.display = "inline";
        isMuted = false;
    }

    if (!isMuted) {
        current_track.volume = volume_slider.value / 100;
    } else {
        current_track.volume = 0;
    }

}

let seek = () => {
    current_track.currentTime = current_track.duration * (seek_slider.value / 10000);
}

let seekUpdate = () => {
    let seekPosition = 0;
   
    // Check if the current track duration is a legible number
    if (!isNaN(current_track.duration)) {
      seekPosition = current_track.currentTime * (10000 / current_track.duration);
      seek_slider.value = seekPosition;
   
      // Calculate the time left and the total duration
      let currentMinutes = Math.floor(current_track.currentTime / 60);
      let currentSeconds = Math.floor(current_track.currentTime - currentMinutes * 60);
      let durationMinutes = Math.floor(current_track.duration / 60);
      let durationSeconds = Math.floor(current_track.duration - durationMinutes * 60);
   
      // Add a zero to the single digit time values
      if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
      if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
      if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
      if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }
   
      // Display the updated duration
      /* current_time.textContent = currentMinutes + ":" + currentSeconds;
      end_time.innerHTML = durationMinutes + ":" + durationSeconds; */
    }
}

let testFetch = async (pageNum) => {
    console.log(`End reached: ${end}`);
    if (!end) {
        const response = await fetch('/tracklist/' + pageNum);
        console.log(response);
        const json = await response.json();

        if (!json.err) {
            song_list = json.trackList;

            let ul = document.querySelector('.song-list');

            for (let i = 0; i < song_list.length; i++) {
                let song = song_list[i];

                let li = createListItem(song.coverPath, song.songName, song.songBpm, song.songDuration, 'home', '', '', `/track/${song._id}`);

                li.setAttribute('data-id', song._id);
                
                let playButton = li.querySelector('.play-song');
                playButton.onclick = function() {newSong(this);};
                playButton.children[1].style.display = 'none';

                
                ul.appendChild(li);
            }

            let discography_list = document.querySelectorAll('.disc-item img');

            if (discography_list) {
                console.log(discography_list);

                for (let i = 0; i < discography_list.length; i++) {
                    /* console.log(discography_list[i].offsetWidth); */

                    discography_list[i].parentNode.style.height = discography_list[i].offsetWidth + 'px';

                    if ((i + 1) % 5 == 0) {
                        console.log('here');
                        console.log(discography_list[i]);
                        discography_list[i].parentNode.style.paddingRight = "0px";
                    }

                }
            }
        } else {
            end = true;
        }
    }
    
}
console.log(location.href);


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
    if (location.href.split(location.host)[1] === '/') {
        await testFetch(pageNum);
        pageNum++;
        
    
        console.log(song_list);

        let callback = (entries, observer) => {
            entries.forEach(async (entry) => {
                if (entry.isIntersecting) {
                    await testFetch(pageNum);
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
                let preview = document.querySelector('.search-preview-container');
                preview.style.display = 'none';
            }
        })
        

        document.querySelector('audio').addEventListener('ended', function() {
            console.log('Song finished');
            nextSong();
        })
    }
    
});