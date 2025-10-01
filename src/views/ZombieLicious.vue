<template>
  <div class="game-container">
    <div class="game-page">
      <h1>🧟‍♂️ ZOMBIE LICIOUS - SURVIVAL PROTOCOL 🧠</h1>
      <div class="mission-briefing">
        <p class="location">📍 <strong>Locatie:</strong> 2.09 - Overlevingscommandopost - Tactisch Operatiecentrum</p>
        <p class="threat-level">⚠️ <strong>Dreiging Niveau:</strong> KRITIEK - Zombie Uitbraak Gedetecteerd</p>
        <p class="objective">🎯 <strong>Primaire Missie:</strong> Ontwikkel strategische overlevingsplannen</p>
      </div>
      
      <div class="tactical-instructions">
        <h3>🛡️ Tactische Instructies:</h3>
        <ul>
          <li>📦 Verzamel en beheer schaarse resources efficient</li>
          <li>🏗️ Bouw strategische verdedigingsposten tegen zombie hordes</li>
          <li>⚔️ Plan aanvalsroutes en vluchtstrategieën</li>
          <li>🧪 Onderzoek zombie zwakheden voor tactisch voordeel</li>
          <li>🤝 Coördineer met andere overlevenden voor maximale effectiviteit</li>
        </ul>
      </div>
      
      <div class="code-input-section">
        <h3>🔐 Overlevings-Authenticatie Protocol</h3>
        <p>Voer je verdiende strategische toegangscode in:</p>
        <input v-model="enteredCode" type="text" placeholder="🧟 Survival Access Code..." class="tactical-input" />
        <button @click="checkCode" class="tactical-button">🚀 Execute Protocol</button>
      </div>
      
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
    <!-- <div class="game-images">
      <img :src="gameimages[0]" class="gameimage" />
      <img :src="gameimages[1]" class="gameimage" />
    </div> -->
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
      correctCode: "SURVIVE", // Strategic survival code
      enteredCode: "",
      errorMessage: "",
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
        // 🔹 Update voortgang in Pinia store en Firestore
        this.gameStore.completeGame("game4completed");

        try {
          const gameInstanceRef = collection(db, "gameinstances");
          const q = query(gameInstanceRef, where("name", "==", this.gameStore.playerName));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const playerDoc = querySnapshot.docs[0];
            await updateDoc(playerDoc.ref, { game4completed: true });

            // 🔹 Zet het spel opnieuw beschikbaar
            const gameRef = doc(db, "games", "game4");
            await updateDoc(gameRef, { available: true });
          } else {
            console.error("Speler niet gevonden in Firestore!");
          }
        } catch (error) {
          console.error("Fout bij updaten van Firestore:", error);
        }

        // 🔹 Stuur speler na 2 seconden naar /snowowl
        setTimeout(() => {
          this.router.push("/snowowl");
        }, 2000);
      } else {
        this.errorMessage = "Verkeerde code... het mysterie blijft onopgelost.";
      }
    }
  }
};
</script>

<style scoped>
.game-container {
  /* background: url('@/assets/background.jpg') no-repeat center center fixed; */
  margin-top:5vh;
  background: #111;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.game-page {
  text-align: left;
  padding: 30px;
  background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #0d0d0d 100%);
  color: #ff6b35;
  font-family: 'Orbitron', sans-serif;
  border: 3px solid #ff6b35;
  box-shadow: 0 0 25px #ff6b35, inset 0 0 15px rgba(255, 107, 53, 0.1);
  max-width: 700px;
  margin: 30px;
  border-radius: 15px;
  position: relative;
  z-index: 2;
}

.game-page h1 {
  text-align: center;
  color: #ff6b35;
  text-shadow: 0 0 20px #ff6b35;
  margin-bottom: 25px;
  font-size: 2.2em;
}

.mission-briefing {
  background: rgba(255, 107, 53, 0.1);
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #ff6b35;
  margin: 20px 0;
}

.location, .threat-level, .objective {
  margin: 10px 0;
  font-size: 1.1em;
}

.tactical-instructions {
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 10px;
  border-left: 5px solid #ff6b35;
  margin: 20px 0;
}

.tactical-instructions h3 {
  color: #ff6b35;
  margin-bottom: 15px;
}

.tactical-instructions ul {
  list-style: none;
  padding: 0;
}

.tactical-instructions li {
  margin: 8px 0;
  padding: 5px 0;
  border-bottom: 1px solid rgba(255, 107, 53, 0.3);
}

.code-input-section {
  text-align: center;
  background: rgba(255, 107, 53, 0.05);
  padding: 25px;
  border-radius: 10px;
  margin: 25px 0;
}

.code-input-section h3 {
  color: #ff6b35;
  margin-bottom: 15px;
}

.tactical-input {
  margin: 15px 10px;
  padding: 15px;
  border: 2px solid #ff6b35;
  background-color: #1a1a1a;
  color: white;
  font-size: 1.2em;
  text-align: center;
  border-radius: 8px;
  font-weight: bold;
}

.tactical-input:focus {
  outline: none;
  box-shadow: 0 0 15px #ff6b35;
}

.tactical-button {
  padding: 15px 25px;
  background: linear-gradient(135deg, #ff6b35, #ff4500);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
  border-radius: 8px;
  font-weight: bold;
  transition: all 0.3s ease;
  text-transform: uppercase;
}

.tactical-button:hover {
  background: linear-gradient(135deg, #ff4500, #ff6b35);
  box-shadow: 0 0 20px #ff6b35;
  transform: translateY(-2px);
}

.error {
  color: yellow;
  margin-top: 10px;
  font-weight: bold;
}
.gameimages {
  display: flex;
  flex-direction: column;
}
.gameimage {
  max-width: 80%;
  border:#000000;
  border-radius: 10px;
  margin: 10px;
}
</style>
