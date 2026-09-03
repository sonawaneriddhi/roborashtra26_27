import { motion } from 'framer-motion'

export default function RobotMascot({ armRaised, className = '' }) {
  return (
    <svg
      viewBox="0 0 100 110"
      className={className}
      aria-hidden="true"
    >
      {/* antenna */}
      <motion.circle cx="50" cy="10" r="3" fill="#070707" />
      <line x1="50" y1="13" x2="50" y2="22" stroke="#070707" strokeWidth="2" />

      {/* head */}
      <rect x="30" y="22" width="40" height="30" rx="8" fill="#F1EDE3" stroke="#070707" strokeWidth="2" />
      {/* eyes */}
      <circle cx="42" cy="37" r="3.4" fill="#070707" />
      <circle cx="58" cy="37" r="3.4" fill="#070707" />

      {/* body */}
      <rect x="26" y="54" width="48" height="36" rx="10" fill="#F1EDE3" stroke="#070707" strokeWidth="2" />
      <rect x="38" y="64" width="24" height="14" rx="3" fill="none" stroke="#B84A32" strokeWidth="1.6" />

      {/* left arm (static) */}
      <line x1="26" y1="66" x2="12" y2="76" stroke="#070707" strokeWidth="3" strokeLinecap="round" />
      <circle cx="12" cy="76" r="3.2" fill="#070707" />

      {/* right arm (animated: raises to tap) */}
      <motion.g
        style={{ originX: '74px', originY: '66px' }}
        animate={{ rotate: armRaised ? -95 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <line x1="74" y1="66" x2="88" y2="76" stroke="#070707" strokeWidth="3" strokeLinecap="round" />
        <circle cx="88" cy="76" r="3.2" fill="#070707" />
      </motion.g>

      {/* legs */}
      <line x1="38" y1="90" x2="38" y2="104" stroke="#070707" strokeWidth="3" strokeLinecap="round" />
      <line x1="62" y1="90" x2="62" y2="104" stroke="#070707" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
