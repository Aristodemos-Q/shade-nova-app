import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import SnowOwl from '../views/SnowOwl.vue';
import MarioSurvive from '@/views/MarioSurvive.vue';
import ZombieLicious from '@/views/ZombieLicious.vue';
import CyberClues from '@/views/CyberClues.vue';
import Memory from '@/views/Memory.vue';
import FlappyWifi from '@/views/FlappyWifi.vue';
import QrCode from '@/views/QrCode.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/snowowl', component: SnowOwl },
  { path: '/game1', component: CyberClues },
  { path: '/game2', component: Memory },
  { path: '/game3', component: FlappyWifi },
  { path: '/game4', component: ZombieLicious },
  { path: '/game5', component: MarioSurvive },
  { path: '/qrcode', component: QrCode }
  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
