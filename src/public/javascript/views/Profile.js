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
                              <a href="/music/profile/me" class="navbar-link active">Highlights</a>
                            </li>
                            <li class="navbar-item">
                              <a href="/music/profile/me/loved" class="navbar-link ">Favorite Tracks</a>
                            </li>
                            <li class="navbar-item">
                              <a href="/music/profile/me/playlists" class="navbar-link ">Playlists</a>
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
        const lineTab = document.querySelector('.navbar-line');
        const tabActived = document.querySelector('.navbar-link.active');
        lineTab.style.left = tabActived.offsetLeft + "px";
        lineTab.style.width = tabActived.offsetWidth + "px";
        changeTabLine("/music/profile/me");
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