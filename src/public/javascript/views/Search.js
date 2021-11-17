import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.value = params.value;
        this.setTitle("Search");
    }

    async getHtml(content) {
        const searchInput = $('#topbar-search-input');
        const value = nonAccentVietnamese(this.value);
        const result = document.getElementById('search-result-list');
        searchInput.val("");
        result.classList.add('hide');
        $.ajax({
            url: `http://localhost:3000/api/search/${value}`,
            contentType: 'application/json',
            success: function (response) {
                const header =
                    `
                    <div class="category-container">
                        <div class="playlist-tracks">
                            <h2 class="title-search-result">Tracks</h2>
                            <div class="content-wrapper-tracks">
                                <div class="content-header-tracks">
                                    <div class="track-header-title content-header-tracks-item">TRACK</div>
                                    <div class="track-header-singer content-header-tracks-item">ARTIST</div>
                                    <div class="track-header-duration content-header-tracks-item">
                                        <i class="far fa-clock"></i>
                                    </div>
                                </div>
                                <div class="content-list-tracks">

                                </div>
                            </div>
                            
                        </div>
                        <div class="playlist-singer">
                            <h2 class="title-search-result">Artists</h2>
                            <div class="content-wrapper-tracks">
                            <div class="category-content">
                                <div class="category-list row">
                                
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                `
                content.html(header);

                const tracks = response[0].map((song, index) => {
                    return `
                    <div class="content-list-tracks-item song ${song.check === true ? 'hearted' : ''}" data-id="${song.songId}">
                    <div class="track-content-title content-content-tracks-item">
                      <div class="track-content-title-info song-title">
                        <img class="track-content-title-img"
                          src="${song.img}"
                          alt="">
                        ${song.title}
                      </div>
                      <div class="track-content-title-actions">
                        <div class="track-content-title-actions-item">
                          <i class="fas fa-music track-content-title-actions-icon"></i>
                        </div>
                        <div class="track-content-title-actions-item">
                          <i class="fas fa-heart track-content-title-actions-icon icon-heart ${song.check === true ? 'active' : ''}" data-id="${song.songId}"></i>
                        </div>
                        <div class="track-content-title-actions-item">
                          <i class="fas fa-plus track-content-title-actions-icon icon-plus" data-id="${song.songId}"></i>
                          <div class="add-track-to-playlist">
                            <div class="add-track-to-playlist-content">
                              <div class="header-of-list">Choose playlist</div>
                              <ul class="list-of-playlist">
                                
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="track-content-singer content-content-tracks-item song-singer">${song.singerName}</div>
                    <div class="track-content-duration content-content-tracks-item song-duration">
                      ${song.duration}
                    </div>
                  </div>
                    `
                })
                $('.content-list-tracks').html(tracks.join(''));

                const singers = response[1].map((singer, index) => {
                    return `
                    <a href="/music/singer/${singer.slug}" class="category-item-singer category-item-link-singer">
                        <img src="${singer.img}" alt="" class="category-item-photo-singer">
                        <div class="category-name">${singer.name}</div>
                    </a>
                    `
                })
                $('.category-list').html(singers.join(''));
            }
        })

    }
}

function nonAccentVietnamese(str) {
    str = str.toLowerCase();
    //     We can also use this instead of from line 11 to line 17
    str = str.replace(/\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g, "a");
    str = str.replace(/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g, "e");
    str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
    str = str.replace(/\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g, "o");
    str = str.replace(/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g, "u");
    str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
    str = str.replace(/\u0111/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
}

