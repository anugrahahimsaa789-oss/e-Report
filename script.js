const gridContainer = document.getElementById("report-grid");

const getData = async () => {
  try {
    const res = await fetch(
      "https://newsapi.org/v2/everything?q=apple&from=2026-10-22&to=2026-10-22&sortBy=popularity&apiKey=0a6d18faf3a147c8b9e89cdbf1ad63bf",
    );
    const ugaks = await res.json();

    console.log(ugaks);

    const anugrah = ugaks.articles.map((items) => {
      const linkGambar = items.urlToImage || "https://placehold.co";

      return `
<div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col h-full break-inside-avoid mb-6">
    <div class="relative overflow-hidden h-48 w-full bg-slate-50">
        <img src="${linkGambar}" class="w-full h-full object-cover transition-transform duration-500" alt="Gambar Laporan">
    </div>
    
    <div class="p-6 flex flex-col flex-grow">
        <span class="text-xs font-bold text-blue-600 mb-2.5 uppercase tracking-wider">${items.source?.name || items.author || "News System"}</span>
        <h3 class="text-base font-bold text-slate-900 mb-2 line-clamp-2 transition-colors">${items.title || "Tanpa Judul"}</h3>
        <p class="text-sm text-slate-500 mb-4 line-clamp-3 leading-relaxed">${items.description || "Tidak ada deskripsi."}</p>
    </div>
</div>
`;
    });

    gridContainer.innerHTML = anugrah.join("");
  } catch (error) {
    console.error("Gagal memuat data e-report:", error);
  }
};

getData();

const createSearchFilter = () => {
  const searchWrapper = document.createElement("div");
  searchWrapper.className = "w-full max-w-md mx-auto mb-12 px-4";

  searchWrapper.innerHTML = `
    <div class="relative">
      <input 
        type="text" 
        id="news-search-input" 
        placeholder="Cari berita..." 
        class="w-full px-5 py-3 pl-12 text-sm text-slate-800 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-slate-400"
      >
      <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <svg class="w-5 h-5 text-slate-400" xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  `;

  if (gridContainer && gridContainer.parentNode) {
    gridContainer.parentNode.insertBefore(searchWrapper, gridContainer);
  }

  const searchInput = document.getElementById("news-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const keyword = e.target.value.toLowerCase().trim();
      const cards = gridContainer.getElementsByClassName("break-inside-avoid");

      Array.from(cards).forEach((card) => {
        const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
        const desc = card.querySelector("p")?.textContent.toLowerCase() || "";
        const source = card.querySelector("span")?.textContent.toLowerCase() || "";

        if (
          title.includes(keyword) ||
          desc.includes(keyword) ||
          source.includes(keyword)
        ) {
          card.style.setProperty('display', 'flex', 'important');
          card.style.opacity = "1";
        } else {
          card.style.setProperty('display', 'none', 'important');
        }
      });
    });
  }
};

const initAllDeviceEffects = () => {
  const style = document.createElement("style");
  style.textContent = `
    #report-grid > div {
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, z-index 0s;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      position: relative;
      z-index: 1;
    }
    #report-grid > div:hover,
    #report-grid > div.card-active {
      transform: scale(1.05) !important;
      z-index: 30;
      border-color: rgb(191, 219, 254) !important;
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.08), 0 10px 10px -6px rgb(0 0 0 / 0.04) !important;
    }
    #report-grid > div.card-pressed {
      transform: scale(0.98) !important;
      opacity: 0.9;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05) !important;
    }
  `;
  document.head.appendChild(style);

  gridContainer.addEventListener(
    "touchstart",
    (e) => {
      const card = e.target.closest("#report-grid > div");
      if (card) {
        card.classList.add("card-active", "card-pressed");
      }
    },
    { passive: true },
  );

  gridContainer.addEventListener(
    "touchend",
    (e) => {
      const card = e.target.closest("#report-grid > div");
      if (card) {
        card.classList.remove("card-pressed");
        setTimeout(() => {
          card.classList.remove("card-active");
        }, 300);
      }
    },
    { passive: true },
  );

  gridContainer.addEventListener(
    "touchcancel",
    (e) => {
      const card = e.target.closest("#report-grid > div");
      if (card) {
        card.classList.remove("card-active", "card-pressed");
      }
    },
    { passive: true },
  );
};

createSearchFilter();
initAllDeviceEffects();