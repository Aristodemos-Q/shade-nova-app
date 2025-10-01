<template>
  <div class="game-container">
    <div class="game-page">
      <h1>MEMORY MASTERS - COGNITIEVE CHALLENGE</h1>
      
      <div class="mission-briefing">
        <p class="location"><strong>Locatie:</strong> 2.09 - Neurologische Lab - Geheugencentrum</p>
        <p class="objective"><strong>Missie:</strong> Test je geheugen en concentratievermogen</p>
      </div>

      <div class="memory-challenge">
        <h3>Geheugen Activatie Protocol</h3>
        
        <div class="code-input-section">
          <p class="instruction">Voer de geheugen-toegangscode in:</p>
          <div class="input-container">
            <input 
              v-model="enteredCode" 
              type="text" 
              placeholder="Geheugencode..." 
              class="memory-input"
              maxlength="5"
              @keyup.enter="checkCode"
            />
            <button @click="checkCode" class="memory-button">Valideer Geheugen</button>
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
  name: 'MemoryGame',
  data() {
    return {
      correctCode: "12345", // Memory challenge code
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
      if (this.enteredCode === this.correctCode) {
        this.successMessage = "🎉 Gefeliciteerd! Je geheugen is uitstekend! Memory Masters protocol voltooid!";
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
        this.errorMessage = "Onjuiste code! Gebruik je geheugen en concentratie om de juiste reeks te vinden.";
        this.successMessage = "";
      }
    }
  }
};
</script>

<style scoped>
.game-container {
  padding: 20px;
  background: linear-gradient(135deg, #0a0a2e 0%, #16213e 50%, #1a1a3e 100%);
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
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
  color: #00ffff;
  font-family: 'Orbitron', sans-serif;
  border: 4px solid #00ffff;
  box-shadow: 0 0 30px #00ffff, inset 0 0 20px rgba(0, 255, 255, 0.1);
  max-width: 700px;
  margin: 30px;
  border-radius: 20px;
  position: relative;
  z-index: 2;
}

.game-page h1 {
  color: #00ffff;
  text-shadow: 0 0 20px #00ffff;
  margin-bottom: 25px;
  font-size: 2.2em;
  font-weight: bold;
}

.mission-briefing {
  background: rgba(0, 255, 255, 0.1);
  padding: 20px;
  border-radius: 15px;
  border: 2px solid #00ffff;
  margin: 20px 0;
  text-align: left;
}

.location, .objective {
  margin: 12px 0;
  font-size: 1.1em;
}

.description {
  margin: 15px 0;
  line-height: 1.6;
  font-size: 1em;
}

.memory-challenge {
  background: rgba(0, 0, 0, 0.3);
  padding: 25px;
  border-radius: 15px;
  border-left: 6px solid #00ffff;
  margin: 25px 0;
  text-align: left;
}

.memory-challenge h3 {
  color: #00ffff;
  margin-bottom: 20px;
  text-align: center;
  font-size: 1.4em;
}

.hint {
  background: rgba(0, 255, 255, 0.05);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid rgba(0, 255, 255, 0.3);
  margin: 15px 0;
}

.code-input-section {
  background: rgba(0, 255, 255, 0.08);
  padding: 30px;
  border-radius: 15px;
  margin: 25px 0;
  border: 3px solid #00ffff;
  text-align: center;
}

.instruction {
  margin-bottom: 20px;
  font-size: 1.1em;
  color: #00ffff;
}

.input-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.memory-input {
  padding: 15px;
  border: 3px solid #00ffff;
  background-color: #1a1a2e;
  color: white;
  font-size: 1.2em;
  text-align: center;
  border-radius: 12px;
  font-weight: bold;
  width: 200px;
}

.memory-input:focus {
  outline: none;
  box-shadow: 0 0 20px #00ffff;
  background-color: #16213e;
}

.memory-button {
  padding: 15px 30px;
  background: linear-gradient(135deg, #0066cc, #0099ff);
  color: white;
  border: 3px solid #00ffff;
  cursor: pointer;
  font-size: 1.2em;
  border-radius: 12px;
  font-weight: bold;
  transition: all 0.3s ease;
  text-transform: uppercase;
}

.memory-button:hover {
  background: linear-gradient(135deg, #0099ff, #0066cc);
  box-shadow: 0 0 25px #00ffff;
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
    flex-direction: column;
  }
  
  .memory-input {
    width: 100%;
    max-width: 250px;
  }
}
</style>