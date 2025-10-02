<template>
  <div class="game-container">
    <div class="game-page">
      <h1>🔍 CYBER INVESTIGATION</h1>
      
      <div class="mission-briefing">
        <p class="location"><strong>Locatie:</strong> 2.09 - Cybersecurity Lab</p>
        <p class="objective"><strong>Missie:</strong> Haal 15 punten</p>
      </div>

      <div class="cyber-challenge">
        <h3>💻 Digital Forensics Protocol</h3>
        <div class="instructions">
          <p><strong>🔐 Concept:</strong> Analyseer gehackte systemen en verzamel digitale bewijzen in deze geavanceerde cybersecurity-omgeving.</p>
          <p><strong>⚡ Controles:</strong> Gebruik forensische tools om verborgen bestanden te ontdekken, metadata te analyseren, en netwerklogboeken te onderzoeken.</p>
          <p><strong>🎯 Doel:</strong> Bereik 15 punten door succesvol de cyber-toegangscode te kraken!</p>
        </div>
        
        <div class="code-input-section">
          <p class="instruction">Voer de cyber-toegangscode in:</p>
          <div class="cyber-access-container">
            <input 
              v-model="enteredCode" 
              type="text" 
              placeholder="Code..." 
              class="code-input"
              @keyup.enter="checkCode"
            />
            <button @click="checkCode" class="connect-button">DECRYPT ACCESS</button>
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
  name: "CyberCluesGame",
  data() {
    return {
      correctCode: "12345",
      enteredCode: "",
      errorMessage: "",
      successMessage: "",
      gameimages: [new URL('@/assets/game1/digitaltwin1.png', import.meta.url).href, new URL('@/assets/game1/digitaltwin2.png', import.meta.url).href]
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
        this.successMessage = "🎉 Cyber toegang verkregen! Digital forensics protocol voltooid!";
        this.errorMessage = "";
        
        // Update voortgang in Pinia store en Firestore
        this.gameStore.completeGame("game1completed");

        try {
          const gameInstanceRef = collection(db, "gameinstances");
          const q = query(gameInstanceRef, where("name", "==", this.gameStore.playerName));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const playerDoc = querySnapshot.docs[0];
            await updateDoc(playerDoc.ref, { game1completed: true });

            // Zet het spel opnieuw beschikbaar
            const gameRef = doc(db, "games", "game1");
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
        this.errorMessage = "Cyber toegang geweigerd! Heractiveer je forensische protocol.";
        this.successMessage = "";
      }
    }
  }
};
</script>

<style scoped>
.game-container {
  padding: 20px;
  background: linear-gradient(135deg, #0a0a0a 0%, #1e3c72 50%, #2a5298 100%);
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
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #0a0a0a 100%);
  color: #00FFFF;
  font-family: 'Orbitron', sans-serif;
  border: 4px solid #00FFFF;
  box-shadow: 0 0 30px #00FFFF, inset 0 0 20px rgba(0, 255, 255, 0.1);
  max-width: 700px;
  margin: 30px;
  border-radius: 20px;
  position: relative;
  z-index: 2;
}

.game-page h1 {
  color: #00FFFF;
  text-shadow: 0 0 20px #00FFFF;
  margin-bottom: 25px;
  font-size: 2.2em;
  font-weight: bold;
}

.mission-briefing {
  background: rgba(0, 255, 255, 0.1);
  padding: 20px;
  border-radius: 15px;
  border: 2px solid #00FFFF;
  margin: 20px 0;
  text-align: left;
}

.location, .objective {
  margin: 12px 0;
  font-size: 1.1em;
}

.cyber-challenge {
  background: rgba(0, 0, 0, 0.3);
  padding: 25px;
  border-radius: 15px;
  border-left: 6px solid #00FFFF;
  margin: 25px 0;
  text-align: left;
}

.cyber-challenge h3 {
  color: #00FFFF;
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
  background: rgba(0, 255, 255, 0.05);
  padding: 10px;
  border-radius: 8px;
  border-left: 3px solid #00FFFF;
}

.code-input-section {
  background: rgba(0, 255, 255, 0.08);
  padding: 30px;
  border-radius: 15px;
  margin: 25px 0;
  border: 3px solid #00FFFF;
  text-align: center;
}

.instruction {
  margin-bottom: 25px;
  font-size: 1.2em;
  color: #00FFFF;
  text-shadow: 0 0 10px #00FFFF;
}

.cyber-access-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  max-width: 260px;
  margin: 0 auto;
}

.cyber-access-container .code-input,
.cyber-access-container .connect-button {
  width: 100%;
}

.code-input {
  padding: 14px 18px;
  border: 2px solid #00FFFF;
  background-color: rgba(30, 60, 114, 0.85);
  color: #F0F8FF;
  font-size: 1.05em;
  text-align: center;
  border-radius: 12px;
  font-weight: 600;
  width: 230px;
  height: 52px;
  box-sizing: border-box;
  letter-spacing: 1px;
  line-height: 1.2;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.25);
}

.code-input:focus {
  outline: none;
  box-shadow: 0 0 25px #00FFFF, inset 0 0 15px rgba(0, 255, 255, 0.2);
  background-color: rgba(42, 82, 152, 0.9);
  color: white;
}

.connect-button {
  padding: 14px 18px;
  background: linear-gradient(135deg, #0080FF, #00FFFF);
  color: white;
  border: 2px solid #00FFFF;
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
  box-shadow: 0 0 14px rgba(0, 255, 255, 0.35);
  font-family: 'Orbitron', sans-serif;
}

.connect-button:hover {
  background: linear-gradient(135deg, #00FFFF, #0080FF);
  box-shadow: 0 0 18px #00FFFF, 0 0 30px rgba(0, 255, 255, 0.25);
  transform: translateY(-2px);
}

.error {
  color: #FF4444;
  font-weight: bold;
  margin-top: 15px;
  background: rgba(255, 68, 68, 0.1);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #FF4444;
}

.success {
  color: #00FF88;
  font-weight: bold;
  margin-top: 15px;
  background: rgba(0, 255, 136, 0.1);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #00FF88;
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