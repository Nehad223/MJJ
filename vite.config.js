import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // إذا مشروع React

export default defineConfig({
  plugins: [react()],
  // هذا أهم سطر
  base: '/MJJ/', 
})
