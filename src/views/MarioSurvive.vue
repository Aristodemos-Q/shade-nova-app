<template>
  <div class="game-container">
    <div class="game-page">
      <h1>MARIO SURVIVE - ADAPTATIE CHALLENGE</h1>
      
      <div class="world-briefing">
        <p class="location"><strong>Locatie:</strong> 2.09 - Retro Gaming Arena - Platform Survival Zone</p>
        <p class="challenge-level"><strong>Challenge Niveau:</strong> Dynamische Aanpassingstest</p>
        <p class="objective"><strong>Ultimate Goal:</strong> Bewijs je overlevingsinstinct in veranderende omgevingen</p>
      </div>
      
      <div class="survival-mechanics">
        <h3>Overlevings Mechanica:</h3>
        <div class="mechanics-grid">
          <div class="mechanic-item">
            <span class="icon">🏃‍♂️</span>
            <strong>Mobiliteit:</strong> Spring over gaten en platformen met perfecte timing
          </div>
          <div class="mechanic-item">
            <span class="icon">👾</span>
            <strong>Vijand Ontwijking:</strong> Vermijd Goombas, Koopa's en andere bedreigingen
          </div>
          <div class="mechanic-item">
            <span class="icon">⚡</span>
            <strong>Power-Up Beheer:</strong> Strategisch gebruik van mushrooms en sterren
          </div>
          <div class="mechanic-item">
            <span class="icon">🧩</span>
            <strong>Omgeving Aanpassing:</strong> Pas je strategie aan per level type
          </div>
        </div>
      </div>
      
      <div class="power-up-section">
        <h3>Power-Up Activatie Protocol</h3>
        <p>Verdien je Super Mario survival badge door de authenticatiecode in te voeren:</p>
        <div class="input-container">
          <input v-model="enteredCode" type="text" placeholder="Power-Up Access Code..." class="mario-input" />
          <button @click="checkCode" class="mario-button">Level Up!</button>
        </div>
      </div>
      
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>
  
<script>
import { useGameStore } from "@/stores/gameStore";
import { useRouter } from "vue-router";
import { db } from "@/firebase";
import { updateDoc, query, where, getDocs, collection, doc } from "firebase/firestore";

export default {
  data() {
    return {
      correctCode: "ADAPT", // Mario adaptation survival code
      enteredCode: "",
      errorMessage: "",
      gameimages: [new URL('@/assets/game5/ar1.png', import.meta.url).href, new URL('@/assets/game5/ar2.png', import.meta.url).href]
    };
  },
  setup() {
    return {
      gameStore: useGameStore(),
      router: useRouter(),
    };
  },
  methods: {
    async checkCode() {
      if (this.enteredCode.toUpperCase() === this.correctCode) {
        // Update voortgang in Pinia store en Firestore
        this.gameStore.completeGame("game5completed");

        try {
          const gameInstanceRef = collection(db, "gameinstances");
          const q = query(gameInstanceRef, where("name", "==", this.gameStore.playerName));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const playerDoc = querySnapshot.docs[0];
            await updateDoc(playerDoc.ref, { game5completed: true });

            // Zet het spel opnieuw beschikbaar
            const gameRef = doc(db, "games", "game5");
            await updateDoc(gameRef, { available: true });
          } else {
            console.error("Speler niet gevonden in Firestore!");
          }
        } catch (error) {
          console.error("Fout bij updaten van Firestore:", error);
        }

        // Stuur speler na 2 seconden naar /snowowl
        setTimeout(() => {
          this.router.push("/snowowl");
        }, 2000);
      } else {
        this.errorMessage = "Onjuiste code! Probeer je beter aan te passen aan de uitdaging!";
      }
    }
  }
};
</script>

<style scoped>
.game-container {
  padding: 20px;
  background: linear-gradient(135deg, #FFD700 0%, #FF8C00 50%, #FF4500 100%);
  background-size: cover;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.game-page {
  text-align: center;
  padding: 30px;
  background: linear-gradient(135deg, #1a4c96 0%, #2e7d32 50%, #1565c0 100%);
  color: #FFD700;
  font-family: 'Orbitron', sans-serif;
  border: 4px solid #FFD700;
  box-shadow: 0 0 30px #FFD700, inset 0 0 20px rgba(255, 215, 0, 0.1);
  max-width: 700px;
  margin: 30px;
  border-radius: 20px;
  position: relative;
  z-index: 2;
}

.game-page h1 {
  color: #FFD700;
  text-shadow: 0 0 20px #FFD700;
  margin-bottom: 25px;
  font-size: 2.2em;
  font-weight: bold;
}

.world-briefing {
  background: rgba(255, 215, 0, 0.1);
  padding: 20px;
  border-radius: 15px;
  border: 2px solid #FFD700;
  margin: 20px 0;
  text-align: left;
}

.location, .challenge-level, .objective {
  margin: 12px 0;
  font-size: 1.1em;
}

.survival-mechanics {
  background: rgba(0, 0, 0, 0.3);
  padding: 25px;
  border-radius: 15px;
  border-left: 6px solid #FFD700;
  margin: 25px 0;
  text-align: left;
}

.survival-mechanics h3 {
  color: #FFD700;
  margin-bottom: 20px;
  text-align: center;
  font-size: 1.4em;
}

.mechanics-grid {
  display: grid;
  gap: 15px;
}

.mechanic-item {
  padding: 15px;
  background: rgba(255, 215, 0, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.mechanic-item .icon {
  font-size: 1.5em;
  margin-right: 10px;
}

.power-up-section {
  background: rgba(255, 215, 0, 0.08);
  padding: 30px;
  border-radius: 15px;
  margin: 25px 0;
  border: 3px solid #FFD700;
}

.power-up-section h3 {
  color: #FFD700;
  margin-bottom: 15px;
  font-size: 1.4em;
}

.input-container {
  margin: 20px 0;
}

.mario-input {
  margin: 15px 10px;
  padding: 15px;
  border: 3px solid #FFD700;
  background-color: #1a4c96;
  color: white;
  font-size: 1.2em;
  text-align: center;
  border-radius: 12px;
  font-weight: bold;
  width: 250px;
}

.mario-input:focus {
  outline: none;
  box-shadow: 0 0 20px #FFD700;
  background-color: #2e7d32;
}

.mario-button {
  padding: 15px 30px;
  background: linear-gradient(135deg, #FF8C00, #FF4500);
  color: white;
  border: 3px solid #FFD700;
  cursor: pointer;
  font-size: 1.3em;
  border-radius: 12px;
  font-weight: bold;
  transition: all 0.3s ease;
  text-transform: uppercase;
  margin-left: 10px;
}

.mario-button:hover {
  background: linear-gradient(135deg, #FF4500, #FF8C00);
  box-shadow: 0 0 25px #FFD700;
  transform: translateY(-3px);
}

.error {
  color: #FF6B6B;
  font-weight: bold;
  margin-top: 15px;
  background: rgba(255, 107, 107, 0.1);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #FF6B6B;
}
</style>