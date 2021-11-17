import AbstractView from "./AbstractView.js";
// import {categoryItems} from "./Category.js";
export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.slug = params.slug;
        this.setTitle("Category Singer");
    }

    async getHtml(content) {
        const slug = this.slug;
        $.ajax({
            url: `http://localhost:3000/api/singer/details/${slug}`,
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
                        </div>
                    `
                content.html(header);

                const tracks = response.map((song, index) => {
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
            }
        })
    }
}
