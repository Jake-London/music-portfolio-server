let createListItem = (imgPath, songName, songBpm, songDuration, type, dlPath, fileName, songHref) => {

    let li = document.createElement('li');
    li.classList.add('song-item');
    li.appendChild(createArtContainer(imgPath));
    li.appendChild(createTitleContainer(songName, songHref));
    li.appendChild(createBpmContainer(songBpm));
    li.appendChild(createLengthContainer(songDuration));
    li.appendChild(createButtonContainer(type, dlPath, fileName));
    return li;

}

let createArtContainer = (imgPath) => {

    let art = document.createElement('span');
    art.classList.add('art');
    art.appendChild(createImg(imgPath));

    return art;

}

let createImg = (path) => {
    let img = document.createElement('img');
    img.src = path;
    return img;
}

let createTitleContainer = (songName, songHref) => {
    let title = document.createElement('span');
    title.classList.add('title');
    title.appendChild(createTitleLink(songName, songHref));
    return title;
}

let createTitleLink = (songName, songHref) => {
    let title_link = document.createElement('a');
    title_link.classList.add('title-link');
    title_link.href = songHref;
    title_link.innerHTML = songName;
    return title_link;
}

let createBpmContainer = (songBpm) => {
    let bpm = document.createElement('span');
    bpm.classList.add('bpm');
    bpm.innerHTML = songBpm;
    return bpm;
}

let createLengthContainer = (songDuration) => {
    let length = document.createElement('span');
    length.classList.add('length');
    length.innerHTML = songDuration;
    return length;
}

let createButtonContainer = (type, dlPath, fileName) => {
    let btnCont = document.createElement('div');
    btnCont.classList.add('list-btn-container');
    if (type === 'dashboard') {
        btnCont.appendChild(createDownloadButton(dlPath, fileName));
        btnCont.appendChild(createDeleteButton());
        btnCont.appendChild(createSoldButton());
    } else {
        btnCont.appendChild(createPlayButton());
    }

    return btnCont;
}

let createDownloadButton = (dlPath, fileName) => {
    let dl = document.createElement('a');
    dl.classList.add('download-song');
    dl.href = dlPath;
    dl.download = fileName;
    dl.appendChild(createFontAwesomeIcon('fa-download'));
    return dl;
}

let createDeleteButton = () => {
    let del = document.createElement('span');
    del.classList.add('delete-song');
    del.appendChild(createFontAwesomeIcon('fa-trash-alt'));
    return del;
}

let createSoldButton = () => {
    let sold = document.createElement('span');
    sold.classList.add('sold-song');
    sold.appendChild(createFontAwesomeIcon('fa-dollar-sign'));
    return sold;
}

let createFontAwesomeIcon = (iconClass) => {
    let icon = document.createElement('i');
    icon.classList.add('fas');
    icon.classList.add(iconClass);
    return icon;
}

let createPlayButton = () => {
    let play = document.createElement('span');
    play.classList.add('play-song');
    play.appendChild(createFontAwesomeIcon('fa-play'));
    play.appendChild(createFontAwesomeIcon('fa-pause'));
    return play;
}