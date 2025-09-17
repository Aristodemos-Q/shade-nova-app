<template>
  <div class="snowowl">
    <transition name="fade-scale">
      <section v-if="!gameStore.playerName && showPopup" class="snowowl__intro card surface-frosted">
        <div class="snowowl__intro-header">
          <span class="badge">Briefing {{ popupIndex + 1 }} / {{ popups.length }}</span>
          <div class="snowowl__intro-dots">
            <span v-for="(popup, index) in popups" :key="popup.title" :class="['snowowl__intro-dot', { 'is-active': index === popupIndex }]"></span>
          </div>
        </div>
        <img :src="popups[popupIndex].img" :alt="popups[popupIndex].title" class="snowowl__intro-image" />
        <h2>{{ popups[popupIndex].title }}</h2>
        <p>{{ popups[popupIndex].text }}</p>
        <input
          v-if="popups[popupIndex].input"
          v-model="playerName"
          class="snowowl__name-input"
          placeholder="Jouw codenaam"
          maxlength="20"
        />
        <div class="snowowl__intro-actions">
          <button class="btn btn--subtle" v-if="popupIndex > 0" @click="goBack">Vorige</button>
          <button
            class="btn"
            v-if="popupIndex < popups.length - 1"
            @click="goForward"
          >
            Volgende
          </button>
          <button
            class="btn"
            v-if="popupIndex === popups.length - 1"
            :disabled="!canStart"
            @click="startGame"
          >
            Start missie
          </button>
        </div>
      </section>
    </transition>

    <div v-if="gameStore.playerName" class="snowowl__dashboard">
      <section class="card surface-frosted snowowl__welcome">
        <div>
          <span class="badge">Welkom agent</span>
          <h1>{{ gameStore.playerName }}</h1>
          <p class="section-subtext">Voltooi alle missies op het leerplein om jouw persoonlijke kluiscode te onthullen.</p>
        </div>
        <button class="btn btn--ghost" @click="switchPlayer">Wissel agent</button>
      </section>

      <section class="card snowowl__status">
        <div class="snowowl__progress">
          <div class="snowowl__progress-circle" :style="progressCircleStyle">
            <div class="snowowl__progress-inner">
              <strong>{{ completedCount }}</strong>
              <span>van {{ tiles.length }}</span>
            </div>
          </div>
          <div class="snowowl__progress-copy">
            <h3>Missie voortgang</h3>
            <p class="section-subtext">Je hebt {{ completedCount }} van de {{ tiles.length }} missies voltooid.</p>
          </div>
        </div>
        <div class="snowowl__vault">
          <div class="snowowl__vault-header">
            <span class="badge">Kluiscode</span>
            <p class="section-subtext">Elk voltooid spel onthult een nieuw cijfer.</p>
          </div>
          <div class="snowowl__vault-digits">
            <span
              v-for="(digit, index) in vaultDigits"
              :key="index"
              :class="['snowowl__vault-digit', { 'is-revealed': index < completedCount }]"
            >
              {{ digit }}
            </span>
          </div>
        </div>
      </section>

      <section class="snowowl__tiles">
        <h2 class="section-heading">Kies je volgende missie</h2>
        <p class="section-subtext">Ga naar de locatie op het leerplein, speel het spel en keer terug om de code in te vullen.</p>
        <div class="snowowl__tile-grid">
          <article
            v-for="(tile, index) in tiles"
            :key="tile.id"
            :class="['snowowl__tile card', { 'is-disabled': !tile.available }]"
            @click="selectGame(index)"
          >
            <div class="snowowl__tile-header">
              <span class="badge">Missie {{ index + 1 }}</span>
              <span class="snowowl__tile-status" :class="{ 'is-locked': !tile.available }">
                {{ tile.available ? 'Beschikbaar' : 'Bezet of voltooid' }}
              </span>
            </div>
            <img :src="tile.img" :alt="tile.title" class="snowowl__tile-image" />
            <h3>{{ tile.title }}</h3>
            <p class="section-subtext">Focus: {{ tile.skill }}</p>
          </article>
        </div>
      </section>

      <button class="btn btn--ghost snowowl__reset" @click="resetGames">Reset spellen</button>
    </div>

    <transition name="fade-scale">
      <div v-if="allGamesCompleted" class="snowowl__complete">
        <div class="snowowl__complete-card card surface-frosted">
          <h2>Gefeliciteerd, agent!</h2>
          <p>Je hebt alle missies voltooid. Gebruik de volledige code hieronder om de kluis te openen.</p>
          <div class="snowowl__vault-digits snowowl__vault-digits--large">
            <span v-for="(digit, index) in fullVaultDigits" :key="index" class="snowowl__vault-digit is-revealed">
              {{ digit }}
            </span>
          </div>
          <div class="snowowl__complete-actions">
            <button class="btn" @click="switchPlayer">Opnieuw spelen</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { db } from "../firebase";
