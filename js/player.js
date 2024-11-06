class PodcastPlayer {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.currentTrack = null;
        this.playlist = [];
        this.currentIndex = 0;
        this.volume = 0.7;
        this.isShuffled = false;
        this.repeatMode = 'none';
        this.initializePlayer();
    }

    initializePlayer() {
        this.elements = {
            playBtn: document.querySelector('.play-btn'),
            prevBtn: document.querySelector('.prev-btn'),
            nextBtn: document.querySelector('.next-btn'),
            shuffleBtn: document.querySelector('.shuffle-btn'),
            repeatBtn: document.querySelector('.repeat-btn'),
            progressBar: document.querySelector('.progress-bar'),
            progress: document.querySelector('.progress'),
            progressHandle: document.querySelector('.progress-handle'),
            currentTime: document.querySelector('.current-time'),
            totalTime: document.querySelector('.total-time'),
            volumeSlider: document.querySelector('.volume-slider'),
            volumeBtn: document.querySelector('.volume-btn'),
            volumeProgress: document.querySelector('.volume-progress'),
            trackImage: document.querySelector('.track-info img'),
            trackTitle: document.querySelector('.track-details h4'),
            trackShow: document.querySelector('.track-details p'),
            likeBtn: document.querySelector('.like-btn')
        };

        this.setupEventListeners();
        this.setVolume(this.volume);
    }

    setupEventListeners() {
        this.elements.playBtn.addEventListener('click', () => this.togglePlay());
        this.elements.prevBtn.addEventListener('click', () => this.previousTrack());
        this.elements.nextBtn.addEventListener('click', () => this.nextTrack());
        this.elements.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.elements.repeatBtn.addEventListener('click', () => this.toggleRepeat());

        this.elements.progressBar.addEventListener('click', (e) => this.seekTo(e));
        this.elements.progressBar.addEventListener('mousemove', (e) => this.updateProgressHover(e));
        this.elements.progressBar.addEventListener('mouseleave', () => this.hideProgressHover());

        this.elements.volumeSlider.addEventListener('click', (e) => this.setVolume(this.calculateVolume(e)));
        this.elements.volumeBtn.addEventListener('click', () => this.toggleMute());

        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleTrackEnd());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());

        this.elements.likeBtn.addEventListener('click', () => this.toggleLike());
    }

    loadTrack(track) {
        if (!track) return;

        this.currentTrack = track;
        this.audio.src = track.audioUrl;
        this.updateTrackInfo();
        this.audio.load();

        if (this.isPlaying) {
            this.audio.play();
        }
    }

    updateTrackInfo() {
        this.elements.trackImage.src = this.currentTrack.imageUrl;
        this.elements.trackTitle.textContent = this.currentTrack.title;
        this.elements.trackShow.textContent = this.currentTrack.show;
        this.updateLikeButton();
    }

    togglePlay() {
        if (!this.currentTrack) return;

        if (this.isPlaying) {
            this.audio.pause();
        } else {
            this.audio.play();
        }
        this.isPlaying = !this.isPlaying;
        this.updatePlayButton();
    }

    updatePlayButton() {
        const icon = this.elements.playBtn.querySelector('i');
        icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }

    seekTo(event) {
        const percent = event.offsetX / this.elements.progressBar.offsetWidth;
        this.audio.currentTime = percent * this.audio.duration;
    }

    updateProgress() {
        if (!this.audio.duration) return;

        const percent = (this.audio.currentTime / this.audio.duration) * 100;
        this.elements.progress.style.width = `${percent}%`;
        this.elements.progressHandle.style.left = `${percent}%`;
        this.elements.currentTime.textContent = this.formatTime(this.audio.currentTime);
    }

    updateProgressHover(event) {
        const hoverProgress = document.querySelector('.progress-hover');
        const percent = (event.offsetX / this.elements.progressBar.offsetWidth) * 100;
        hoverProgress.style.width = `${percent}%`;
        hoverProgress.style.opacity = '1';
    }

    hideProgressHover() {
        const hoverProgress = document.querySelector('.progress-hover');
        hoverProgress.style.opacity = '0';
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.audio.volume = this.volume;
        this.updateVolumeUI();
    }

    updateVolumeUI() {
        this.elements.volumeProgress.style.width = `${this.volume * 100}%`;
        this.elements.volumeBtn.querySelector('i').className = this.getVolumeIcon();
    }

    getVolumeIcon() {
        if (this.volume === 0) return 'fas fa-volume-mute';
        if (this.volume < 0.3) return 'fas fa-volume-off';
        if (this.volume < 0.7) return 'fas fa-volume-down';
        return 'fas fa-volume-up';
    }

    calculateVolume(event) {
        return event.offsetX / this.elements.volumeSlider.offsetWidth;
    }

    toggleMute() {
        if (this.audio.volume > 0) {
            this.previousVolume = this.audio.volume;
            this.setVolume(0);
        } else {
            this.setVolume(this.previousVolume || 0.7);
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    toggleLike() {
        if (!this.currentTrack) return;

        const isLiked = userData.likedEpisodes.includes(this.currentTrack.id);
        if (isLiked) {
            userData.likedEpisodes = userData.likedEpisodes.filter(id => id !== this.currentTrack.id);
        } else {
            userData.likedEpisodes.push(this.currentTrack.id);
        }
        this.updateLikeButton();
    }

    updateLikeButton() {
        const isLiked = userData.likedEpisodes.includes(this.currentTrack.id);
        const icon = this.elements.likeBtn.querySelector('i');
        icon.className = isLiked ? 'fas fa-heart' : 'far fa-heart';
        this.elements.likeBtn.classList.toggle('active', isLiked);
    }
}

const player = new PodcastPlayer();
