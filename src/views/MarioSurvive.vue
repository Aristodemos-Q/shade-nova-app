<template>
  <div class="game-container">
    <div class="game-page">
      <h1>🍄 MARIO SURVIVE</h1>
      
      <div class="mission-briefing">
        <p class="location"><strong>Locatie:</strong> 2.09 - Retro Gaming Arena</p>
        <p class="objective"><strong>Missie:</strong> Overleven voor 1 minuut</p>
      </div>

      <div class="mario-challenge">
        <h3>🎮 Mario Survival Protocol</h3>
        <div class="instructions">
          <p><strong>🏃‍♂️ Concept:</strong> Mario probeert het lava en vallende dingen te ontwijken terwijl je probeert 1 minuut te overleven.</p>
          <p><strong>� Controles:</strong> Gebruik platforming skills en timing om alle bedreigingen te vermijden en in leven te blijven.</p>
          <p><strong>⭐ Doel:</strong> Overleef precies 1 minuut zonder een leven te verliezen!</p>
        </div>
        
        <div class="code-input-section">
          <p class="instruction">Voer de survival-code in:</p>
          <div class="mario-access-container">
            <input 
              v-model="enteredCode" 
              type="text" 
              placeholder="Code..." 
              class="code-input"
              @keyup.enter="checkCode"
            />
            <button @click="checkCode" class="connect-button">POWER UP!</button>
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
  name: "MarioSurvive",
  data() {
    return {
      correctCode: "12345",
      enteredCode: "",
      errorMessage: "",
      successMessage: "",
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
        this.successMessage = "🎉 Power-Up geactiveerd! Mario survival challenge voltooid!";
        this.errorMessage = "";
        
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
        this.errorMessage = "Game Over! Controleer je survival-code en probeer opnieuw.";
        this.successMessage = "";
      }
    }
  }
};
</script>

<style scoped>
.game-container {
  padding: 20px;
  background: linear-gradient(135deg, #8B4513 0%, #228B22 50%, #FF6347 100%);
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
  background: linear-gradient(135deg, #8B0000 0%, #228B22 50%, #654321 100%);
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

.mission-briefing {
  background: rgba(255, 215, 0, 0.1);
  padding: 20px;
  border-radius: 15px;
  border: 2px solid #FFD700;
  margin: 20px 0;
  text-align: left;
}

.location, .objective {
  margin: 12px 0;
  font-size: 1.1em;
}

.mario-challenge {
  background: rgba(0, 0, 0, 0.3);
  padding: 25px;
  border-radius: 15px;
  border-left: 6px solid #FFD700;
  margin: 25px 0;
  text-align: left;
}

.mario-challenge h3 {
  color: #FFD700;
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
  background: rgba(255, 215, 0, 0.05);
  padding: 10px;
  border-radius: 8px;
  border-left: 3px solid #FFD700;
}

.code-input-section {
  background: rgba(255, 215, 0, 0.08);
  padding: 30px;
  border-radius: 15px;
  margin: 25px 0;
  border: 3px solid #FFD700;
  text-align: center;
}

.instruction {
  margin-bottom: 25px;
  font-size: 1.2em;
  color: #FFD700;
  text-shadow: 0 0 10px #FFD700;
}

.mario-access-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  max-width: 260px;
  margin: 0 auto;
}

.mario-access-container .code-input,
.mario-access-container .connect-button {
  width: 100%;
}

.code-input {
  padding: 14px 18px;
  border: 2px solid #FFD700;
  background-color: rgba(139, 0, 0, 0.85);
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
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.25);
}

.code-input:focus {
  outline: none;
  box-shadow: 0 0 25px #FFD700, inset 0 0 15px rgba(255, 215, 0, 0.2);
  background-color: rgba(34, 139, 34, 0.9);
  color: white;
}

.connect-button {
  padding: 14px 18px;
  background: linear-gradient(135deg, #FF4500, #FF8C00);
  color: white;
  border: 2px solid #FFD700;
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
  box-shadow: 0 0 14px rgba(255, 215, 0, 0.35);
  font-family: 'Orbitron', sans-serif;
}

.connect-button:hover {
  background: linear-gradient(135deg, #FF8C00, #FF4500);
  box-shadow: 0 0 18px #FFD700, 0 0 30px rgba(255, 215, 0, 0.25);
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