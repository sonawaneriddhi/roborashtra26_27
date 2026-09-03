/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        blueprint: '#0A0F1A',
        blueprintDeep: '#060A12',
        panel: '#101826',
        ink: '#F4F6F8',
        amber: '#FF9F1C',
        amberDim: '#B96F0E',
        steel: '#3A6EA5',
        slate: '#5C6B7A',
        signal: '#E4572E',
        grid: 'rgba(90, 110, 130, 0.14)',
        // Editorial redesign palette
        ivory: '#F1EDE3',
        ivoryDeep: '#E8E3D8',
        black: '#070707',
        softBlack: '#111111',
        textDark: '#151515',
        textMuted: '#77736C',
        paperWhite: '#F7F7F3',
        rust: '#B84A32',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        ornate: ['var(--font-ornate)', 'serif'],
        cinzel: ['var(--font-cinzel)', '"Cinzel"', 'serif'],
        serifEd: ['var(--font-serif-ed)', 'serif'],
      },
      backgroundImage: {
        blueprintGrid:
          'linear-gradient(rgba(90,110,130,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(90,110,130,0.14) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '40px 40px',
      },
      letterSpacing: {
        widest2: '0.28em',
      },
    },
  },
  plugins: [],
}
