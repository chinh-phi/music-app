import Music from "./views/Music.js";
import Category from "./views/Category.js";
import Browse from "./views/Browse.js";
import Profile from "./views/Profile.js";
import CategoryDetails from "./views/CategoryDetails.js";
import CategorySinger from "./views/CategorySinger.js";
import ProfileFavorite from "./views/ProfileFavorite.js";
import ProfilePlaylist from "./views/ProfilePlaylist.js";
import PlaylistDetails from "./views/PlaylistDetails.js";
import Search from "./views/Search.js";
import Account from "./views/Account.js";
const content = $('#page-content');

const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        { path: "/music", view: Music },
        { path: "/music/category", view: Category },
        { path: "/music/category/:slug", view: CategoryDetails },
        { path: "/music/singer/:slug", view: CategorySinger },
        { path: "/music/browse", view: Browse },
        { path: "/music/profile/me", view: Profile },
        { path: "/music/profile/me/loved", view: ProfileFavorite },
        { path: "/music/profile/me/playlists", view: ProfilePlaylist },
        { path: "/music/profile/me/playlists/:id", view: PlaylistDetails },
        { path: "/music/search/:value", view: Search },
        { path: "/music/account", view: Account },
    ];

    // Test each route for potential match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }

    const view = new match.route.view(getParams(match));

    await view.getHtml(content);

};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    sidebar();
    clickQueue();
    clickLyric();
    liveSearch();
    clickLiveSearch();
    clickAvatar();
    clickAccountHeader();
    clickAccountSetting();
    clickAction();
    search();
    router();
});



function sidebar() {
    const sidebar = $("#page-sidebar");
    const navLinkItems = $('.sidebar-nav-link');
    const line = $('#sidebar-nav-line');
    const href = window.location.href;
    const activeTab = document.querySelector('.sidebar-nav-link.active');
    activeTab.classList.remove('active');
    $('.sidebar-nav-link-icon.active').removeClass('active');
    for (let i = 0; i < navLinkItems.length; i++) {
        const item = navLinkItems[i];

        if (item.href === href) {
            const icon = item.firstElementChild;
            activeTab.classList.remove('active');

            $('.sidebar-nav-link-icon.active').removeClass('active');
            $('.sidebar-nav-label.active').removeClass('active');
            item.classList.add('active');
            icon.classList.add('active');
            line.css({ top: item.offsetTop + 'px', height: item.offsetHeight + 'px' });
        }
    }
    sidebar.click((e) => {
        e.preventDefault();
        const item = e.target.closest('.sidebar-nav-link');
        navigateTo(item.href);
        const icon = item.firstElementChild;

        $('.sidebar-nav-link.active').removeClass('active');
        $('.sidebar-nav-link-icon.active').removeClass('active');
        $('.sidebar-nav-label.active').removeClass('active');
        item.classList.add('active');
        icon.classList.add('active');
        line.css({ top: item.offsetTop + 'px', height: item.offsetHeight + 'px' });

        // handle();
    })
    handle();

}

function handle() {
    content.click((e) => {
        const itemCategoryDetails = e.target.closest('.category-item');
        const itemProfile = e.target.closest('.navbar-link');
        const itemPlaylist = e.target.closest('.playlist-item-created');
        const itemSingerCategory = e.target.closest('.category-item-singer');
        const itemBtnListenFT = e.target.closest('#track-listen');
        const itemBtnListenPlaylist = e.target.closest('#playlist-listen');
        if (itemCategoryDetails) {
            categoryDetails(e, itemCategoryDetails);
        } else if (itemProfile) {
            profile(e, itemProfile);
        } else if (itemPlaylist) {
            playlist(e, itemPlaylist);
        } else if (itemSingerCategory) {
            singerCategory(e, itemSingerCategory);
        } else if (itemBtnListenFT) {
            clickBtnListenFavoriteTracks(itemBtnListenFT);
        } else if (itemBtnListenPlaylist) {
            clickBtnListenPlaylist(itemBtnListenPlaylist);
        }
    })
}

// Khi click vào category-name --> category details
function categoryDetails(e, item) {
    e.preventDefault();
    navigateTo(item.href);
}

// Khi click vào thanh tab ở phần profile điều hướng sang trang chi tiết
function profile(e, item) {
    e.preventDefault();
    navigateTo(item.href);
}

// Khi click vào playlist điều hướng sang trang details
function playlist(e, item) {
    e.preventDefault();
    navigateTo(item.href);
}

// Khi click vào tên ca sĩ ở phần category thì điều hướng sang phần danh sách bài hát
function singerCategory(e, item) {
    e.preventDefault();
    navigateTo(item.href);
}

