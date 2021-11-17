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
                              <a href="/music/profile/me/loved" class="navbar-link">Favorite Tracks</a>
                            </li>
                            <li class="navbar-item">
                              <a href="/music/profile/me/playlists" class="navbar-link active">Playlists</a>
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
        const contentTab = $('.content-wrapper-container')
        const lineTab = document.querySelector('.navbar-line');
        const tabActived = document.querySelector('.navbar-link.active');
        lineTab.style.left = tabActived.offsetLeft + "px";
        lineTab.style.width = tabActived.offsetWidth + "px";
        changeTabLine("/music/profile/me/playlists");
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
    url: 'http://localhost:3000/api/profile/me/playlists/data',
    contentType: 'application/json',
    success: function (response) {
      const header =
        `
            <div class="content-wrapper-header">
              <div class="header-track">
                  <div class="total-playlist">
                   
                  </div>
              </div>
              <div class="track-filter">
                <div class="track-filter-dropdown">
                  <button class="filter-dropdown-default">
                    <span class="content-dropdown">ALL</span>
                    <i class="fas fa-chevron-down"></i>
                  </button>
                  <ul class="filter-dropdown-menu">
                    <li class="filter-dropdown-item">All</li>
                    <li class="filter-dropdown-item">Own Playlists</li>
                    <li class="filter-dropdown-item">Add Playlists</li>
                    <li class="filter-dropdown-item">Collaborative Playlists</li>
                  </ul>
                </div>
                <div class="track-filter-search">
                  <input type="text" class="search-track" id="search-track" placeholder="Search"
                    name="search-track">
                </div>  
              </div>  
            </div>
            <div class="content-wrapper-list-tracks">
              <div class="row content-wrapper-playlist">
                <div class="playlist-item playlist-create">
                    <i class="far fa-plus-square playlist-create-icon"></i>
                    <span class="playlist-create-text">Create a playlist</span>
                </div>
              </div>
            </div>
          `
      contentTab.html(header);
      const totalPlaylist = $('.total-playlist');
      if (response.length != 1) {
        totalPlaylist.html(response.length + ' playlists');
      } else {
        totalPlaylist.html('1 playlist');
      }
      const playlists = $('.content-wrapper-playlist');
      const data = response.map(playlist => {
        return `
            <a class="playlist-item playlist-item-created" href="/music/profile/me/playlists/${playlist._id}">
              <div class="playlist-item-photo">
                <img src="https://e-cdns-images.dzcdn.net/images/cover/d41d8cd98f00b204e9800998ecf8427e/264x264-000000-80-0-0.jpg">
              </div>
              <div class="playlist-item-name">${playlist.playlistName}</div>
              <div class="playlist-item-status">Public</div>
            </a>
          `

      })
      playlists.append(data.join(''));
      createPlaylist();
    }
  })
}

function createPlaylist() {
  const choosePhotoBtn = $('.modal-content-info-choose-btn');
  choosePhotoBtn.click(function () {
    $('#playlist-photo').click();
  });
  const createPlaylistBtn = $('.playlist-item.playlist-create');
  const closeModal = $('.modal-close');
  const createModal = $('#modal-playlist-create');
  createPlaylistBtn.click(function () {
    createModal.css('display', 'block')
  })
  closeModal.click(function () {
    createModal.css('display', 'none')
  })
}