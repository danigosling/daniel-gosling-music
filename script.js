const players = [...document.querySelectorAll('.player')];
let activeAudio = null;

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '--:--';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

players.forEach((player) => {
  const audio = player.querySelector('audio');
  const button = player.querySelector('.play');
  const seek = player.querySelector('.seek');
  const time = player.querySelector('.time');
  const src = player.dataset.src;
  audio.src = src;

  const showError = () => {
    if (!player.parentElement.querySelector('.audio-error')) {
      const note = document.createElement('div');
      note.className = 'audio-error';
      note.textContent = 'Audio file not uploaded yet.';
      player.insertAdjacentElement('afterend', note);
    }
    button.textContent = '▶';
  };

  audio.addEventListener('loadedmetadata', () => {
    time.textContent = `0:00 / ${formatTime(audio.duration)}`;
  });

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    seek.value = (audio.currentTime / audio.duration) * 100;
    time.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
  });

  audio.addEventListener('ended', () => {
    button.textContent = '▶';
    seek.value = 0;
  });

  audio.addEventListener('error', showError);

  button.addEventListener('click', async () => {
    if (activeAudio && activeAudio !== audio) {
      activeAudio.pause();
      const otherButton = activeAudio.closest('.player').querySelector('.play');
      otherButton.textContent = '▶';
    }

    if (audio.paused) {
      try {
        await audio.play();
        activeAudio = audio;
        button.textContent = 'Ⅱ';
      } catch {
        showError();
      }
    } else {
      audio.pause();
      button.textContent = '▶';
    }
  });

  seek.addEventListener('input', () => {
    if (audio.duration) audio.currentTime = (seek.value / 100) * audio.duration;
  });
});

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const items = document.querySelectorAll('.track-main, .film, .about-copy, .adelaide-copy, .press a');
  items.forEach((el) => el.classList.add('reveal'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach((el) => observer.observe(el));
}