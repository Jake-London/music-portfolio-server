let coverUpload = document.querySelector('#upload-art');
let discUpload = document.querySelector('#disc-upload-art');

let text = document.querySelectorAll('.preview-container span');
let img = document.querySelectorAll('.preview-container img');

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

document.addEventListener('DOMContentLoaded', async function(event) {
    if (location.href.split(location.host)[1] === '/admin' || location.href.split(location.host)[1] === '/admin/') {
        await testFetch();
    
        console.log(song_list);

        let ul = document.querySelector('.song-list');

        for (let i = 0; i < song_list.length; i++) {
            let song = song_list[i];
            
            let temp = song.songPath.split('/');
            let dlPath = `http://${location.host}${song.songPath}`;
            
            let li = createListItem(song.coverPath, song.songName, song.songBpm, song.songDuration, 'dashboard', dlPath, temp[temp.length - 1]);

            let del = li.querySelector('.delete-song');

            del.onclick = function() { deleteSong(song._id, this.parentNode.parentNode); };

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
    
});