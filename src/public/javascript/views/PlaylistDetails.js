import AbstractView from "./AbstractView.js";
// import {categoryItems} from "./Category.js";
export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.id = params.id;
        this.setTitle("Playlist Details");
    }

    async getHtml(content) {
        const id = this.id;
        $.ajax({
            url: `http://localhost:3000/api/profile/me/playlists/${id}/data`,
            contentType: 'application/json',
            success: function (response) {
                const header =
                    ` 
                        <div class="content-wrapper">
                            <div class="playlist-header">
                                <div class="playlist-header-photo">
                                <img
                                src="https://e-cdns-images.dzcdn.net/images/cover/d41d8cd98f00b204e9800998ecf8427e/264x264-000000-80-0-0.jpg"
                                alt="">
                            </div>
                            <div class="playlist-header-info">
                                <div class="playlist-name">
                                    ${response.playlistName}
                                </div>
                                <div class="playlist-user">
                                    <i class="fas fa-user-tie playlist-user-photo"></i>
                                    ${response.username}
                                </div>
                                <div class="playlist-description">${response.description}</div>
                                    <div class="playlist-total-track"></div>
                                    <button class="track-listen" id="playlist-listen" data-id="${id}">
                                        <i class="far fa-play-circle"></i>
                                        LISTEN
                                    </button>
                                </div>
                                
                            </div>
                            <div class="playlist-actions">
                                <div class="playlist-edit">
                                    <ul class="playlist-edit-list">
                                        <li class="edit-playlist-item edit-playlist-btn">
                                            <i class="fas fa-pencil-alt"></i>
                                        </li>
                                        <li class="edit-playlist-item">
                                            <i class="fas fa-share-square"></i>
                                        </li>
                                        <li class="edit-playlist-item" data-toggle="modal" data-target="#delete-playlist-modal" data-id="${response._id}" id="btn-delete-playlist">
                                            <i class="far fa-trash-alt"></i>
                                        </li>
                                    </ul>
                                </div>
                                <div class="track-filter">
                                    <div class="track-filter-dropdown">
                                        <button class="filter-dropdown-default">
                                            <span class="content-dropdown">MANUAL</span>
                                            <i class="fas fa-chevron-down"></i>
                                        </button>
                                        <ul class="filter-dropdown-menu">
                                            <li class="filter-dropdown-item">Recently Added</li>
                                            <li class="filter-dropdown-item">A-Z (track)</li>
                                            <li class="filter-dropdown-item">A-Z (artist)</li>
                                            <li class="filter-dropdown-item">Manual</li>
                                        </ul>

                                    </div>
                                    <div class="track-filter-search">
                                        <input type="text" class="search-track" id="search-track" placeholder="Search within tracks" name="search-track">
                                    </div>
                                </div>
                                <button class="track-delete-btn" id="delete-playlist-track-btn" data-toggle="modal" data-target="#delete-track-modal">
                                    <i class="fas fa-trash-alt"></i>
                                    DELETE
                                </button>

                            </div>
                            <div class="playlist-tracks">
                                <form id="delete-track-from-playlist-form" class="content-wrapper-list-tracks" method="post" action="/api/playlist/delete/${id}?_method=PUT">
                                    <div class="content-title-tracks">
                                    <table class="table mt-4">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col"></th>
                                                <th scope="col">TRACK</th>
                                                <th scope="col">ARTIST</th>
                                                <th scope="col">
                                                    <i class="far fa-clock"></i>
                                                </th>
                                                <th scope="col">ADDED</th>
                                                <th scope="col">
                                                    <input type="checkbox" class="checkbox-all">
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                                    
                                        </tbody>
                                    </table>
                                </form>
                            </div>
                        </div>
                    </div>
                    `
                content.html(header);
                const listTracks = $('tbody');
                const totalTrack = $('.playlist-total-track');
                getData(id, listTracks, totalTrack);
                editPlaylist(response, id);
                deletePlaylist(id);

            }

        });

    }
}

function getData(id, listTracks, totalTrack) {
    $.ajax({
        url: `http://localhost:3000/api/profile/me/playlists/${id}/details`,
        contentType: 'application/json',
        success: function (response) {

            if (response.length != 1) {
                totalTrack.html(response.length + ' favorite tracks');
            } else {
                totalTrack.html('1 favorite tracks');
            }
            const htmls = response.map((song, index) => {
                return `
                <tr class="song hearted" data-id="${song.songId}">
                <th scope="row">${index + 1}</th>
                <td class="icon-favorite">
                  <i class="fas fa-heart icon-heart ${song.check === true ? 'active' : ''}" data-id="${song.songId}"></i>
                </td>
                <td class="song-title">${song.title}</td>
                <td class="song-singer">${song.singerName}</td>
                <td class="song-duration">${song.duration}</td>
                <td>${song.createdAt}</td>
                <td>
                  <input type="checkbox" class="icon-check" value=${song.songId} name="songIds[]">
                </td>
              </tr>
                    
                `
            })
            listTracks.html(htmls.join(""));
        }
    })
}

function editPlaylist(data, id) {
    const choosePhotoBtn = $('.modal-content-info-choose-btn');
    choosePhotoBtn.click(function () {
        $('#playlist-photo').click();
    });
    const closeModal = $('.modal-close');
    const editModal = $('#modal-playlist-edit');
    const editPlaylist = $('.edit-playlist-btn');
    const editForm = document.forms['edit-playlist-form'];
    editPlaylist.click(function () {
        editModal.css('display', 'block');
        $('.playlist-name-input')[1].value = data.playlistName;
        $('.playlist-description-input')[1].value = data.description;
        editForm.action = '/api/profile/me/playlists/' + id + '/edit' + '?_method=PUT';
    })
    closeModal.click(function () {
        editModal.css('display', 'none')
    });
}

function deletePlaylist(id) {
    const deleteForm = document.forms['delete-playlist-form'];
    $(document).ready(function () {
        $('#btn-delelte-playlist').click(function (e) {
            // e.preventDefault();
            deleteForm.action = '/api/profile/me/playlists/' + id + '/delete' + '?_method=DELETE';
            deleteForm.submit();
        })
    });
}