import { collection, getDoc, doc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from 'vue-router';
import { useGameStore } from "../stores/gameStore";

export default {
  setup() {
    const showPopup = ref(true);
    const popupIndex = ref(0);
    const router = useRouter();
    const gameStore = useGameStore();
    const playerName = ref('');
    const vaultCode = ref('');

    const popups = ref([
      { title: "Welkom!", img: new URL('@/assets/sneeuwuil.png', import.meta.url).href, text: "Je staat op het punt om de ultieme test van S.H.A.D.E. te ervaren." },
      { title: "Wat is S.H.A.D.E?", img: new URL('@/assets/sneeuwuil.png', import.meta.url).href, text: "S.H.A.D.E. beschermt onze digitale samenleving. Alleen de scherpste agenten krijgen toegang." },
      { title: "De nacht van de sneeuwuil", img: new URL('@/assets/sneeuwuil.png', import.meta.url).href, text: "Voltooi vijf missies verspreid over het leerplein en verzamel alle cijfers van de kluis." },
      { title: "Hoe werkt het?", img: new URL('@/assets/sneeuwuil.png', import.meta.url).href, text: "Ga naar de locatie van elke missie, speel het spel, keer terug en voer de code in." },
      { title: "Jouw codenaam", img: new URL('@/assets/sneeuwuil.png', import.meta.url).href, text: "Vul je naam in en start de missie van de sneeuwuil!", input: true }
    ]);

    const tiles = ref([
      { id: 1, name: "Spel 1", img: new URL('@/assets/dimensions-collapsing.png', import.meta.url).href, title: "Dimensions collapsing", skill: "Ruimtelijk inzicht", available: true },
      { id: 2, name: "Spel 2", img: new URL('@/assets/agent-fromage.png', import.meta.url).href, title: "Agent Fromage", skill: "Vingervlugheid", available: true },
      { id: 3, name: "Spel 3", img: new URL('@/assets/laser-lockdown.png', import.meta.url).href, title: "Laser Lockdown", skill: "Precisie", available: true },
      { id: 4, name: "Spel 4", img: new URL('@/assets/feel-it.png', import.meta.url).href, title: "Feel IT", skill: "Presteren onder druk", available: true },
      { id: 5, name: "Spel 5", img: new URL('@/assets/dead-body.png', import.meta.url).href, title: "Murder mystery", skill: "Deductie", available: true }
    ]);

    const goForward = () => {
      if (popupIndex.value < popups.value.length - 1) {
        popupIndex.value += 1;
      }
    };

    const goBack = () => {
      if (popupIndex.value > 0) {
        popupIndex.value -= 1;
      }
    };

    const fetchGameStatus = async () => {
      for (let i = 1; i <= tiles.value.length; i++) {
        const gameRef = doc(db, "games", `game${i}`);
        const gameDoc = await getDoc(gameRef);

        if (gameDoc.exists()) {
          const isAvailable = gameDoc.data().available;
          const isCompletedByPlayer = gameStore.gameProgress[`game${i}completed`];
          tiles.value[i - 1].available = isAvailable && !isCompletedByPlayer;
        }
      }
    };

    const selectGame = async (index) => {
      if (!tiles.value[index].available) return;

      const gameRef = doc(db, "games", `game${index + 1}`);

      try {
        await updateDoc(gameRef, { available: false });
        tiles.value[index].available = false;
        router.push(`game${index + 1}`);
      } catch (error) {
        console.error("Fout bij het bijwerken van het spel:", error);
      }
    };

    const getRandomVaultCode = async () => {
      try {
        const docRef = doc(db, "vaultcodes", "codes");
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const allCodes = snapshot.data().codesArray;
          const randomIndex = Math.floor(Math.random() * allCodes.length);
          return allCodes[randomIndex];
        }
        return null;
      } catch (err) {
        console.error("Fout bij ophalen vaultcodes:", err);
        return null;
      }
    };

    const startGame = async () => {
      if (!canStart.value) {
        return;
      }

      playerName.value = playerName.value.trim();
      gameStore.setPlayerName(playerName.value);

      const code = await getRandomVaultCode();
      if (!code) {
        alert("Kon geen kluiscode ophalen. Probeer opnieuw.");
        return;
      }

      vaultCode.value = code;
      gameStore.vaultCode = code;
      localStorage.setItem("vaultCode", code);

      try {
        const gameInstanceRef = collection(db, "gameinstances");

        await addDoc(gameInstanceRef, {
          name: gameStore.playerName,
          start: serverTimestamp(),
          vaultCode: code,
          game1completed: false,
          game2completed: false,
          game3completed: false,
          game4completed: false,
          game5completed: false
        });

        showPopup.value = false;
      } catch (error) {
        console.error("Fout bij opslaan gameinstance:", error);
      }
    };

    const resetGames = async () => {
      try {
        for (let i = 1; i <= tiles.value.length; i++) {
          const gameRef = doc(db, "games", `game${i}`);
          await updateDoc(gameRef, { available: true });
        }
        tiles.value.forEach(tile => {
          tile.available = true;
        });
      } catch (error) {
        console.error("Fout bij het resetten van de spellen:", error);
      }
    };

    const switchPlayer = () => {
      gameStore.clearPlayer();
      showPopup.value = true;
      popupIndex.value = 0;
      playerName.value = '';
      vaultCode.value = '';
    };

    const completedCount = computed(() => {
      const progress = gameStore.gameProgress || {};
      return [
        progress.game1completed,
        progress.game2completed,
        progress.game3completed,
        progress.game4completed,
        progress.game5completed
      ].filter(Boolean).length;
    });

    const allGamesCompleted = computed(() => completedCount.value === tiles.value.length);

    const visibleVaultCode = computed(() => {
      const fullCode = gameStore.vaultCode || '';
      if (!fullCode || fullCode.length !== 5) return '*****';

      const progress = gameStore.gameProgress || {};
      const count = [
        progress.game1completed,
        progress.game2completed,
        progress.game3completed,
        progress.game4completed,
        progress.game5completed
      ].filter(Boolean).length;

      return fullCode
        .split('')
        .map((char, index) => (index < count ? char : '*'))
        .join('');
    });

    const vaultDigits = computed(() => visibleVaultCode.value.split(''));
    const fullVaultDigits = computed(() => (gameStore.vaultCode || '*****').split(''));
    const canStart = computed(() => playerName.value.trim().length > 1);

    const progressPercent = computed(() => {
      if (!tiles.value.length) return 0;
      return Math.round((completedCount.value / tiles.value.length) * 100);
    });

    const progressCircleStyle = computed(() => {
      const degrees = (progressPercent.value / 100) * 360;
      return {
        background: `conic-gradient(var(--accent-color) ${degrees}deg, rgba(255, 255, 255, 0.12) ${degrees}deg)`
      };
    });

    let statusInterval;
    onMounted(() => {
      const savedName = localStorage.getItem("playerName");

      if (savedName) {
        gameStore.playerName = savedName;
        gameStore.loadProgress();
        showPopup.value = false;
      }

      fetchGameStatus();
      statusInterval = setInterval(fetchGameStatus, 2500);
    });

    onBeforeUnmount(() => {
      clearInterval(statusInterval);
    });

    return {
      showPopup,
      popupIndex,
      popups,
      goForward,
      goBack,
      tiles,
      selectGame,
      resetGames,
      startGame,
      gameStore,
      playerName,
      completedCount,
      visibleVaultCode,
      vaultDigits,
      fullVaultDigits,
      allGamesCompleted,
      canStart,
      progressCircleStyle,
      switchPlayer
    };
  }
};
</script>

