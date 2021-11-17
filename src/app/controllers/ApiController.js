const { multipleMongooseToObject } = require('../../util/mongoose');
const Song = require('../models/Song');
const { userGoogle, User } = require('../models/User');
const FavoriteTrack = require('../models/FavoriteTrack');
const Singer = require('../models/Singer');
const Playlist = require('../models/Playlist');
const Category = require('../models/Category');
var bcrypt = require('bcryptjs');
class ApiController {

    signout(req, res, next) {
        req.logout();
        req.session.destroy();
        res.redirect('/signout');
    }

    async getSong(req, res, next) {
        try {
            const song = await Song.findOne({ songId: req.params.id });
            var singerArr = [];
            let data = "";
            const { _id, songId, title, Lyric, path, duration, img, singers, createdAt, updatedAt } = song;
            if (song.singers.length == 1) {
                let singer = await Singer.findOne({ singerId: song.singers[0] });
                const singerName = singer.name;
                data = { _id, songId, title, Lyric, path, duration, img, singers, createdAt, updatedAt, singer, singerName }
            } else {
                var singerName = [];
                for (let j = 0; j < song.singers.length; j++) {
                    let singer = await Singer.findOne({ singerId: song.singers[j] });
                    singerArr.push(singer);
                    singerName.push(singer.name);
                }
                const singer = singerArr;
                data = { _id, songId, title, Lyric, path, duration, img, singers, createdAt, updatedAt, singer, singerName }
            }
            res.json(data)

        } catch (error) {
            res.send('Error' + error);
        }
    }

    async getUser(req, res, next) {
        try {
            const user = await User.findOne({ _id: req.session.user._id });
            const name = user.username;
            const email = user.email;
            const id = user._id;
            res.json({ id, name, email });
        } catch (error) {
            res.send('Error' + error);
        }
    }

    async getCategories(req, res, next) {
        try {
            const categories = await Category.find();
            res.json(categories);
        } catch (error) {
            res.send('Error' + error);
        }
    }

    async categoryDetails(req, res, next) {
        try {
            const data = await Category.findOne({ slug: req.params.slug });
            const singers = data.singers;
            const singerInfo = await Singer.find({ singerId: singers });
            res.json(singerInfo);
        } catch (error) {
            res.send('Error' + error);
        }
    }

    async getFavoriteTrack(req, res, next) {
        try {
            const user = await User.findOne({ _id: req.session.user._id }).populate('favoriteTrackId');
            const favoriteTrack = await FavoriteTrack.findOne({ _id: user.favoriteTrackId._id });
            const songsId = favoriteTrack.songId;
            const listSong = await Song.find({ songId: songsId });
            var singerArr = [];
            var dataArr = [];
            for (let i = 0; i < listSong.length; i++) {
                const { _id, songId, title, Lyric, path, duration, img, singers, createdAt, updatedAt } = listSong[i];
                if (listSong[i].singers.length == 1) {
                    let singer = await Singer.findOne({ singerId: listSong[i].singers[0] });
                    const singerName = singer.name;
                    const x = { _id, songId, title, Lyric, path, duration, img, singers, createdAt, updatedAt, singer, singerName }
                    dataArr.push(x);
                } else {
                    var singerName = [];
                    for (let j = 0; j < listSong[i].singers.length; j++) {
                        let singer = await Singer.findOne({ singerId: listSong[i].singers[j] });
                        singerArr.push(singer);
                        singerName.push(singer.name);
                    }
                    const singer = singerArr;
                    const x = { _id, songId, title, Lyric, path, duration, img, singers, createdAt, updatedAt, singer, singerName }
                    dataArr.push(x);
                }
            }
            res.json(dataArr);
        } catch (error) {
            res.send('Error' + error);
        }
    }

    async getPlaylists(req, res, next) {
        try {
            const playlist = await User.findOne({ _id: req.session.user._id }).populate('playlistId');
            const data = playlist.playlistId;
            res.json(data);
        } catch (error) {
            res.send('Error' + error);
        }
    }

