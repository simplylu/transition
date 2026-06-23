async function init(){
  const grid = document.getElementById('grid');
  const errorEl = document.getElementById('error');

  grid.textContent = 'Loading articles…';

  try{
    const res = await fetch('articles.json', {cache: 'no-store'});
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const articles = await res.json();
    render(articles || []);
  }catch(err){
    grid.textContent = '';
    errorEl.hidden = false;
    errorEl.textContent = 'Could not load articles.json — ' + err.message;
    console.error(err);
  }

  function render(list){
    grid.textContent = '';
    if(!Array.isArray(list) || list.length === 0){
      grid.textContent = 'No articles found.';
      return;
    }

    // Render in order
    list.forEach((item, idx)=>{
      const rawUrl = item.url;
      const url = rawUrl ? String(rawUrl) : '';
      const title = String(item.title || `Article ${idx+1}`);
      const image = item.image ? String(item.image) : '';

      // If either URL or image is missing, render a muted, non-clickable card
      const isComplete = Boolean(url && image);

      const el = isComplete ? document.createElement('a') : document.createElement('div');
      el.className = 'card' + (isComplete ? '' : ' card--muted');
      if(isComplete){
        el.href = url;
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
        el.setAttribute('aria-label', title);
      } else {
        el.setAttribute('aria-disabled', 'true');
      }

      const media = document.createElement('figure');
      media.className = 'card-media';

      if(image && isComplete){
        const img = document.createElement('img');
        img.src = image;
        img.alt = `Image source: ${image}`;
        img.loading = 'lazy';
        media.appendChild(img);
      } else {
        // keep the media element but hide its contents so card keeps same size
        media.innerHTML = '';
        media.style.visibility = 'hidden';
      }

      const h = document.createElement('h3');
      h.className = 'card-title';
      h.textContent = title;

      // place title above the image (not overlaid)
      el.appendChild(h);
      el.appendChild(media);

      // lightweight body area kept for consistent padding (optional)
      const body = document.createElement('div');
      body.className = 'card-body';
      el.appendChild(body);

      grid.appendChild(el);
    });
  }
}

document.addEventListener('DOMContentLoaded', init);