<style scoped>
.snowowl {
  display: flex;
  flex-direction: column;
  gap: var(--gap-lg);
  padding: 0 1.25rem;
  max-width: 980px;
  margin: 0 auto;
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.35s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

.snowowl__intro {
  text-align: left;
  display: grid;
  gap: 1.25rem;
  padding: 2rem 1.75rem;
}

.snowowl__intro-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.snowowl__intro-dots {
  display: inline-flex;
  gap: 0.5rem;
}

.snowowl__intro-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.15);
  transition: background 0.3s ease, transform 0.3s ease;
}

.snowowl__intro-dot.is-active {
  background: var(--accent-color);
  transform: scale(1.25);
}

.snowowl__intro-image {
  width: min(220px, 60vw);
  justify-self: center;
  filter: drop-shadow(0 22px 35px rgba(0, 0, 0, 0.45));
}

.snowowl__name-input {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 600;
  text-align: center;
}

.snowowl__intro-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.snowowl__dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--gap-lg);
}

.snowowl__welcome {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.75rem;
}

.snowowl__welcome h1 {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 5vw, 2.2rem);
  margin: 0.25rem 0 0;
}

.snowowl__status {
  display: grid;
  gap: 1.5rem;
}

.snowowl__progress {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.5rem;
  align-items: center;
}

