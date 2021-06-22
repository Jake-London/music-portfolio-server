let trackPlaying = false;
current_song_item = null;

document.querySelector('.track-play').children[1].style.display = 'none';

let playTrack = () => {
    


    
    if (current_song_item) {
        setPlayState('.track-play');
    } else {
        isPlaying = true;
        let player = document.querySelector(".player");
        let footer = document.querySelector(".footer");
    
        footer.style.marginBottom = '82px';
        player.style.display = "block";

        current_song_item = document.querySelector('.track');
    
        let song_container = document.querySelector('.content-container');
        song_container.style.marginBottom = player.offsetHeight + 'px';
    
        setPlayer(trackInfo, document.querySelector('.track-play'));
    }


    

    
}