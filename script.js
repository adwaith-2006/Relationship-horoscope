document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const resultDiv = document.querySelector(".mt-12.pt-8");

  // Predefined horoscopes for each tone (4 each)
  const horoscopes = {
    romantic: [
      "The stars shine bright for you two tonight. 💖 Love fills every corner of your hearts.",
      "Your souls are entwined like constellations in the sky. ✨ Hearts beat as one.",
      "Romance blossoms around you like spring flowers. 🌸 Keep your love radiant.",
      "A dreamy evening awaits; whispers of affection guide your hearts. 💌"
    ],
    funny: [
      "Cupid must have been tipsy today — your love is hilariously chaotic! 😂",
      "Your relationship is like a rom-com on fast-forward. 🎬 Enjoy the laughter!",
      "Watch out for flying hearts and banana peels of love! 🍌💘",
      "Love alert! Someone's snoring may be more charming than expected. 😆❤️"
    ],
    mysterious: [
      "Destiny weaves a secret path for your hearts. 🌙 Embrace the unknown.",
      "The moon whispers secrets only you two can understand. 🌌",
      "A mysterious force aligns your souls tonight. 🕊️ Trust the magic.",
      "Fate hides a treasure in your connection; discover it together. 🔮"
    ]
  };

  // Calculate love meter locally
  function calculateLoveMeter(name1, name2) {
    const combined = (name1 + name2).toLowerCase().replace(/\s+/g, '');
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = ((hash << 5) - hash) + combined.charCodeAt(i);
      hash |= 0;
    }
    let percentage = (Math.abs(hash) % 70) + 30;

    if (name1[0]?.toLowerCase() === name2[0]?.toLowerCase()) percentage = Math.min(percentage + 10, 100);
    if (name1.length === name2.length) percentage = Math.min(percentage + 5, 100);
    if (name1.toLowerCase().includes(name2.toLowerCase()) || name2.toLowerCase().includes(name1.toLowerCase())) 
      percentage = Math.min(percentage + 8, 100);

    return percentage;
  }

  // Event listener for form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const yourName = document.getElementById("your-name").value.trim();
    const partnerName = document.getElementById("partner-name").value.trim();
    const tone = document.getElementById("tone").value.toLowerCase();

    if (!yourName || !partnerName) {
      alert("Please fill in both names!");
      return;
    }

    // Pick a random horoscope from the selected tone
    const toneHoroscopes = horoscopes[tone] || horoscopes.romantic;
    const randomIndex = Math.floor(Math.random() * toneHoroscopes.length);
    const selectedHoroscope = toneHoroscopes[randomIndex];

    // Calculate love meter
    const loveMeter = calculateLoveMeter(yourName, partnerName);

    // Display the result
    resultDiv.innerHTML = `
      <div class="bg-white/70 dark:bg-background-dark/60 border border-primary/20 rounded-xl p-8 shadow-lg text-center">
        <h2 class="text-2xl font-bold text-primary mb-4">💖 Your Horoscope 💖</h2>
        <p class="text-slate-800 dark:text-slate-100 text-lg">${selectedHoroscope}</p>
        <p class="mt-4 text-sm text-slate-500 dark:text-slate-400">Love Meter: ${loveMeter}%</p>
      </div>
    `;
  });
});