.snowowl__progress-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  padding: 6px;
  background: rgba(255, 255, 255, 0.08);
}

.snowowl__progress-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(3, 6, 18, 0.85);
  display: grid;
  place-items: center;
  gap: 0.2rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.snowowl__progress-inner strong {
  font-size: 2rem;
  margin: 0;
}

.snowowl__progress-inner span {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.snowowl__progress-copy h3 {
  margin: 0;
  font-size: 1.3rem;
}

.snowowl__vault {
  display: grid;
  gap: 0.75rem;
}

.snowowl__vault-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.snowowl__vault-digits {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.snowowl__vault-digit {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-disabled);
  transition: transform 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

.snowowl__vault-digit.is-revealed {
  color: #fff;
  border-color: rgba(124, 92, 255, 0.35);
  background: rgba(124, 92, 255, 0.15);
  transform: translateY(-3px);
}

.snowowl__vault-digits--large .snowowl__vault-digit {
  width: 64px;
  height: 64px;
  font-size: 1.8rem;
}

.snowowl__tiles {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: left;
}

.snowowl__tile-grid {
  display: grid;
  gap: var(--gap-md);
}

.snowowl__tile {
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.snowowl__tile:hover {
  transform: translateY(-4px);
  box-shadow: 0 25px 40px rgba(6, 10, 25, 0.45);
}

.snowowl__tile.is-disabled {
  opacity: 0.55;
  cursor: not-allowed;
  filter: grayscale(0.2);
}

.snowowl__tile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.snowowl__tile-status {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.4rem 0.65rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-secondary);
}

.snowowl__tile-status.is-locked {
  background: rgba(255, 107, 107, 0.12);
  color: var(--danger-color);
}

.snowowl__tile-image {
  width: 100%;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.snowowl__tile h3 {
  margin: 0;
  font-size: 1.25rem;
}

.snowowl__reset {
  align-self: center;
}

.snowowl__complete {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  background: rgba(3, 6, 18, 0.7);
  backdrop-filter: blur(6px);
  z-index: 1050;
}

.snowowl__complete-card {
  max-width: 420px;
  text-align: center;
  display: grid;
  gap: 1.5rem;
  padding: 2.25rem 1.75rem;
}

.snowowl__complete-actions {
  display: flex;
  justify-content: center;
}

@media (min-width: 768px) {
  .snowowl__intro {
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }

  .snowowl__intro-image {
    width: min(260px, 100%);
  }

  .snowowl__intro-actions {
    justify-content: flex-end;
  }

  .snowowl__status {
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }

  .snowowl__vault {
    justify-items: flex-start;
  }

  .snowowl__tile-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
