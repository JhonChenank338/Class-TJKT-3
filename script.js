function reveal() {
    const reveals = document.querySelectorAll(".reveal");
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            reveals[i].classList.add("active");
        } else {
            reveals[i].classList.remove("active");
        }
    }
}

window.addEventListener("scroll", reveal);

window.addEventListener("DOMContentLoaded", () => {
    // 1. INISIALISASI ELEMEN (Hanya satu kali di sini)
    const overlay = document.getElementById('welcome-overlay');
    const startBtn = document.getElementById('startBtn');
    const loadingBar = document.querySelector('.loading-bar');
    const audio = document.getElementById('audioElement');
    const playBtn = document.getElementById('playBtn');
    const trackTitle = document.getElementById('trackTitle');
    const playerCard = document.getElementById('playerCard');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressContainer');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const playlistContainer = document.getElementById('playlist');

    // --- LOGIKA WELCOME SCREEN & TOMBOL START ---
    if (overlay) {
        // Sembunyikan tombol di awal, pastikan loading bar muncul
        if (startBtn) startBtn.style.display = 'none';

        // Munculkan tombol setelah simulasi loading (2 detik)
        setTimeout(() => {
            if (loadingBar) loadingBar.style.display = 'none';
            if (startBtn) {
                startBtn.style.display = 'inline-block';
                startBtn.classList.add('glow-animation'); // Tambahkan class animasi jika ada
            }
        }, 2000);

        // Fungsi saat tombol START diklik
        startBtn.addEventListener('click', () => {
            overlay.classList.add('fade-out');

            // Play musik otomatis hanya setelah tombol start diklik (Izin Browser)
            if (audio) {
                audio.play().then(() => {
                    if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                }).catch(err => console.log("Autoplay dicegah: ", err));
            }

            setTimeout(() => { 
                overlay.style.display = 'none'; 
                reveal(); // Jalankan reveal konten setelah masuk
            }, 1000);
        });
    }

    // --- LOGIK MUSIC PLAYER ---
    const tracks = [
        { title: "Ingatlah Hari Ini", src: "musik/lagu1.mp3" },
        { title: "Kisah Kasih Di Sekolah", src: "musik/lagu2.mp3" },
        { title: "Sampai Jumpa", src: "musik/lagu3.mp3" },
        { title: "Sesuatu Di Jogja", src: "musik/lagu4.mp3" },
        { title: "Kita Ke Sana", src: "musik/lagu5.mp3" }
    ];

    let currentTrackIndex = 0;

    const playerToggle = document.getElementById('playerToggle');
    if (playerToggle) {
        playerToggle.addEventListener('click', () => playerCard.classList.toggle('active'));
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        let min = Math.floor(seconds / 60);
        let sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    function loadTrack(index) {
        currentTrackIndex = index;
        if (audio) {
            audio.src = tracks[index].src;
            trackTitle.innerText = tracks[index].title;
            audio.load();
        }
        document.querySelectorAll('.playlist-item').forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }

    if (audio) {
        audio.addEventListener('timeupdate', () => {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
            currentTimeEl.innerText = formatTime(audio.currentTime);
            if (audio.duration) durationEl.innerText = formatTime(audio.duration);
        });
    }

    if (progressContainer) {
        progressContainer.addEventListener('click', (e) => {
            const width = progressContainer.clientWidth;
            const clickX = e.offsetX;
            audio.currentTime = (clickX / width) * audio.duration;
        });
    }

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play().then(() => playBtn.innerHTML = '<i class="fas fa-pause"></i>');
            } else {
                audio.pause();
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });
    }

    document.getElementById('nextBtn')?.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(currentTrackIndex);
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    });

    document.getElementById('prevBtn')?.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(currentTrackIndex);
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    });

    if (playlistContainer) {
        tracks.forEach((track, index) => {
            const item = document.createElement('div');
            item.classList.add('playlist-item');
            item.innerText = `${index + 1}. ${track.title}`;
            item.onclick = () => {
                loadTrack(index);
                audio.play();
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            };
            playlistContainer.appendChild(item);
        });
    }

    if (audio) audio.onended = () => document.getElementById('nextBtn').click();
    
    loadTrack(0);
    reveal();
});

// --- JAVASCRIPT UNTUK LIGHT/DARK MODE ---
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');

    const updateIcon = (isLight) => {
        if (!themeIcon) return;
        themeIcon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
    };

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        body.classList.add('light-mode');
        updateIcon(true);
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');
        updateIcon(isLight);
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
}

// Di dalam window.addEventListener("DOMContentLoaded", () => { ... })

const startBtn = document.getElementById('startBtn');
const loadingBar = document.querySelector('.loading-bar');

if (overlay) {
    // Tombol akan muncul setelah 2.5 detik (sesuaikan dengan loading bar kamu)
    setTimeout(() => {
        if (loadingBar) loadingBar.style.display = 'none';
        
        if (startBtn) {
            startBtn.style.display = 'inline-block'; // Saat ini aktif, animasi CSS 'fadeInButton' akan jalan
        }
    }, 2500); 
}