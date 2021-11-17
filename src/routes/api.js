const express = require('express');
const router = express.Router();
const {ensureAuth, ensureGuest} = require('../middleware/auth');
const apiController =  require('../app/controllers/ApiController');

// login, signout
router.get('/signout', apiController.signout);

router.get('/data/song/:id', ensureAuth, apiController.getSong);
router.get('/user', ensureAuth, apiController.getUser);

// favorite Tracks 
router.get('/profile/me/loved/data',ensureAuth, apiController.getFavoriteTrack);

// Playlist
router.get('/profile/me/playlists/data',ensureAuth, apiController.getPlaylists);
router.get('/profile/me/playlists/:id/data',ensureAuth, apiController.getPlaylistInfo);
router.get('/profile/me/playlists/:id/details',ensureAuth, apiController.playlistDetails);
router.post('/profile/me/playlists/create',ensureAuth, apiController.createPlaylist);
router.delete('/profile/me/playlists/:id/delete',ensureAuth, apiController.deletePlaylist);
router.put('/profile/me/playlists/:id/edit',ensureAuth, apiController.editPlaylist);
router.get('/profile/me/playlists/:id/add/',ensureAuth, apiController.addTrackToPlaylist);

// category
router.get('/category/data',ensureAuth, apiController.getCategories);
router.get('/category/:slug',ensureAuth, apiController.categoryDetails);
router.get('/singer/details/:slug',ensureAuth, apiController.SingerDetails);

// search
router.post('/data',ensureAuth, apiController.getSearchData);
router.get('/search/:data',ensureAuth, apiController.getSearch);

// thêm, xóa bài hát yêu thích
router.get('/favorite/delete/:index',ensureAuth, apiController.deleteFavorite);
router.get('/favorite/add/:index',ensureAuth, apiController.addFavorite);
router.put('/favorite/delete',ensureAuth, apiController.deleteMultiFavorite);
router.put('/playlist/delete/:id',ensureAuth, apiController.deleteMultiTrack);
module.exports = router;

// edit account
router.post('/user/:id/edit',ensureAuth, apiController.editAccount);