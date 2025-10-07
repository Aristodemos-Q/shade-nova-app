<template>
  <div class="game-container">
    <div class="game-page">
      <h1>📶 FLAPPY WIFI</h1>
      
      <div class="mission-briefing">
        <p class="location"><strong>Locatie:</strong> 2.09 - Netwerklab - Signaal Testzone</p>
        <p class="objective"><strong>Missie:</strong> Navigeer je wifi-signaal door netwerkobstakels</p>
      </div>

      <div class="wifi-challenge">
        <h3>🌐 Wifi Signal Navigation Protocol</h3>
        <div class="instructions">
          <p><strong>📡 Concept:</strong> Stuur je wifi-signaal door een complexe netwerkomgeving vol obstakels zoals firewalls, routers en interferentie.</p>
          <p><strong>⚡ Controles:</strong> Gebruik timing en reflexen om je signaal stabiel te houden terwijl je door het netwerk navigeert.</p>
          <p><strong>🎯 Doel:</strong> Bereik het eindpunt zonder je verbinding te verliezen!</p>
        </div>
        
        <div class="code-input-section">
          <p class="instruction">Voer de wifi-toegangscode in:</p>
          <div class="wifi-access-container">
            <input 
              v-model="enteredCode" 
              type="text" 
              placeholder="Code..." 
              class="code-input"
              @keyup.enter="checkCode"
            />
            <button @click="checkCode" class="connect-button">CONNECT SIGNAL</button>
          </div>
        </div>
      </div>
      
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script>
import { useGameStore } from "@/stores/gameStore";
import { useRouter } from "vue-router";
import { db } from "@/firebase";
import { updateDoc, query, where, getDocs, collection, doc } from "firebase/firestore";

export default {
  name: "FlappyWifi",
  data() {
    return {
      correctCode: "100101",
      enteredCode: "",
      errorMessage: "",
      successMessage: "",
      gameimages: [new URL('@/assets/game3/laser1.png', import.meta.url).href, new URL('@/assets/game3/laser2.png', import.meta.url).href, new URL('@/assets/game3/laser3.png', import.meta.url).href, new URL('@/assets/game3/laser4.png', import.meta.url).href]
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
      if (this.enteredCode.toUpperCase() === this.correctCode.toUpperCase()) {
        this.successMessage = "🎉 Wifi verbinding succesvol! Signal navigation protocol voltooid!";
        this.errorMessage = "";
        
        // Update voortgang in Pinia store en Firestore
        this.gameStore.completeGame("game3completed");

        try {
          const gameInstanceRef = collection(db, "gameinstances");
          const q = query(gameInstanceRef, where("name", "==", this.gameStore.playerName));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const playerDoc = querySnapshot.docs[0];
            await updateDoc(playerDoc.ref, { game3completed: true });

            // Zet het spel opnieuw beschikbaar
            const gameRef = doc(db, "games", "game3");
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
        this.errorMessage = "Verbinding mislukt! Controleer je wifi-toegangscode.";
        this.successMessage = "";
      }
    }
  }
};
</script>

<style scoped>
.game-container {
  padding: 20px;
  background: linear-gradient(135deg, #001122 0%, #003366 50%, #004488 100%);
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
  background: linear-gradient(135deg, #002244 0%, #003366 50%, #001133 100%);
  color: #00BFFF;
  font-family: 'Orbitron', sans-serif;
  border: 4px solid #00BFFF;
  box-shadow: 0 0 30px #00BFFF, inset 0 0 20px rgba(0, 191, 255, 0.1);
  max-width: 700px;
  margin: 30px;
  border-radius: 20px;
  position: relative;
  z-index: 2;
}

.game-page h1 {
  color: #00BFFF;
  text-shadow: 0 0 20px #00BFFF;
  margin-bottom: 25px;
  font-size: 2.2em;
  font-weight: bold;
}

.mission-briefing {
  background: rgba(0, 191, 255, 0.1);
  padding: 20px;
  border-radius: 15px;
  border: 2px solid #00BFFF;
  margin: 20px 0;
  text-align: left;
}

.location, .objective {
  margin: 12px 0;
  font-size: 1.1em;
}

.wifi-challenge {
  background: rgba(0, 0, 0, 0.3);
  padding: 25px;
  border-radius: 15px;
  border-left: 6px solid #00BFFF;
  margin: 25px 0;
  text-align: left;
}

.wifi-challenge h3 {
  color: #00BFFF;
  margin-bottom: 20px;
  text-align: center;
  font-size: 1.4em;
}

.instructions {
  margin: 20px 0;
}

.instructions p {
  margin: 12px 0;
  line-height: 1.6;
  background: rgba(0, 191, 255, 0.05);
  padding: 10px;
  border-radius: 8px;
  border-left: 3px solid #00BFFF;
}

.code-input-section {
  background: rgba(0, 191, 255, 0.08);
  padding: 30px;
  border-radius: 15px;
  margin: 25px 0;
  border: 3px solid #00BFFF;
  text-align: center;
}

.instruction {
  margin-bottom: 25px;
  font-size: 1.2em;
  color: #00BFFF;
  text-shadow: 0 0 10px #00BFFF;
}

.wifi-access-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  max-width: 260px;
  margin: 0 auto;
}

.wifi-access-container .code-input,
.wifi-access-container .connect-button {
  width: 100%;
}

.code-input {
  padding: 14px 18px;
  border: 2px solid #00BFFF;
  background-color: rgba(0, 34, 68, 0.85);
  color: #E0E8F0;
  font-size: 1.05em;
  text-align: center;
  border-radius: 12px;
  font-weight: 600;
  width: 230px;
  height: 52px;
  box-sizing: border-box;
  letter-spacing: 1px;
  line-height: 1.2;
  box-shadow: 0 0 10px rgba(0, 191, 255, 0.25);
}

.code-input:focus {
  outline: none;
  box-shadow: 0 0 25px #00BFFF, inset 0 0 15px rgba(0, 191, 255, 0.2);
  background-color: rgba(0, 51, 102, 0.9);
  color: white;
}

.connect-button {
  padding: 14px 18px;
  background: linear-gradient(135deg, #00A2FF, #00C8FF);
  color: white;
  border: 2px solid #00BFFF;
  cursor: pointer;
  font-size: 1.05em;
  border-radius: 12px;
  font-weight: 700;
  transition: all 0.25s ease;
  text-transform: uppercase;
  white-space: nowrap;
  width: 230px;
  height: 52px;
  box-sizing: border-box;
  box-shadow: 0 0 14px rgba(0, 191, 255, 0.35);
  font-family: 'Orbitron', sans-serif;
}

.connect-button:hover {
  background: linear-gradient(135deg, #00C8FF, #00A2FF);
  box-shadow: 0 0 18px #00BFFF, 0 0 30px rgba(0, 191, 255, 0.25);
  transform: translateY(-2px);
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

.success {
  color: #4CAF50;
  font-weight: bold;
  margin-top: 15px;
  background: rgba(76, 175, 80, 0.1);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #4CAF50;
}

@media (max-width: 600px) {
  .input-container {
    max-width: 280px;
  }
  
  .code-input {
    width: 100%;
    max-width: 280px;
  }
  
  .connect-button {
    width: 100%;
    max-width: 280px;
  }
  
  .game-page {
    padding: 20px;
    margin: 15px;
  }
}
</style>