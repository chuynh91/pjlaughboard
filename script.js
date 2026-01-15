// Sound data - Add your audio clips here!
// Each sound needs:
//   - id: unique identifier
//   - title: display name for the sound
//   - file: filename in the audio/ folder (supports .mp3, .ogg, .wav, .m4a)
//   - source: (optional) which podcast/episode it's from
//   - image: (optional) filename in the images/ folder for tile background
//   - isNew: (optional) show "NEW" badge
//
// Example:
// { id: 'laugh1', title: 'The Giggle', file: 'giggle.mp3', source: 'Search Engine #42', image: 'pj1.jpg' }

const sounds = [
    { id: 'laugh1', title: 'Chicken Bones Laugh', file: '1632_1636__Why are there so many chicken bones on the streets of New York_ (Part 2).m4a', source: 'Search Engine: Chicken Bones Pt. 2', image: 'ChatGPT Image Jan 13, 2026, 09_11_56 PM.png' },
    { id: 'laugh2', title: 'Elon Musk Laugh', file: '324_326__What\'s going on with Elon Musk_.m4a', source: 'Search Engine: Elon Musk', image: 'ChatGPT Image Jan 13, 2026, 09_15_49 PM.png' },
    { id: 'laugh3', title: 'Stop Drinking Laugh', file: '2516_2519__When do you know it\'s time to stop drinking_.m4a', source: 'Search Engine: Time to Stop Drinking?', image: 'ChatGPT Image Jan 13, 2026, 09_15_49 PM.png' },
    { id: 'laugh4', title: 'Sushi Scam Laugh', file: '1588_1590__Am I the victim of an international sushi scam_ (Part 2).m4a', source: 'Search Engine: Sushi Scam Pt. 2', image: 'ChatGPT Image Jan 14, 2026, 12_18_06 PM.png', imageScale: 0.7, clipLeft: 15 },
    { id: 'laugh5', title: 'Chicken Bones Giggle', file: '67_68__Why are there so many chicken bones on the streets of New York_ (Part 2).m4a', source: 'Search Engine: Chicken Bones Pt. 2', image: 'ChatGPT Image Jan 13, 2026, 09_11_56 PM.png' },
    { id: 'laugh6', title: 'Fond Du Lac Laugh', file: '1157_1159__The Fond Du Lac Apartment Mystery.m4a', source: 'Search Engine: Fond Du Lac Apartment Mystery', image: 'ChatGPT Image Jan 13, 2026, 09_15_49 PM.png' },
    { id: 'laugh7', title: 'Diamonds Laugh', file: '2752_2754__Why are we still buying diamonds_.m4a', source: 'Search Engine: Buying Diamonds', image: 'ChatGPT Image Jan 14, 2026, 12_18_06 PM.png', imageScale: 0.7, clipLeft: 15 },
    { id: 'laugh8', title: 'Like Their Job Laugh', file: '826_828__Does anyone actually like their job_.m4a', source: 'Search Engine: Like Their Job?', image: 'ChatGPT Image Jan 13, 2026, 09_11_56 PM.png' },
    { id: 'laugh9', title: 'Like Their Job Giggle', file: '1921_1922__Does anyone actually like their job_.m4a', source: 'Search Engine: Like Their Job?', image: 'ChatGPT Image Jan 13, 2026, 09_15_49 PM.png' },
    { id: 'laugh10', title: 'New Music Laugh', file: '888_891__How do I find new music now that I\'m old and irrelevant_.m4a', source: 'Search Engine: Finding New Music', image: 'ChatGPT Image Jan 14, 2026, 12_18_06 PM.png', imageScale: 0.7, clipLeft: 15 },
    { id: 'laugh11', title: 'New Music Chuckle', file: '1600_1601__How do I find new music now that I\'m old and irrelevant_.m4a', source: 'Search Engine: Finding New Music', image: 'ChatGPT Image Jan 13, 2026, 09_11_56 PM.png' },
];

// DOM Elements
const soundboard = document.getElementById('soundboard');
let currentlyPlaying = null;
let audioUnlocked = false;
let isProcessingClick = false; // Debounce flag for rapid clicks

// Initialize the soundboard
function init() {
    if (sounds.length === 0) {
        showEmptyState();
        return;
    }

    sounds.forEach(sound => {
        const tile = createSoundTile(sound);
        soundboard.appendChild(tile);
    });
}

