document.addEventListener('DOMContentLoaded', function() {
    
    initializeUI();
    
    setupEventListeners();
});

function initializeUI() {
    loadUserProfile();
    
    loadFeaturedContent();
    
    loadPlaylists();
}

function loadUserProfile() {
    const profilePhoto = document.querySelector('.profile-photo img');
    const username = document.querySelector('.profile-btn span');
    
    profilePhoto.src = userData.profileImage;
    username.textContent = userData.username;
}

function loadFeaturedContent() {
    const featuredGrid = document.querySelector('.podcast-grid');
    if (!featuredGrid) return;

    featuredGrid.innerHTML = podcastData.featured.map(episode => createEpisodeCard(episode)).join('');
}

function loadPlaylists() {
    const playlistGrid = document.querySelector('.playlist-grid');
    if (!playlistGrid) return;

    playlistGrid.innerHTML = podcastData.playlists.map(playlist => createPlaylistCard(playlist)).join('');
}

function createEpisodeCard(episode) {
    return `
        <div class="podcast-card" data-episode-id="${episode.id}">
            <div class="podcast-image">
                <img src="${episode.imageUrl}" alt="${episode.title}" loading="lazy">
                <div class="podcast-overlay">
                    <button class="play-button" data-track-id="${episode.id}">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
            <div class="podcast-info">
                <h3>${episode.title}</h3>
                <p>${episode.description}</p>
                <div class="episode-meta">
                    <span>${episode.duration}</span>
                    <span class="separator">•</span>
                    <span>${episode.category}</span>
                </div>
            </div>
        </div>
    `;
}

function createPlaylistCard(playlist) {
    return `
        <div class="playlist-card" data-playlist-id="${playlist.id}">
            <div class="playlist-cover">
                <img src="${playlist.imageUrl}" alt="${playlist.name}" loading="lazy">
                <div class="playlist-overlay">
                    <button class="play-button">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
            <h4>${playlist.name}</h4>
            <p>${playlist.episodes} episodes</p>
        </div>
    `;
}

function setupEventListeners() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.play-button')) {
            const button = e.target.closest('.play-button');
            const trackId = button.dataset.trackId;
            if (trackId) {
                const track = findTrackById(trackId);
                if (track) {
                    player.loadTrack(track);
                    player.togglePlay();
                }
            }
        }
    });

    const profileBtn = document.querySelector('.profile-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', toggleProfileMenu);
    }
}

function findTrackById(id) {
    id = parseInt(id);
    return podcastData.featured.find(track => track.id === id) ||
           podcastData.popular.find(track => track.id === id);
}

function toggleProfileMenu(e) {
    e.stopPropagation();
    
    let menu = document.querySelector('.profile-menu');
    
    if (menu) {
        menu.remove();
        return;
    }

    menu = document.createElement('div');
    menu.className = 'profile-menu';
    menu.innerHTML = `
        <ul>
            <li><a href="#"><i class="fas fa-user"></i> Profile</a></li>
            <li><a href="#"><i class="fas fa-cog"></i> Settings</a></li>
            <li><hr></li>
            <li><a href="#"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
        </ul>
    `;

    document.body.appendChild(menu);

    const btnRect = this.getBoundingClientRect();
    menu.style.top = `${btnRect.bottom + 5}px`;
    menu.style.right = `${window.innerWidth - btnRect.right}px`;

    document.addEventListener('click', function closeMenu(e) {
        if (!menu.contains(e.target) && !e.target.closest('.profile-btn')) {
            menu.remove();
            document.removeEventListener('click', closeMenu);
        }
    });
}
