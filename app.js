var key = '6a8743dc32ccdac1b4e9c5b162e5f0cc'
async function fetch_tracks(artist) {
    console.log("Getting Tracks")
    const request_url = `https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=callback&q_artist=${artist}&s_track_rating=desc&page_size=100&apikey=${key}`
    const response = await fetch(request_url, { method : 'GET'})
        .then(res => res.text()) 
        .then(json => JSON.parse(json.slice(9,-2)))
    const track_list = response['message']['body']['track_list']
    //console.log(track_list)
    var tracks = await get_tracks(track_list)
    return tracks
}

function get_tracks(track_list){
    const tracks = []
    for(track in track_list){
        let track_info = {}
        labels = ['album_name','album_id','track_name','track_id']
        for(i in labels){
            track_info[labels[i]] = track_list[track]['track'][labels[i]]
        }
        tracks.push(track_info)
    }
    return tracks
}

async function get_lyrics(track_id) {
    console.log("Getting Lyrics")
    const request_url = `https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=jsonp&callback=callback&track_id=${track_id}&apikey=${key}`
    const response = await fetch(request_url, { method: 'GET'})
        .then(res => res.text())
        .then(json => JSON.parse(json.slice(9,-2)))
    const lyrics = response['message']['body']['lyrics']['lyrics_body']
    return lyrics.slice(0,-59)
}

async function load(){
    document.getElementById("artist").style.display='none';
    document.getElementById("song").style.display='none';
    document.getElementById("lyrics").style.display='none';
    document.getElementById("loader").style.display='block';
    const tracks = await fetch_tracks("Ed Sheeran")
    var x = Math.floor(Math.random() * 100)
    if(x==100){x=Math.floor(Math.random() * 100)}
    const track_id = tracks[x]['track_id']
    const lyrics = await get_lyrics(track_id)
    console.log(`Artist : Ed Sheeran\nAlbum Name : ${tracks[x]['album_name']}\nSong : ${tracks[x]['track_name']}\nLyrics : ${lyrics}`)
    document.getElementById("song").innerHTML = tracks[x]['track_name'];
    document.getElementById("lyrics").innerHTML = lyrics;
    document.getElementById("loader").style.display='none';
    document.getElementById("artist").style.display='block';
    document.getElementById("song").style.display='block';
    document.getElementById("lyrics").style.display='block';
}

/*function displayNotification(mhead,mbody) {
    if (Notification.permission == 'granted') {
      navigator.serviceWorker.getRegistration().then(function(reg) {
        var options = {
          body: mbody,
          icon: './images/icons/icon-96x96.png',
          vibrate: [100, 50, 100],
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
          },
          actions: [
            {action: 'explore', title: 'retry'},
            {action: 'close', title: 'close'}
          ]
        };
        reg.showNotification(mhead, options);
      });
    }
}
*/
window.addEventListener('load', async e => {
    if ('serviceWorker' in navigator) {
        try {
            navigator.serviceWorker.register('serviceWorker.js');
            console.log('SW registered');

        } catch (error) {
            console.log('SW failed');

        }
    }
    /*
    if(navigator.onLine){
        navigator.serviceWorker.controller.postMessage("online");
    }
    else
    {
        displayNotification('no internet','please connent to a network');
        navigator.serviceWorker.controller.postMessage("offline");
    }*/
    await load();
});