// Create a sound tile element
function createSoundTile(sound) {
    const tile = document.createElement('div');
    tile.className = 'sound-tile';
    tile.dataset.id = sound.id;

    // Create audio element
    const audio = document.createElement('audio');
    audio.preload = 'none';
    audio.src = `audio/${sound.file}`;

    // Create image if specified
    if (sound.image) {
        const img = document.createElement('img');
        img.className = 'tile-image';
        img.src = `images/${sound.image}`;
        img.alt = sound.title;
        img.draggable = false; // Prevent image dragging on mobile
        img.loading = 'eager'; // Prioritize loading
        img.decoding = 'sync'; // Decode synchronously to prevent flicker
        // Set explicit dimensions to prevent layout collapse if image unloads
        img.width = 145;
        img.height = 145;
        if (sound.imageScale) {
            img.style.transform = `scale(${sound.imageScale})`;
        }
        if (sound.clipLeft) {
            img.style.clipPath = `inset(0 0 0 ${sound.clipLeft}px)`;
        }
        // Handle image load errors
        img.onerror = function() {
            console.warn(`Failed to load image: ${sound.image}`);
            this.style.display = 'none';
        };
        tile.appendChild(img);
    }

    // Create play icon
    const playIcon = document.createElement('span');
    playIcon.className = 'play-icon';
    playIcon.textContent = '\u25B6';

    // Create label
    const label = document.createElement('div');
    label.className = 'tile-label';
    label.textContent = sound.title;

    // Add "NEW" badge if applicable
    if (sound.isNew) {
        const badge = document.createElement('span');
        badge.className = 'new-badge';
        badge.textContent = 'NEW';
        tile.appendChild(badge);
    }

    // Append elements
    tile.appendChild(audio);
    tile.appendChild(playIcon);
    tile.appendChild(label);

    // Touch event handlers for responsive mobile feedback
    let touchStarted = false;

    tile.addEventListener('touchstart', (e) => {
        touchStarted = true;
        tile.classList.add('touch-active');
    }, { passive: true });

    tile.addEventListener('touchend', (e) => {
        tile.classList.remove('touch-active');
        if (touchStarted) {
            e.preventDefault();
            playSound(tile, audio);
        }
        touchStarted = false;
    });

    tile.addEventListener('touchcancel', () => {
        tile.classList.remove('touch-active');
        touchStarted = false;
    }, { passive: true });

    // Click handler for non-touch devices
    tile.addEventListener('click', (e) => {
        // Only handle click if it wasn't a touch event
        if (!touchStarted) {
            playSound(tile, audio);
        }
    });

    // Handle audio end
    audio.addEventListener('ended', () => {
        tile.classList.remove('playing');
        currentlyPlaying = null;
    });

    // Handle audio errors
    audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        tile.classList.remove('playing');
        if (currentlyPlaying === audio) {
            currentlyPlaying = null;
        }
    });

    // Handle stalled/waiting states
    audio.addEventListener('stalled', () => {
        console.warn('Audio stalled, attempting to recover');
    });

    return tile;
}

// Play a sound
function playSound(tile, audio) {
    // Debounce rapid clicks
    if (isProcessingClick) {
        return;
    }
    isProcessingClick = true;
    setTimeout(() => { isProcessingClick = false; }, 100);

    // Stop any currently playing sound
    if (currentlyPlaying && currentlyPlaying !== audio) {
        try {
            currentlyPlaying.pause();
            currentlyPlaying.currentTime = 0;
        } catch (e) {
            console.warn('Error stopping previous audio:', e);
        }
        document.querySelector('.sound-tile.playing')?.classList.remove('playing');
    }

    // Toggle play/pause for the clicked sound
    if (audio.paused) {
        try {
            audio.currentTime = 0;
        } catch (e) {
            // Some browsers throw if audio isn't loaded yet
            console.warn('Could not reset audio time:', e);
        }

        // Attempt to play, with retry logic for mobile browsers
        const attemptPlay = (isRetry = false) => {
            // On retry, reload the audio to reset its state
            if (isRetry) {
                audio.load();
            }

            audio.play().then(() => {
                tile.classList.add('playing');
                currentlyPlaying = audio;
                audioUnlocked = true;
            }).catch(err => {
                console.error('Error playing audio:', err);

                // If this is the first attempt and it failed, try reloading and playing again
                if (!isRetry && (err.name === 'NotAllowedError' || err.name === 'AbortError')) {
                    attemptPlay(true);
                } else {
                    // Reset state on failure
                    tile.classList.remove('playing');
                    currentlyPlaying = null;
                }
            });
        };

        attemptPlay();

    } else {
        try {
            audio.pause();
            audio.currentTime = 0;
        } catch (e) {
            console.warn('Error pausing audio:', e);
        }
        tile.classList.remove('playing');
        currentlyPlaying = null;
    }
}

// Show empty state when no sounds are configured
function showEmptyState() {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
        <h2>No sounds yet!</h2>
        <p>To add PJ Vogt laughs to this soundboard:</p>
        <p>1. Add audio files (.mp3, .ogg, .wav) to the <code>audio/</code> folder</p>
        <p>2. Edit <code>script.js</code> and add entries to the <code>sounds</code> array</p>
        <p style="margin-top: 1rem;">Check the comments in script.js for examples!</p>
    `;
    soundboard.appendChild(emptyState);
}

// Keyboard support - press space to stop all sounds
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        if (currentlyPlaying) {
            currentlyPlaying.pause();
            currentlyPlaying.currentTime = 0;
            document.querySelector('.sound-tile.playing')?.classList.remove('playing');
            currentlyPlaying = null;
        }
    }
});

// Handle page visibility change (when returning from background)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Reset audio unlock state when page becomes visible again
        // This helps with mobile browsers that suspend audio when backgrounded
        audioUnlocked = false;

        // Stop any currently playing audio that may have been interrupted
        if (currentlyPlaying) {
            currentlyPlaying.pause();
            currentlyPlaying.currentTime = 0;
            document.querySelector('.sound-tile.playing')?.classList.remove('playing');
            currentlyPlaying = null;
        }

        // Re-verify all images are loaded (mobile browsers may unload them when backgrounded)
        reloadUnloadedImages();
    }
});

// Reload any images that were unloaded while page was backgrounded
function reloadUnloadedImages() {
    const images = document.querySelectorAll('.tile-image');
    images.forEach(img => {
        // Check if image was unloaded (naturalWidth will be 0)
        if (img.naturalWidth === 0 || !img.complete) {
            // Force reload by resetting src
            const src = img.src;
            img.src = '';
            img.src = src;
        }
    });
}

// Handle pageshow event (fired when page is restored from bfcache)
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // Page was restored from bfcache
        console.log('Page restored from bfcache, reloading images');
        reloadUnloadedImages();

        // Reset audio state
        audioUnlocked = false;
        if (currentlyPlaying) {
            currentlyPlaying.pause();
            currentlyPlaying.currentTime = 0;
            document.querySelector('.sound-tile.playing')?.classList.remove('playing');
            currentlyPlaying = null;
        }
    }
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