    async playlistDetails(req, res, next) {
        try {
            const data = await Playlist.findOne({ _id: req.params.id });
            const songsId = data.songId;
            const listSong = await Song.find({ songId: songsId });

            const checkSong = [];
            const user = await User.findOne({ _id: req.session.user._id });
            const favoriteTrack = await FavoriteTrack.findOne({ favoriteTrackId: user.favoriteTrackId });
            const fTrackId = favoriteTrack.songId;
            for (let i = 0; i < listSong.length; i++) {
                checkSong[i] = false;
                if (fTrackId.includes(listSong[i].songId)) {
                    checkSong[i] = true;
                }
            }

            var singerArr = [];
            var dataArr = [];
            for (let i = 0; i < listSong.length; i++) {
                const { _id, songId, title, Lyric, path, duration, img, singers, createdAt, updatedAt } = listSong[i];
                const check = checkSong[i];
                if (listSong[i].singers.length == 1) {
                    let singer = await Singer.findOne({ singerId: listSong[i].singers[0] });
                    const singerName = singer.name;
                    const x = { _id, songId, title, Lyric, path, duration, img, singers, createdAt, updatedAt, singer, singerName, check }
                    dataArr.push(x);
                } else {
                    var singerName = [];
                    for (let j = 0; j < listSong[i].singers.length; j++) {
                        let singer = await Singer.findOne({ singerId: listSong[i].singers[j] });
                        singerArr.push(singer);
                        singerName.push(singer.name);
                    }
                    const singer = singerArr;
                    const x = { _id, songId, title, Lyric, path, duration, img, singers, createdAt, updatedAt, singer, singerName, check }
                    dataArr.push(x);
                }
            }
            res.json(dataArr);
        } catch (error) {
            res.send('Error' + error);
        }
    }

    async deletePlaylist(req, res, next) {
        try {
            await Playlist.deleteOne({ _id: req.params.id });
            const user = await User.findOne({ _id: req.session.user._id });
            const PlaylistFilter = user.playlistId.filter((value, index) => {
                return value.toString() != req.params.id.toString();
            })
            user.playlistId = PlaylistFilter;
            await user.save();
            res.redirect('/music/profile/me/playlists');
        } catch (error) {
            res.send('Error' + error);
        }
    }

    async editPlaylist(req, res, next) {
        try {
            await Playlist.updateOne({ _id: req.params.id }, req.body);
            res.redirect(`/music/profile/me/playlists/${req.params.id}`);
        } catch (error) {

        }
    }

    async addTrackToPlaylist(req, res, next) {
        // console.log(req.params.id, req.query.q);
        const playlistId = req.params.id;
        const songId = req.query.q;
        const playlist = await Playlist.findOne({ _id: playlistId });
        const listSong = playlist.songId;
        if (listSong.includes(songId)) {
            res.json({ message: "These track have already been added to the playlist" });
        } else {
            listSong.push(songId);
        }
        playlist.save();
        res.json({ message: "Added to playlist" })

    }

    async getSearchData(req, res, next) {
        let payload = req.body.payload.trim();
        let search1 = await Song.find({ title: { $regex: new RegExp('^' + payload + '.*', 'i') } }).exec();
        let search2 = await Singer.find({ name: { $regex: new RegExp('^' + payload + '.*', 'i') } }).exec();
        search1 = search1.slice(0, 10);
        search2 = search2.slice(0, 10);
        let search = [...search1, ...search2];
        res.send({ payload: search });
    }

    async getSearch(req, res, next) {
        let payload = req.params.data.toLowerCase();
        const result1 = await Song.find({ title: { $regex: new RegExp('^' + payload + '.*', 'i') } }).exec();
        // kiểm tra xem bài hát có nằm trong favorite track ko
        const checkSong = [];
        const user = await User.findOne({ _id: req.session.user._id });
        const favoriteTrack = await FavoriteTrack.findOne({ favoriteTrackId: user.favoriteTrackId });
        const fTrackId = favoriteTrack.songId;
        for (let i = 0; i < result1.length; i++) {
            checkSong[i] = false;
            if (fTrackId.includes(result1[i].songId)) {
                checkSong[i] = true;
            }
        }

        // xử lý lấy tên ca sĩ
        var singerArr = [];
        var dataArr = [];
        for (let i = 0; i < result1.length; i++) {
            const { _id, songId, title, Lyric, path, duration, img, singers, createdAt, updatedAt } = result1[i];
            const check = checkSong[i];
            if (result1[i].singers.length == 1) {
                let singer = await Singer.findOne({ singerId: result1[i].singers[0] });
                const singerName = singer.name;
                const x = { _id, songId, title, Lyric, path, duration, img, singers, createdAt, updatedAt, singer, singerName, check }
                dataArr.push(x);
            } else {
                var singerName = [];
                for (let j = 0; j < result1[i].singers.length; j++) {
                    let singer = await Singer.findOne({ singerId: result1[i].singers[j] });
                    singerArr.push(singer);
                    singerName.push(singer.name);
                }
                const singer = singerArr;
                const x = { _id, songId, title, Lyric, path, duration, img, singers, createdAt, updatedAt, singer, singerName, check }
                dataArr.push(x);
            }
        }

        const result2 = await Singer.find({ name: { $regex: new RegExp('^' + payload + '.*', 'i') } }).exec();
        let result = [];
        result.push(dataArr, result2);
        res.json(result);
    }

    async createPlaylist(req, res, next) {
        const playlist = new Playlist(req.body);
        const user = await User.findOne({ _id: req.session.user._id });
        user.playlistId.push(playlist._id);
        user.save();
        playlist.save();

        res.redirect('/music/profile/me/playlists');

    }

