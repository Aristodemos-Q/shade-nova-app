<template>
  <div class="game-container">
    <div class="game-page">
      <h1>🧟‍♂️ ZOMBIE LICIOUS - SURVIVAL PROTOCOL</h1>
      
      <div class="mission-briefing">
        <p class="location"><strong>Locatie:</strong> 2.09 - Overlevingscommandopost</p>
        <p class="objective"><strong>Missie:</strong> Overleef</p>
      </div>

      <div class="survival-challenge">
        <h3>🛡️ Zombie Survival Navigation Protocol</h3>
        <div class="instructions">
          <p><strong>🧟‍♂️ Concept:</strong> Schiet de horders zombie's met je shotgun neer.</p>
          <p><strong>⚔️ Strategieën:</strong> Richt goed en kies de goede timing.</p>
          <p><strong>🎯 Doel:</strong> Behaal wave 5!</p>
        </div>
        
        <div class="code-input-section">
          <p class="instruction">Voer de overlevings-toegangscode in:</p>
          <div class="survival-access-container">
            <input 
              v-model="enteredCode" 
              type="text" 
              placeholder="Code..." 
              class="code-input"
              @keyup.enter="checkCode"
            />
            <button @click="checkCode" class="survive-button">EXECUTE SURVIVAL</button>
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
  name: "ZombieLicious",
  data() {
    return {
      correctCode: "12345",
      enteredCode: "",
      errorMessage: "",
      successMessage: "",
      gameimages: [new URL('@/assets/game4/bom.png', import.meta.url).href, new URL('@/assets/game4/bom2.png', import.meta.url).href]
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
        this.successMessage = "🎉 Overleving succesvol! Survival protocol voltooid!";
        this.errorMessage = "";
        
        // Update voortgang in Pinia store en Firestore
        this.gameStore.completeGame("game4completed");

        try {
          const gameInstanceRef = collection(db, "gameinstances");
          const q = query(gameInstanceRef, where("name", "==", this.gameStore.playerName));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const playerDoc = querySnapshot.docs[0];
            await updateDoc(playerDoc.ref, { game4completed: true });

            // Zet het spel opnieuw beschikbaar
            const gameRef = doc(db, "games", "game4");
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
        this.errorMessage = "Overleving mislukt! Controleer je survival toegangscode.";
        this.successMessage = "";
      }
    }
  }
};
</script>

<style scoped>
.game-container {
  padding: 20px;
  background: linear-gradient(135deg, #0a2200 0%, #1a4000 50%, #0d2a00 100%);
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
  background: linear-gradient(135deg, #1a1a00 0%, #2d4000 50%, #1a2200 100%);
  color: #ff6b35;
  font-family: 'Orbitron', sans-serif;
  border: 4px solid #ff6b35;
  box-shadow: 0 0 30px #ff6b35, inset 0 0 20px rgba(255, 107, 53, 0.1);
  max-width: 700px;
  margin: 30px;
  border-radius: 20px;
  position: relative;
  z-index: 2;
}

.game-page h1 {
  color: #ff6b35;
  text-shadow: 0 0 20px #ff6b35;
  margin-bottom: 25px;
  font-size: 2.2em;
  font-weight: bold;
}

.mission-briefing {
  background: rgba(255, 107, 53, 0.1);
  padding: 20px;
  border-radius: 15px;
  border: 2px solid #ff6b35;
  margin: 20px 0;
  text-align: left;
}

.location, .objective {
  margin: 12px 0;
  font-size: 1.1em;
}

.survival-challenge {
  background: rgba(0, 0, 0, 0.3);
  padding: 25px;
  border-radius: 15px;
  border-left: 6px solid #ff6b35;
  margin: 25px 0;
  text-align: left;
}

.survival-challenge h3 {
  color: #ff6b35;
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
  background: rgba(255, 107, 53, 0.05);
  padding: 10px;
  border-radius: 8px;
  border-left: 3px solid #ff6b35;
}

.code-input-section {
  background: rgba(255, 107, 53, 0.08);
  padding: 30px;
  border-radius: 15px;
  margin: 25px 0;
  border: 3px solid #ff6b35;
  text-align: center;
}

.instruction {
  margin-bottom: 25px;
  font-size: 1.2em;
  color: #ff6b35;
  text-shadow: 0 0 10px #ff6b35;
}

.survival-access-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  max-width: 260px;
  margin: 0 auto;
}

.survival-access-container .code-input,
.survival-access-container .survive-button {
  width: 100%;
}

.code-input {
  padding: 14px 18px;
  border: 2px solid #ff6b35;
  background-color: rgba(26, 64, 0, 0.85);
  color: #E0F0E8;
  font-size: 1.05em;
  text-align: center;
  border-radius: 12px;
  font-weight: 600;
  width: 230px;
  height: 52px;
  box-sizing: border-box;
  letter-spacing: 1px;
  line-height: 1.2;
  box-shadow: 0 0 10px rgba(255, 107, 53, 0.25);
}

.code-input:focus {
  outline: none;
  box-shadow: 0 0 25px #ff6b35, inset 0 0 15px rgba(255, 107, 53, 0.2);
  background-color: rgba(45, 64, 0, 0.9);
  color: white;
}

.survive-button {
  padding: 14px 18px;
  background: linear-gradient(135deg, #ff6b35, #cc3300);
  color: white;
  border: 2px solid #ff6b35;
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
  box-shadow: 0 0 14px rgba(255, 107, 53, 0.35);
  font-family: 'Orbitron', sans-serif;
}

.survive-button:hover {
  background: linear-gradient(135deg, #cc3300, #ff6b35);
  box-shadow: 0 0 18px #ff6b35, 0 0 30px rgba(255, 107, 53, 0.25);
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
  
  .survive-button {
    width: 100%;
    max-width: 280px;
  }
  
  .game-page {
    padding: 20px;
    margin: 15px;
  }
}
</style>
