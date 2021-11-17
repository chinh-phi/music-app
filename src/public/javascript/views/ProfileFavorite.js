import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Profile");
  }

  async getHtml(content) {
    $.ajax({
      url: 'http://localhost:3000/api/user',
      contentType: 'application/json',
      success: function (response) {
        const header = `<div class="profile-header-container">
                    <div class="container-wrapper">
                      <div class="profile-user">
                        <div class="profile-container">
                          <div class="profile-photo">
                            <img src="https://e-cdns-images.dzcdn.net/images/user/d41d8cd98f00b204e9800998ecf8427e/264x264-000000-80-0-0.jpg" alt="">
                          </div>
                          <div class="profile-informations">
                            <div class="profile-name">${response.name}</div>
                            <button class="profile-actions">
                              <i class="fas fa-random"></i>
                              SHUFFLE MY MUSIC
                            </button>
                          </div>
                        </div>
                      </div>
                      <div class="navbar-tab">
                        <div class="navbar-container">
                          <ul class="navbar-list">
                            <li class="navbar-item">
                              <a href="/music/profile/me" class="navbar-link">Highlights</a>
                            </li>
                            <li class="navbar-item">
                              <a href="/music/profile/me/loved" class="navbar-link active">Favorite Tracks</a>
                            </li>
                            <li class="navbar-item">
                              <a href="/music/profile/me/playlists" class="navbar-link">Playlists</a>
                            </li>
                            <div class="navbar-line"></div>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="naboo-catalog-content-wrapper">
                    <div class="content-wrapper-container">
  
                    </div>
                  </div>`

        content.html(header);
        const contentTab = $('.content-wrapper-container');
        const lineTab = document.querySelector('.navbar-line');
        const tabActived = document.querySelector('.navbar-link.active');
        lineTab.style.left = tabActived.offsetLeft + "px";
        lineTab.style.width = tabActived.offsetWidth + "px";
        changeTabLine("/music/profile/me/loved");
        getData(contentTab);
      }
    })
  }


}

function changeTabLine(link) {
  $('.sidebar-nav-link.active').removeClass('active');
  $('.sidebar-nav-link-icon.active').removeClass('active');
  $('.sidebar-nav-label.active').removeClass('active');
  const item1 = $(`.sidebar-nav-link[href="${link}"]`);
  const icon1 = item1.children()[0];
  const line1 = document.querySelector('#sidebar-nav-line')
  item1.addClass('active');
  icon1.classList.add('active');
  const top = item1.offset().top - item1.offsetParent().offset().top;
  line1.style.top = top + "px";
  line1.style.height = Math.ceil(item1.height()) + 'px';
}

function getData(contentTab) {
  $.ajax({
    url: 'http://localhost:3000/api/profile/me/loved/data',
    contentType: 'application/json',
    success: function (response) {

      const header = `
            <div class="content-wrapper-header">
              <div class="header-track">
                <div class="total-track">
                  
                </div>
                <button class="track-listen" id="track-listen">
                  <i class="far fa-play-circle"></i>
                  LISTEN
                </button>
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
                  <input type="text" class="search-track" id="search-track" placeholder="Search within tracks"
                    name="search-track">
                </div>
              </div>
              <button class="track-delete-btn" id="delete-favorite-track-btn" data-toggle="modal" data-target="#delete-track-modal">
                <i class="fas fa-trash-alt"></i>
                DELETE
              </button>
            </div>
            <form id="delete-track-form" class="content-wrapper-list-tracks" method="post" action="/api/favorite/delete?_method=PUT">
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
              </div>
            </form>
            
        `
      contentTab.html(header);
      const listTracks = $('tbody');
      const totalTrack = $('.total-track');
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
                  <i class="fas fa-heart icon-heart active" data-id="${song.songId}"></i>
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