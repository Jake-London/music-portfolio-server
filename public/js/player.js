let volume_slider = document.querySelector('.volume-slider');
let seek_slider = document.querySelector('.seek-slider');

let current_track = document.createElement('audio');
document.body.appendChild(current_track);

let current_song_item;
let song_list = [];

let current_index;
let min_index = 0;

let isPlaying = false;
let isMuted = false;

let updateTimer;

/* Update state (play/pause) of the current track and update icons */
let setPlayState = (id) => {

    console.log('setPlayState');

    /* Select the player play/pause buttons and the play/pause button of the song in the displayed track list */
    let playerPlayButton = document.querySelector('.player-play').children[0];
    let playerPauseButton = document.querySelector('.player-play').children[1];
    let listItemPlayButton = current_song_item.querySelector(id).children[0];
    let listItemPauseButton = current_song_item.querySelector(id).children[1];

    /* If nothing is playing, start playing track and display pause button */
    if (isPlaying === false) {
        playerPlayButton.style.display = "none";
        playerPauseButton.style.display = "inline";

        listItemPlayButton.style.display = "none";
        listItemPauseButton.style.display = "inline";

        current_track.play();
    } else if (isPlaying === true) {
        /* If track is playing, pause track and display play button  */
        playerPauseButton.style.display = "none";
        playerPlayButton.style.display = "inline";
        
        listItemPauseButton.style.display = "none";
        listItemPlayButton.style.display = "inline";
        
        current_track.pause();
    }

    /* Update state indicator to current state */
    isPlaying = !isPlaying;

    console.log("Playing song: " + isPlaying);
}

/* Volume toggle when megaphone icon is clicked */
let toggleVolume = () => {

    /* Select relevant icon elements */
    let unmuted = document.querySelector('.fa-volume-up');
    let muted = document.querySelector('.fa-volume-mute');

    /* Display opposite icon when pressed (click mute icon, becomes unmuted, and vice versa) */
    if (isMuted === false) {
        unmuted.style.display = "none";
        muted.style.display = "inline";
    } else if (isMuted === true) {
        muted.style.display = "none";
        unmuted.style.display = "inline";
    }

    /* Update sound state indicator to current state */
    isMuted = !isMuted;

    /* If updated state is not muted, set volume to 50% */
    if (!isMuted) {
        current_track.volume = 50 / 100;
        volume_slider.value = 50;
    } else {
        /* Otherwise, mute audio */
        current_track.volume = 0;
    }

}

/* Volume slider handler */
let setVolume = () => {

    /* Select relevant icon elements */
    let unmuted = document.querySelector('.fa-volume-up');
    let muted = document.querySelector('.fa-volume-mute');

    /* Get current value of slider */
    let value = volume_slider.value;
    console.log(value);

    
    /* Adjust muted/unmuted icon when slider hits lowest value */
    if (value === "1") {
        unmuted.style.display = "none";
        muted.style.display = "inline";
        isMuted = true;
    } else {
        muted.style.display = "none";
        unmuted.style.display = "inline";
        isMuted = false;
    }

    /* Update volume value based on slider value */
    if (!isMuted) {
        current_track.volume = volume_slider.value / 100;
    } else {
        current_track.volume = 0;
    }

}

/* Click & drag to adjust current time in the song */
let seek = () => {
    current_track.currentTime = current_track.duration * (seek_slider.value / 10000);
}

/* Update the visual indicator for current track time (seek_slider) */
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
    console.log(song_list, current_index);
    
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