// Khi click vào nút queue
function clickQueue() {
    const btnQueue = $('.btn-queue');
    const queue = $('.page-queue');
    const sidebar = $('.page-sidebar');
    const topbar = $('.page-topbar');
    var isDisplay = false;
    btnQueue.click(function () {
        if (!isDisplay) {
            queue.css('display', 'block');
            queue.css('animation', 'fadeIn 0.8s');
            isDisplay = true;
        } else {
            queue.css('animation', 'fadeOut 0.8s');
            setTimeout(function () {
                queue.css('display', 'none');
            }, 800);


            isDisplay = false;
        }
    });

    const btnClose = $('.player-close i');
    btnClose.click(function () {
        queue.css('animation', 'fadeOut 0.8s');
        setTimeout(function () {
            queue.css('display', 'none');
        }, 800);
        isDisplay = false;
    })
}

// Khi click vào nút lyric
function clickLyric() {
    const btnLyric = $('.btn-lyric');
    const lyric = $('.page-lyric');
    const btnCloseLyric = $('.lyric-btn-close');
    var isDisplay = false;
    btnLyric.click(function () {
        if (!isDisplay) {
            lyric.css('display', 'block');
            lyric.css('animation', 'fadeIn 0.8s');
            isDisplay = true;
        } else {
            lyric.css('animation', 'fadeOut 0.8s');
            setTimeout(function () {
                lyric.css('display', 'none');
            }, 800);


            isDisplay = false;
        }
    });
    btnCloseLyric.click(function () {
        lyric.css('animation', 'fadeOut 0.8s');
        setTimeout(function () {
            lyric.css('display', 'none');
        }, 800);
        isDisplay = false;
    })
}

function search() {
    $(window).keydown((e) => {
        if (e.keyCode == 13) {
            e.preventDefault();
            const searchInput = $('#topbar-search-input');
            const value = searchInput.val();
            navigateTo(`/music/search/${value}`);
        }
    });
}

function clickHeartIcon(node) {
    const notification = $('.notification-tracks');
    if (node.classList.contains('active')) {
        node.classList.remove('active');
        $.ajax({
            url: `http://localhost:3000/api/favorite/delete/${node.dataset.id}`,
            contentType: 'application/json',
            success: function (response) {
                notification.text(response.message);
                notification.css('display', 'block');
                notification.css('animation', 'fadeRight 3s');
                setTimeout(function () {
                    notification.css('display', 'none');
                }, 1000);
                renderFavoriteTrack();

            }
        })

    } else {
        node.classList.add('active');
        $.ajax({
            url: `http://localhost:3000/api/favorite/add/${node.dataset.id}`,
            contentType: 'application/json',
            success: function (response) {
                notification.text(response.message);
                notification.css('display', 'block');
                notification.css('animation', 'fadeRight 3s');
                setTimeout(function () {
                    notification.css('display', 'none');
                }, 1000);
            }
        })
    }
}

function clickPlusIcon(isDisplay, node) {
    const choosePlaylistModal = node.nextElementSibling;
    const idSong = node.dataset.id;
    if (!isDisplay) {
        choosePlaylistModal.style.display = 'block';
        isDisplay = true;

        $.ajax({
            url: `http://localhost:3000/api/profile/me/playlists/data`,
            contentType: 'application/json',
            success: function (response) {
                const htmls = response.map((playlist, index) => {
                    return `
                                <li class="item-of-playlist" data-id="${playlist._id}">${playlist.playlistName}</li>
                            `
                })
                $('.list-of-playlist').html(htmls.join(''));
                AddSongToPlaylist(idSong);
            }
        });
    } else {
        choosePlaylistModal.style.display = 'none';
        isDisplay = false;
    }
}

var arrSong = [];

function clickSong(item) {
    $.ajax({
        url: `http://localhost:3000/api/data/song/${item.dataset.id}`,
        contentType: 'application/json',
        success: function (response) {
            arrSong.unshift(response);
            listen(arrSong);
            audio.play();
        }
    })
}

function clickAction() {
    const app = $('#deezer-app');
    var isDisplay = false;
    app.click((e) => {
        if (isDisplay) {
            isDisplay = false;
        } else {
            isDisplay = true;
        }
        const itemSong = e.target.closest('.song');
        const itemHeart = e.target.closest('.icon-heart');
        const itemPlus = e.target.closest('.icon-plus');
        const itemCheckbox = e.target.closest('.icon-check');
        const itemCheckboxAll = e.target.closest('.checkbox-all');
        if (itemHeart) {
            clickHeartIcon(itemHeart);
        } else if (itemPlus) {
            clickPlusIcon(isDisplay, itemPlus);
        } else if (itemCheckboxAll) {
            clickCheckboxAll(itemCheckboxAll);
        } else if (itemCheckbox) {
            clickItemCheckbox(itemCheckbox);
        } else if (itemSong) {
            clickSong(itemSong);
        }

    })
}

