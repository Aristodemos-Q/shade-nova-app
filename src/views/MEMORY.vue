<template>
  <div class="game-container">
    <div class="game-page">
      <h1>🧠 MEMORY TRAINING</h1>
      
      <div class="mission-briefing">
        <p class="location"><strong>Locatie:</strong> 2.09 - Neurologische Lab</p>
        <p class="objective"><strong>Missie:</strong> Haal 15 punten</p>
      </div>

      <div class="memory-challenge">
        <h3>💭 Neural Memory Enhancement Protocol</h3>
        <div class="instructions">
          <p><strong>🧠 Concept:</strong> Train je geheugen door patronen te onthouden en je concentratie te verbeteren in deze neuraal-geoptimaliseerde omgeving.</p>
          <p><strong>⚡ Controles:</strong> Gebruik je korte- en langetermijngeheugen om sequenties en patronen te herkennen en te reproduceren.</p>
          <p><strong>🎯 Doel:</strong> Bereik 15 punten door succesvol geheugen-challenges te voltooien!</p>
        </div>
        
        <div class="code-input-section">
          <p class="instruction">Voer de neuraal-toegangscode in:</p>
          <div class="memory-access-container">
            <input 
              v-model="enteredCode" 
              type="text" 
              placeholder="Code..." 
              class="code-input"
              @keyup.enter="checkCode"
            />
            <button @click="checkCode" class="connect-button">ACTIVATE MEMORY</button>
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
  name: "MemoryGame",
  data() {
    return {
      correctCode: "12345",
      enteredCode: "",
      errorMessage: "",
      successMessage: "",
      gameimages: [new URL('@/assets/game2/agentfromage1.png', import.meta.url).href, new URL('@/assets/game2/agentfromage2.png', import.meta.url).href, new URL('@/assets/game2/agentfromage3.png', import.meta.url).href]
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
        this.successMessage = "🎉 Neuraal netwerk geactiveerd! Memory training protocol voltooid!";
        this.errorMessage = "";
        
        // Update voortgang in Pinia store en Firestore
        this.gameStore.completeGame("game2completed");

        try {
          const gameInstanceRef = collection(db, "gameinstances");
          const q = query(gameInstanceRef, where("name", "==", this.gameStore.playerName));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const playerDoc = querySnapshot.docs[0];
            await updateDoc(playerDoc.ref, { game2completed: true });

            // Zet het spel opnieuw beschikbaar
            const gameRef = doc(db, "games", "game2");
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
        this.errorMessage = "Neuraal toegang geweigerd! Heractiveer je geheugen protocol.";
        this.successMessage = "";
      }
    }
  }
};
</script>

<style scoped>
.game-container {
  padding: 20px;
  background: linear-gradient(135deg, #1a0d2e 0%, #2d1b4e 50%, #4c2a73 100%);
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
  background: linear-gradient(135deg, #2d1b4e 0%, #4c2a73 50%, #1a0d2e 100%);
  color: #E6B8FF;
  font-family: 'Orbitron', sans-serif;
  border: 4px solid #E6B8FF;
  box-shadow: 0 0 30px #E6B8FF, inset 0 0 20px rgba(230, 184, 255, 0.1);
  max-width: 700px;
  margin: 30px;
  border-radius: 20px;
  position: relative;
  z-index: 2;
}

.game-page h1 {
  color: #E6B8FF;
  text-shadow: 0 0 20px #E6B8FF;
  margin-bottom: 25px;
  font-size: 2.2em;
  font-weight: bold;
}

.mission-briefing {
  background: rgba(230, 184, 255, 0.1);
  padding: 20px;
  border-radius: 15px;
  border: 2px solid #E6B8FF;
  margin: 20px 0;
  text-align: left;
}

.location, .objective {
  margin: 12px 0;
  font-size: 1.1em;
}

.memory-challenge {
  background: rgba(0, 0, 0, 0.3);
  padding: 25px;
  border-radius: 15px;
  border-left: 6px solid #E6B8FF;
  margin: 25px 0;
  text-align: left;
}

.memory-challenge h3 {
  color: #E6B8FF;
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
  background: rgba(230, 184, 255, 0.05);
  padding: 10px;
  border-radius: 8px;
  border-left: 3px solid #E6B8FF;
}

.code-input-section {
  background: rgba(230, 184, 255, 0.08);
  padding: 30px;
  border-radius: 15px;
  margin: 25px 0;
  border: 3px solid #E6B8FF;
  text-align: center;
}

.instruction {
  margin-bottom: 25px;
  font-size: 1.2em;
  color: #E6B8FF;
  text-shadow: 0 0 10px #E6B8FF;
}

.memory-access-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  max-width: 260px;
  margin: 0 auto;
}

.memory-access-container .code-input,
.memory-access-container .connect-button {
  width: 100%;
}

.code-input {
  padding: 14px 18px;
  border: 2px solid #E6B8FF;
  background-color: rgba(45, 27, 78, 0.85);
  color: #F0E8FF;
  font-size: 1.05em;
  text-align: center;
  border-radius: 12px;
  font-weight: 600;
  width: 230px;
  height: 52px;
  box-sizing: border-box;
  letter-spacing: 1px;
  line-height: 1.2;
  box-shadow: 0 0 10px rgba(230, 184, 255, 0.25);
}

.code-input:focus {
  outline: none;
  box-shadow: 0 0 25px #E6B8FF, inset 0 0 15px rgba(230, 184, 255, 0.2);
  background-color: rgba(76, 42, 115, 0.9);
  color: white;
}

.connect-button {
  padding: 14px 18px;
  background: linear-gradient(135deg, #9B59B6, #E6B8FF);
  color: white;
  border: 2px solid #E6B8FF;
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
  box-shadow: 0 0 14px rgba(230, 184, 255, 0.35);
  font-family: 'Orbitron', sans-serif;
}

.connect-button:hover {
  background: linear-gradient(135deg, #E6B8FF, #9B59B6);
  box-shadow: 0 0 18px #E6B8FF, 0 0 30px rgba(230, 184, 255, 0.25);
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