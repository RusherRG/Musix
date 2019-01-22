var key = '6a8743dc32ccdac1b4e9c5b162e5f0cc'

async function fetch_tracks(artist) {
    console.log("Getting Tracks")
    const request_url = `https://api.musixmatch.com/ws/1.1/track.search?format=json&q_artist=${artist}&s_track_rating=desc&page_size=100&apikey=${key}`
    const response = await fetch(request_url, { method: 'GET'})
        .then(res => res.json())
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
    const request_url = `https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=json&track_id=${track_id}&apikey=${key}`
    const response = await fetch(request_url, { method: 'GET'})
        .then(res => res.json())
    const lyrics = response['message']['body']['lyrics']['lyrics_body']
    return lyrics
}

async function reload(){
    const tracks = await fetch_tracks("Ed Sheeran")
    //console.log(tracks)
    var x = Math.floor(Math.random() * 100)
    if(x==100){x=Math.floor(Math.random() * 100)}
    const track_id = tracks[x]['track_id']
    const lyrics = await get_lyrics(track_id)
    console.log(`Artist : Ed Sheeran\nAlbum Name : ${tracks[x]['album_name']}\nSong : ${tracks[x]['track_name']}\nLyrics : ${lyrics}`)
}
