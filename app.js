        /* 
        1. render song
        2. scroll top
        3. play / pause / seek
        4. cd rotate
        5. next / prev
        6. random
        7. next / repeat when end
        8. active song
        9. scroll active song into view
        10. play song when click
        */

        const $ = document.querySelector.bind(document);
        const $$ = document.querySelectorAll.bind(document);

        const PLAYER_STORAGE_KEY = 'MUSIC_PLAYER';

        // get element 
        const cd = $('.cd');
        const cdWidth  = cd.offsetWidth;

        const heading  = $('header marquee');
        const cdThumb = $('.cd-thumb');
        const audio = $('#audio');
        const player  = $('.player');

        const playBtn = $('.btn-toggle-play');

        const progress = $('#progress');

        const nextBtn = $('.btn-next');
        const prevBtn = $('.btn-prev');

        const randomBtn = $('.btn-random');

        const repeatBtn = $('.btn-repeat');

        const playList = $('.playlist');

        const musicCurrentTime = $('.current-time')
        const musicDuration = $('.max-duration')

        const volumeRange = $('#range');
        const volumeProgress = $('.volume-progress');
        const volumeButton = $('.volume-btn');
        const fullVolumeButton = volumeButton.querySelector('.full-volume');
        const halfVolumeButton = volumeButton.querySelector('.half-volume');
        const mutedButton = volumeButton.querySelector('.muted');
        halfVolumeButton.style.display = 'none';
        mutedButton.style.display = 'none';
        
        const app = {
            
        currentIndex: 0,

        isPlaying: false,

        isRandom: false,

        isRepeat: false,

        songVolume:0,

        config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},    

        songs: [
                {
                    name: 'Đường Tôi Chở Em Về',
                    singer: 'Bùi Trường Linh',
                    path: './assets/music/song11.mp3',
                    image: './assets/img/img2.jpg'
                }, {
                    name: 'Easy On Me',
                    singer: 'adele',
                    path: './assets/music/song1.mp3',
                    image: './assets/img/img1.jpg'
                }, {
                    name: 'For Tonight',
                    singer: 'Giveon',
                    path: './assets/music/song3.mp3',
                    image: './assets/img/img3.jpg'
                }, {
                    name: 'Cold Heart',
                    singer: 'Elton John, Dua Lipa',
                    path: './assets/music/song4.mp3',
                    image: './assets/img/img4.jpg'
                }, {
                    name: 'STAY',
                    singer: 'The Kid LAROI, Justin Bieber',
                    path: './assets/music/song5.mp3',
                    image: './assets/img/img5.jpg'
                }, {
                    name: 'Someday',
                    singer: 'OneRepublic',
                    path: './assets/music/song6.mp3',
                    image: './assets/img/img6.jpg'
                }, {
                    name: 'Between Us',
                    singer: 'Little Mix',
                    path: './assets/music/song7.mp3',
                    image: './assets/img/img7.jpg'
                }, {
                    name: 'Rise',
                    singer: 'Calum Scott',
                    path: './assets/music/song8.mp3',
                    image: './assets/img/img8.jpg'
                }, {
                    name: 'Wrecked',
                    singer: 'Imagine Dragons',
                    path: './assets/music/song9.mp3',
                    image: './assets/img/img9.jpg'
                }, {
                    name: 'Say You Wont let go',
                    singer: 'James Arthur',
                    path: './assets/music/song10.mp3',
                    image: './assets/img/img10.jpg'
                }
            ],
            
            setConfig: function(key, value) {
                this.config[key] = value;
                localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
            },
            render: function(){
                const htmls = this.songs.map((song, index) => {
                    return `
                        <div class="song ${index === this.currentIndex ? 'active' : '' }" data-index = "${index}">
                            <div class="thumb" 
                                style="background-image: url('${song.image}')">
                            </div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>
                    `
                })
                playList.innerHTML = htmls.join('')
            },

            defineProperties: function(){
                Object.defineProperty(this, 'currentSong', {
                    get: function(){
                        return this.songs[this.currentIndex];
                    }
                })
            },

            handleEvents: function() {
                // handle cd turn / stop
                const cdAnimate =  cd.animate([
            
                { transform: 'rotate(360deg)' },
                ], {
                duration: 10000,
                iterations: Infinity
                });
                cdAnimate.pause()
                // heading.start();

                // handle zoom in / zoom out app
                document.onscroll = function () {
                    const scrollTop = window.scrollY || document.documentElement.scrollTop;
                    const newCdWidth = cdWidth - scrollTop;

                    cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
                    cd.style.opacity = newCdWidth / cdWidth;
                }

                // handle when click play
                playBtn.onclick = function() {
                    if(app.isPlaying) {                       
                        audio.pause();
                    }
                    else{                      
                        audio.play();
                    }
                
                    // case 2 use toggle
                    // app.isPlaying = !app.isPlaying 
                    // // if true : play() ,if false : pause()
                    // app.isPlaying ? audio.play() : audio.pause() 
                    // player.classList.toggle('playing',app.isPlaying)
                },

                // when song is paused
                audio.onpause = function() {
                        cdAnimate.pause()                   
                        app.isPlaying =  false;
                        player.classList.remove('playing');
                }
                    // when song is played
                audio.onplay = function() {
                        cdAnimate.play()
                        app.isPlaying = true;
                        player.classList.add('playing');
                },

                // when the song duration changes
                audio.ontimeupdate = function() {
                    if(audio.duration) {
                        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100 );
                        progress.value = progressPercent;

                        //update playing song current time
                    
                        let currentTime = audio.currentTime;
                        let currentMin = Math.floor(currentTime / 60);
                        let currentSec = Math.floor(currentTime % 60);
                        if(currentSec < 10){ //if sec is less than 10 then add 0 before it
                            currentSec = `0${currentSec}`;
                        }
                        musicCurrentTime.innerHTML = `${currentMin}:${currentSec}`;
                        app.progressDisplayBackground();
                
                    }
                },

                 //update playing song duration time
                audio.onloadeddata = function(){
                    let songTime = audio.duration;
                    let totalMin = Math.floor(songTime / 60)
                    let totalSec = Math.floor(songTime % 60);
                    if(totalSec < 10) {
                        totalSec = `0${totalSec}`;
                    }
                    musicDuration.innerHTML = `${totalMin}:${totalSec}`;
                }
                
                // handle rewind song
                progress.oninput = function(e) {
                    const seekTime  = e.target.value * audio.duration / 100;
                    audio.currentTime = seekTime;
                },

                
                //  next song
                nextBtn.onclick = function() {
                    if(app.isRandom) {                    
                        app.playRandomSong()
                    }
                    else {
                        app.nextSong();                   
                    }
                    audio.play();
                    app.render()
                    app.scrollInToView();
                    
                },
                
                // backward song
                prevBtn.onclick = function() {
                    if(app.isRandom) {                    
                        app.playRandomSong()
                    }
                    else {
                        app.prevSong(); 
                    }
                    audio.play();
                    app.render()
                    app.scrollInToView();
                    
                },

                // turn on / off random
                randomBtn.onclick = function() {
                    if(app.isRandom) {
                        app.isRandom = false;
                        randomBtn.classList.remove('active')
                    }
                    else {
                        app.isRandom = true;
                        randomBtn.classList.add('active')
                        }  
                    app.setConfig('isRandom', app.isRandom); 
                },

                repeatBtn.onclick = function() {
                    app.isRepeat = !app.isRepeat
                    repeatBtn.classList.toggle('active', app.isRepeat);
                    app.setConfig('isRepeat', app.isRepeat);
                }
                
                // handle when end 1 song ( repeat song / auto next song)
                audio.onended = function() {
                    if(app.isRepeat) {
                        audio.play()    
                    }
                    else {
                        // click(): auto click button next
                        nextBtn.click();  
                    }
                },

                // active song continue
                playList.onclick = function(e) {
                    const songNode = e.target.closest('.song:not(.active)');
                    if(songNode || e.target.closest('.option')) {
                        if(e.target.closest('.song:not(.active)')) {
                            app.currentIndex = Number(songNode.getAttribute('data-index'))
                            app.loadCurrentSong();
                            audio.play();
                            app.render()
                        }
                    }
                },

                // handle rewind volume
                volumeRange.oninput= function(e){
                    app.songVolume = e.target.value;
                    audio.volume = app.songVolume / 100;
                    app.volumeDisplayBackground();
                    app.volumeButtonHandle();   
                    app.setConfig("volume", app.songVolume);
                }
                
            },       

            progressDisplayBackground: function() {
                progress.value = Math.floor(audio.currentTime / audio.duration * 100 );
                const color = 'linear-gradient(90deg, rgb(204, 89, 44)' + progress.value + '% ,rgb(214,214,214)' + progress.value+ '%)';
                progress.style.background = color;
            },
            
            volumeDisplayBackground: function() {
                volumeRange.value  = this.songVolume;
                const volumeColor = 'linear-gradient(90deg, rgb(204, 89, 44)' +volumeRange.value+'%, rgb(214, 214, 214) '+volumeRange.value+'%)';
                volumeRange.style.background = volumeColor;
                app.setConfig("colorVolume", app.volumeColor);

            },


            volumeButtonHandle: function(){
                const volume = this.songVolume;  
                if(volume > 50) {
                    volumeButton.innerHTML= '<i class=" fas fa-volume-up"></i>'
                }
                else {
                if(volume >= 5 && volume <= 50) {
                    volumeButton.innerHTML='<i class="fas fa-volume-down"></i>'                   
                } 
                else {
                    volumeButton.innerHTML='<i class="fas fa-volume-mute"></i>'
                } 
            }     
                this.volumeDisplayBackground();
            },

            loadConfig: function() {
                this.isRandom = this.config.isRandom;
                this.isRepeat = this.config.isRepeat;
                this.songVolume = this.config.volume;
                this.currentIndex = this.config.currentIndex;

                randomBtn.classList.toggle('active',this.isRandom);
                repeatBtn.classList.toggle('active',this.isRepeat);
            },
            
            loadCurrentSong: function() {
                heading.innerText = this.currentSong.name;
                cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
                audio.src = this.currentSong.path;
                this.setConfig("currentIndex",this.currentIndex);
            },

            // handle next Song
            nextSong: function() {
                this.currentIndex++;
                if(this.currentIndex >= this.songs.length) {
                    this.currentIndex = 0;
                }
                this.loadCurrentSong();
            },

            prevSong: function() {
                this.currentIndex--;
                if(this.currentIndex < 0) {
                    this.currentIndex = this.songs.length - 1
                }
            
                this.loadCurrentSong();
            },
            
            playRandomSong: function() {
                let newSong;
                do {
                    newSong = Math.floor(Math.random() * this.songs.length)               
                }
                while(newSong === this.currentIndex)

                this.currentIndex = newSong;
                this.loadCurrentSong();

            },

            scrollInToView: function() {
                let view = '';
                if(this.currentIndex < 3) view = 'end';
                else view='center';
                setTimeout(function() {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: view

                });
                },200)
            },

            start: function() {
                // Gán cấu hình từ config vào application
                this.loadConfig();

                // Define attributes for Obj
                this.defineProperties();

                // listen / handle events (Dom events)
                this.handleEvents();

                // Load this first song info into UI when running the app   
                this.loadCurrentSong();
                
                
                // render playlist
                this.render();
                
                this.volumeButtonHandle();
            }
        }
        app.start();