function AddSongToPlaylist(id) {
    $('.add-track-to-playlist').click((e) => {
        e.preventDefault();
        e.stopPropagation();
        const nodePlaylist = e.target.closest('.item-of-playlist');
        if (nodePlaylist) {
            const notification = $('.notification-tracks');
            $.ajax({
                url: `http://localhost:3000/api/profile/me/playlists/${nodePlaylist.dataset.id}/add?q=${id}`,
                contentType: 'application/json',
                success: function (response) {
                    notification.text(response.message);
                    notification.css('display', 'block');
                    notification.css('animation', 'fadeRight 3s');
                    setTimeout(function () {
                        notification.css('display', 'none');
                    }, 1000);
                }
            })
        }
    })
}

// Xử lý click vào ô search
const result = document.getElementById('search-result-list');
const closeIcon = $('.topbar-search-clear-icon');
const searchInput = $('#topbar-search-input');
searchInput.click(function () {
    result.classList.remove('hide');
    closeIcon.css('display', 'block');
    result.innerHTML = `
      <h6 class="search-header">Trending Searches</h6>
      <li class="search-result-item">abc</li>
      <li class="search-result-item">a</li>
      <li class="search-result-item">b</li>
      <li class="search-result-item">c</li>
    `
});

closeIcon.click(function () {
    result.classList.add('hide');
    closeIcon.css('display', 'none');
});

function liveSearch() {
    $('#topbar-search-input').keyup(function () {
        // console.log(this.value);
        if (this.value.length === 0) {
            result.classList.add('hide');
            closeIcon.css('display', 'none');
        } else {
            result.classList.remove('hide');
        }
        var regex = /^[A-Za-z\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]*/;
        let match = this.value.match(regex);
        let match2 = this.value.match(/\s*/);
        if (match2[0] === this.value) {
            result.innerHTML = '';
            return;
        }
        if (match.input === this.value) {
            fetch('/api/data', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({ payload: this.value })
            }).then(res => res.json()).then(data => {
                let payload = data.payload;
                result.innerHTML = '';
                if (payload.length < 1) {
                    result.innerHTML = '<li class="search-result-item">Sorry. Nothing Found</li>';
                    return;
                }
                payload.forEach((item, index) => {
                    if (!item.name) {
                        result.innerHTML += `<li class="search-result-item" data-id="${item._id}">${item.title}</li>`;
                    } else {
                        result.innerHTML += `<li class="search-result-item" data-id="${item._id}">${item.name}</li>`;
                    }
                });
            });
            return;
        }
        result.innerHTML = '';
    })
}

function clickLiveSearch() {
    result.onclick = function (e) {
        const resultNode = e.target.closest('.search-result-item');
        if (resultNode) {
            navigateTo(`/music/search/${resultNode.textContent}`);
        }
    }
}

function clickBtnListenFavoriteTracks(item) {
    if (item) {
        $.ajax({
            url: "http://localhost:3000/api/profile/me/loved/data",
            contentType: 'application/json',
            success: function (response) {
                listen(response);
                audio.play();
            }
        })
    }
}

function clickBtnListenPlaylist(item) {
    if (item) {
        const playlistId = item.dataset.id;
        $.ajax({
            url: `http://localhost:3000/api/profile/me/playlists/${playlistId}/details`,
            contentType: 'application/json',
            success: function (response) {
                listen(response);
                audio.play();
            }
        })
    }
}

function clickCheckboxAll(item) {
    const songItemCheckbox = $('input[name="songIds[]"]');
    var isCheckedAll = item.checked;
    songItemCheckbox.prop("checked", isCheckedAll);
    renderCheck();
    clickDeleteTrackBtn();
}

function clickItemCheckbox(item) {
    const songItemCheckbox = $('input[name="songIds[]"]');
    var isCheckedAll = songItemCheckbox.length === $('input[name="songIds[]"]:checked').length;
    $('.checkbox-all').prop('checked', isCheckedAll);
    renderCheck();
    clickDeleteTrackBtn();
}

function renderCheck() {
    var checkedCount = $('input[name="songIds[]"]:checked').length;
    if (checkedCount > 0) {
        $('.track-delete-btn').addClass('active');
    } else {
        $('.track-delete-btn').removeClass('active');
    }
}