    async getPlaylistInfo(req, res, next) {
        try {
            const user = await User.findOne({ _id: req.session.user._id });
            const username = user.username;
            const data = await Playlist.findOne({ _id: req.params.id });
            const { _id, playlistName, description, songId } = data;
            const x = { _id, playlistName, description, songId, username };
            res.json(x)
        } catch (error) {

        }
    }

    async SingerDetails(req, res, next) {
        const singer = await Singer.findOne({ slug: req.params.slug });
        const songs = singer.songs;
        const songList = await Song.find({ songId: songs })

        // kiểm tra xem bài hát có nằm trong favorite track ko
        const checkSong = [];
        const user = await User.findOne({ _id: req.session.user._id });
        const favoriteTrack = await FavoriteTrack.findOne({ favoriteTrackId: user.favoriteTrackId });
        const fTrackId = favoriteTrack.songId;
        for (let i = 0; i < songs.length; i++) {
            checkSong[i] = false;
            if (fTrackId.includes(songs[i])) {
                checkSong[i] = true;
            }
        }

        // Xử lý lấy tên ca sĩ
        var singerArr = [];
        var dataArr = [];
        for (let i = 0; i < songList.length; i++) {
            const { _id, songId, title, Lyric, path, duration, img, singers, createdAt, updatedAt } = songList[i];
            const check = checkSong[i];
            if (songList[i].singers.length == 1) {
                let singer = await Singer.findOne({ singerId: songList[i].singers[0] });
                const singerName = singer.name;
                const x = { _id, songId, title, Lyric, path, duration, img, singers, createdAt, updatedAt, singer, singerName, check }
                dataArr.push(x);
            } else {
                var singerName = [];
                for (let j = 0; j < songList[i].singers.length; j++) {
                    let singer = await Singer.findOne({ singerId: songList[i].singers[j] });
                    singerArr.push(singer);
                    singerName.push(singer.name);
                }
                const singer = singerArr;
                const x = { _id, songId, title, Lyric, path, duration, img, singers, createdAt, updatedAt, singer, singerName, check }
                dataArr.push(x);
            }
        }
        res.json(dataArr);
    }

    async deleteFavorite(req, res, next) {
        try {
            const user = await User.findOne({ _id: req.session.user._id });
            const favoriteTrack = await FavoriteTrack.findOne({ favoriteTrackId: user.favoriteTrackId });
            const songs = favoriteTrack.songId;
            const songFilter = songs.filter((value, index) => {
                return value != req.params.index;
            })
            favoriteTrack.songId = songFilter;
            favoriteTrack.save();
            const message = "Remove this song from your favorites";
            res.json({ message });
        } catch (err) {

        }
    }

    async addFavorite(req, res, next) {
        try {
            const user = await User.findOne({ _id: req.session.user._id });
            const favoriteTrack = await FavoriteTrack.findOne({ favoriteTrackId: user.favoriteTrackId });
            const songs = favoriteTrack.songId;
            songs.push(req.params.index);
            favoriteTrack.save();
            const message = "Add this song to your favorites";
            res.json({ message });
        } catch (err) {

        }
    }

    async deleteMultiFavorite(req, res, next) {
        const listSong = req.body.songIds;
        for (let i = 0; i < listSong.length; i++) {
            listSong[i] = parseInt(listSong[i], 10);
        }

        const user = await User.findOne({ _id: req.session.user._id });
        const favoriteTrack = await FavoriteTrack.findOne({ favoriteTrackId: user.favoriteTrackId });
        var songsId = favoriteTrack.songId;

        const songFilter = songsId.filter((value) => {
            return !listSong.includes(value);
        });
        favoriteTrack.songId = songFilter;
        await favoriteTrack.save();
        res.redirect('/music/profile/me/loved');
    }

    async deleteMultiTrack(req, res, next) {
        const listSong = req.body.songIds;
        for (let i = 0; i < listSong.length; i++) {
            listSong[i] = parseInt(listSong[i], 10);
        }

        const playlist = await Playlist.findOne({ _id: req.params.id });
        const songsId = playlist.songId;
        const songFilter = songsId.filter((value) => {
            return !listSong.includes(value);
        });

        playlist.songId = songFilter;
        await playlist.save();
        res.redirect(`/music/profile/me/playlists/${req.params.id}`);
    }

    async editAccount(req, res, next) {
        try {
            const user = await User.findOne({ _id: req.params.id });
            // console.log(user);
            console.log(req.body)
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            // console.log(isMatch);
            if (isMatch) {
                const hashedPassword = await bcrypt.hash(req.body.passwordConfirm, 12);
                const newUser = { username: req.body.username, password: hashedPassword };
                await User.updateOne({ _id: req.params.id }, newUser);
                res.redirect('/music/account')
            } else {
                res.redirect('/music/account')
            }
        } catch (error) {

        }
    }
}


module.exports = new ApiController();
