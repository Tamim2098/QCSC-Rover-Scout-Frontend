import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Tailwind v4 এর জন্য এটি যোগ করতে হয়

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // এখানে টেইলউইন্ড প্লাগিন কল করা হলো
  ],
})