function clickDeleteTrackBtn() {

    $('#delete-favorite-track-btn').click((e) => {
        const deleteTrack = $('#delete-track-form');
        $('#btn-delelte-track').click(function (e) {
            deleteTrack.submit();
        })
    });

    $('#delete-playlist-track-btn').click((e) => {
        const deleteTrackPlaylist = $('#delete-track-from-playlist-form');
        $('#btn-delelte-track').click(function (e) {
            deleteTrackPlaylist.submit();
        })
    })

}

function renderFavoriteTrack() {
    $.ajax({
        url: 'http://localhost:3000/api/profile/me/loved/data',
        contentType: 'application/json',
        success: function (response) {
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
                      <input type="checkbox" class="icon-check" value="${song.songId}" name="songIds[]">
                    </td>
                  </tr>
            `
            })
            listTracks.html(htmls.join(""));
        }
    })
}

// Click vào avatar
function clickAvatar() {
    $('.topbar-profile').click((e) => {
        $('.account-manage').css('display', 'block');
    })
}

// click vào account header
function clickAccountHeader() {
    $('.account-manage-header').click((e) => {
        e.preventDefault();
        const item = e.target.closest('.account-manage-header');
        if (item) {
            navigateTo(item.href);
            $('.account-manage').css('display', 'none');
        }
    })
}

// function click account setting
function clickAccountSetting() {
    $('#account-manage-content-setting').click((e) => {
        e.preventDefault();
        const item = e.target.closest('#account-manage-content-setting');
        if (item) {
            navigateTo(item.href);
            $('.account-manage').css('display', 'none');
        }
    })
}

// Khai báo biến dùng cho việc xử lý nghe nhạc
const thumbnail = $('.queuelist-cover-thumbnail img');
const title = $('.queuelist-cover-title a');
const subtitle = $('.queuelist-cover-subtitle a');
const audio = document.querySelector('#audio');
const playBtn = $('.control-item-toggle-play');
const marquee = $('.marquee-content a');
const counterCurrent = $('.slider-counter-current');
const counterMax = $('.slider-counter-max');
const sliderInput = document.querySelector('.slider-track-input');
const sliderDefault = $('.slider-track-default');
const nextBtn = $('#control-item-icon-forward');
const prevBtn = $('#control-item-icon-backward');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const volumeBtn = $('.btn-volume-toggle');
const volumeSlider = document.querySelector('.option-item-list-item-volume');
const playlists = $('.queuelist-grid-content');
const numberOfTrack = $('.queuelist-subtitle');
const iconHeart = $('.track-actions-icon.icon-heart');
function listen(songs, state) {
    const app = {
        currentIndex: 0,
        isPlaying: false,
        isRandom: false,
        isRepeat: false,
        isMute: false,
        isActive: false,

        renderSong: function () {
            var totalTime = 0;
            const htmls = songs.map((song, index) => {
                return `
                    <div class="data-item ${index === this.currentIndex ? 'active-song' : ''}" data-index="${index}">
                    <div class="data-item-thumbnail">
                        <img
                        src="${song.img}"
                        alt="">
                    </div>
                    <div class="data-item-song">${song.title}</div>
                    <div class="data-item-actions">
                        <i class="data-item-actions-icon fas fa-ellipsis-h"></i>
                    </div>
                    <div class="data-item-singer">${song.singerName}</div>
                    <div class="data-item-duration">${song.duration}</div>
                    </div>
                `
            })
            var minutes = 0;
            var seconds = 0;
            for (let i = 0; i < songs.length; i++) {
                var time = songs[i].duration.split(":");
                minutes += Number(time[0]);
                seconds += Number(time[1]);
            }
            minutes += Math.floor(seconds / 60);
            seconds = seconds - minutes * 60;
            const hour = Math.floor(minutes / 60);
            minutes = minutes - hour * 60;

            numberOfTrack.text(` · ${songs.length} tracks · ${hour} hrs ${minutes} mins`)
            playlists.html(htmls.join(''));
        },

        renderLyric: function () {
            const index = this.currentIndex;
            const songLyric = this.currentSong.Lyric;

            const htmls = songLyric.map(lyric => {
                return `
                    <li class="lyric-line">${lyric}</li>
                `
            })

            $('.lyric-content-list').html(htmls);
        },

        defineProperties: function () {
            Object.defineProperty(this, 'currentSong', {
                get: function () {
                    return songs[this.currentIndex];
                }
            })
        },

        handleEvents: function () {

            const _this = this;

            // Xử lý khi click play
            playBtn.click(function () {
                if (_this.isPlaying) {
                    audio.pause();
                } else {
                    audio.play();
                }
            });

            // Xử lý khi bài hát play
            audio.onplay = function () {
                _this.isPlaying = true;
                playBtn.addClass('playing');
            }

            // Xử lý bài hát khi pause
            audio.onpause = function () {
                _this.isPlaying = false;
                playBtn.removeClass('playing');
            }

            // Xử lý khi tua bài hát
            sliderInput.onchange = function (e) {
                const seekTime = audio.duration * e.target.value / 100;
                audio.currentTime = seekTime;
            };

            // Xử lý khi tiến độ bài hát thay đổi
            audio.ontimeupdate = function () {
                if (audio.duration) {
                    const percent = Math.floor(audio.currentTime / audio.duration * 100);
                    var minutes = Math.floor(audio.currentTime / 60);
                    var seconds = Math.floor(audio.currentTime - minutes * 60);
                    if (seconds < 10) {
                        seconds = '0' + seconds;
                    }
                    if (minutes < 10) {
                        minutes = '0' + minutes;
                    }

                    counterCurrent.html(minutes + ":" + seconds);

                    sliderInput.value = percent;
                    sliderDefault.css('width', percent + '%');
                    sliderDefault.css('background-color', '#9c4444');

                }
            };

            // Xử lý khi next bài hát
            nextBtn.click(function () {
                if (_this.isRandom) {
                    _this.randomSong();
                } else {
                    _this.nextSong();
                }
                audio.play();
                _this.activeSong();
            });

            // Xử lý khi lùi bài hát
            prevBtn.click(function () {
                if (_this.isRandom) {
                    _this.randomSong();
                } else {
                    _this.prevSong();
                }
                audio.play();
                _this.activeSong();
            });

            // Xử lý khi click random bài hát
            randomBtn.click(function (e) {
                _this.isRandom = !_this.isRandom;
                this.firstElementChild.classList.toggle("icon-active", _this.isRandom);
            });

            // Xử lý khi click phát lại bài hát 
            repeatBtn.click(function (e) {
                _this.isRepeat = !_this.isRepeat;
                this.firstElementChild.classList.toggle("icon-active", _this.isRepeat);
            })

            // Xử lý khi bài hát kết thúc
            audio.onended = function () {
                if (_this.isRepeat) {
                    audio.play();
                } else {
                    nextBtn.click();
                }
            }

            // Xử lý khi click vào nút âm lượng
            volumeBtn.click(function (e) {
                if (_this.isMute) {
                    audio.volume = volumeSlider.value / 100;
                    this.classList.remove("muted");
                    _this.isMute = false;
                } else {
                    audio.volume = 0;
                    this.classList.add("muted");
                    _this.isMute = true;
                }
            })

            // Xử lý khi thay đổi thanh âm lượng
            volumeSlider.onchange = function (e) {
                audio.volume = e.target.value / 100;
                _this.isMute = true;
            }

            // Xử lý khi click vào Playlists
            playlists.click(function (e) {
                const songNode = e.target.closest('.data-item:not(.active-song)');
                // const actionNode = e.target.closest('.data-item-actions-icon');
                // const addFavoriteNode = e.target.closest('.data-item-add-favorite-icon');

                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.activeSong();
                    _this.loadCurrentSong();
                    audio.play();
                }


            })

        },

        activeSong: function () {
            const song = $('.data-item');
            const songActived = $('.data-item.active-song');
            songActived.removeClass('active-song');
            song[this.currentIndex].classList.add('active-song');
        },

        nextSong: function () {
            this.currentIndex++;
            if (this.currentIndex > songs.length - 1) {
                this.currentIndex = 0;
            }

            this.loadCurrentSong();
        },

        prevSong: function () {
            this.currentIndex--;
            if (this.currentIndex < 0) {
                this.currentIndex = songs.length - 1;
            }

            this.loadCurrentSong();
        },

        randomSong: function () {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * songs.length);
            } while (newIndex === this.currentIndex);

            this.currentIndex = newIndex;
            this.loadCurrentSong();
        },

        loadCurrentSong: function () {
            thumbnail.attr("src", this.currentSong.img);
            title.text(this.currentSong.title);
            subtitle.text(this.currentSong.singerName);
            audio.src = "http://docs.google.com/uc?export=open&id=" + this.currentSong.path;
            marquee[0].textContent = this.currentSong.title;
            marquee[1].textContent = this.currentSong.singerName;
            counterMax.text(this.currentSong.duration);
            this.renderLyric();
        },

        start: function () {
            this.defineProperties();
            this.handleEvents();
            this.loadCurrentSong();
            this.renderSong();
            this.renderLyric();
        }
    }
    app.start();
}