<template>
  <div class="game-container">
    <div class="game-page">
      <h1>🔴 LASER LOCKDOWN - SECURITY PROTOCOL</h1>
      
      <div class="mission-briefing">
        <p class="location"><strong>Locatie:</strong> 2.09 - Beveiligingscentrum</p>
        <p class="objective"><strong>Missie:</strong> Ontwijken van lasers</p>
      </div>

      <div class="laser-challenge">
        <h3>LASER SECURITY NAVIGATION PROTOCOL</h3>
        <div class="instructions">
          <p><strong>🔴 Concept:</strong> Navigeer door het beveiligde laserrooster zonder detectie.</p>
          <p><strong>🎯 Strategieën:</strong> Bestudeer patronen, tijd je bewegingen perfect.</p>
          <p><strong>🔓 Doel:</strong> Bereik het einde zonder alarmen te activeren!</p>
        </div>
        
        <div class="code-input-section">
          <p class="instruction">Voer de laser-toegangscode in:</p>
          <div class="laser-access-container">
            <input 
              v-model="enteredCode" 
              type="text" 
              placeholder="Code..." 
              class="code-input"
              @keyup.enter="checkCode"
            />
            <button @click="checkCode" class="laser-button">EXECUTE LOCKDOWN</button>
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
  name: "LaserLockdown",
  data() {
    return {
      correctCode: "Kablam",
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
      if (this.enteredCode.toUpperCase() === this.correctCode.toUpperCase()) {
        this.successMessage = "🎉 Lockdown succesvol! Laser protocol voltooid!";
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
        this.errorMessage = "Lockdown mislukt! Controleer je laser toegangscode.";
        this.successMessage = "";
      }
    }
  }
};
</script>

<style scoped>
.game-container {
  padding: 20px;
  background: linear-gradient(135deg, #2d0a00 0%, #4d1500 50%, #3d1000 100%);
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
  background: linear-gradient(135deg, #2d1100 0%, #4d2200 50%, #3d1a00 100%);
  color: #ff4500;
  font-family: 'Orbitron', sans-serif;
  border: 4px solid #ff4500;
  box-shadow: 0 0 30px #ff4500, inset 0 0 20px rgba(255, 69, 0, 0.1);
  max-width: 700px;
  margin: 30px;
  border-radius: 20px;
  position: relative;
  z-index: 2;
}

.game-page h1 {
  color: #ff4500;
  text-shadow: 0 0 20px #ff4500;
  margin-bottom: 25px;
  font-size: 2.2em;
  font-weight: bold;
}

.mission-briefing {
  background: rgba(255, 69, 0, 0.1);
  padding: 20px;
  border-radius: 15px;
  border: 2px solid #ff4500;
  margin: 20px 0;
  text-align: left;
}

.location, .objective {
  margin: 12px 0;
  font-size: 1.1em;
}

.laser-challenge {
  background: rgba(0, 0, 0, 0.3);
  padding: 25px;
  border-radius: 15px;
  border-left: 6px solid #ff4500;
  margin: 25px 0;
  text-align: left;
}

.laser-challenge h3 {
  color: #ff4500;
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
  background: rgba(255, 69, 0, 0.05);
  padding: 10px;
  border-radius: 8px;
  border-left: 3px solid #ff4500;
}

.code-input-section {
  background: rgba(255, 69, 0, 0.08);
  padding: 30px;
  border-radius: 15px;
  margin: 25px 0;
  border: 3px solid #ff4500;
  text-align: center;
}

.instruction {
  margin-bottom: 25px;
  font-size: 1.2em;
  color: #ff4500;
  text-shadow: 0 0 10px #ff4500;
}

.laser-access-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  max-width: 260px;
  margin: 0 auto;
}

.laser-access-container .code-input,
.laser-access-container .laser-button {
  width: 100%;
}

.code-input {
  padding: 14px 18px;
  border: 2px solid #ff4500;
  background-color: rgba(77, 21, 0, 0.85);
  color: #fff3e0;
  font-size: 1.05em;
  text-align: center;
  border-radius: 12px;
  font-weight: 600;
  width: 230px;
  height: 52px;
  box-sizing: border-box;
  letter-spacing: 1px;
  line-height: 1.2;
  box-shadow: 0 0 10px rgba(255, 69, 0, 0.25);
}

.code-input:focus {
  outline: none;
  box-shadow: 0 0 25px #ff4500, inset 0 0 15px rgba(255, 69, 0, 0.2);
  background-color: rgba(77, 34, 0, 0.9);
  color: white;
}

.laser-button {
  padding: 14px 18px;
  background: linear-gradient(135deg, #ff4500, #cc2200);
  color: white;
  border: 2px solid #ff4500;
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
  box-shadow: 0 0 14px rgba(255, 69, 0, 0.35);
  font-family: 'Orbitron', sans-serif;
}

.laser-button:hover {
  background: linear-gradient(135deg, #cc2200, #ff4500);
  box-shadow: 0 0 18px #ff4500, 0 0 30px rgba(255, 69, 0, 0.25);
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
  
  .laser-button {
    width: 100%;
    max-width: 280px;
  }
  
  .game-page {
    padding: 20px;
    margin: 15px;
  }
}
</style>