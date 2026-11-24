import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import cinnamorollSrc from '../assets/images/trinket-cinnamoroll.png';
import bunnySrc from '../assets/images/trinket-bunny.png';
import starSrc from '../assets/images/trinket-star.png';
import bowSrc from '../assets/images/trinket-bow.png';

/**
 * Scattered floating sketchbook trinkets.
 * Edit `message` on any item to customize its hover pop-up note.
 */
const TRINKETS = [
  {
    id: 'cinnamoroll',
    src: cinnamorollSrc,
    alt: 'Hand-drawn Cinnamoroll trinket',
    message: "i'm so glad you're here :D",
    accent: '#8DC6F2',
    positionClass: 'top-[4%] left-[3%] sm:top-[9%] sm:left-[6%] lg:left-[10%]',
    sizeClass: 'w-[84px] sm:w-[136px] md:w-[162px]',
    bubbleAlignClass: 'top-full left-0 mt-2',
    bubbleTilt: 2.5,
    baseRotate: -4,
    floatX: [0, 10, -6, 4, 0],
    floatY: [0, -14, -4, -10, 0],
    floatRotate: [-4, -1, -6, -2, -4],
    duration: 7.4,
    delay: 0,
  },
  {
    id: 'star-top',
    src: starSrc,
    alt: 'Hand-drawn blue star trinket',
    message: 'welcome to my sketchbook ✦',
    accent: '#F4B936',
    positionClass: 'top-[15%] right-[5%] sm:top-[16%] sm:right-[11%] lg:right-[16%]',
    sizeClass: 'w-[42px] sm:w-[64px] md:w-[74px]',
    bubbleAlignClass: 'top-full right-0 mt-2',
    bubbleTilt: -2.5,
    baseRotate: 6,
    floatX: [0, -9, 7, -4, 0],
    floatY: [0, -11, 5, -7, 0],
    floatRotate: [6, 13, 2, 10, 6],
    duration: 6.2,
    delay: 0.4,
  },
  {
    id: 'bunny',
    src: bunnySrc,
    alt: 'Hand-drawn bunny trinket',
    message: 'scroll down to explore!',
    accent: '#8B88C8',
    positionClass: 'bottom-[5%] left-[3%] sm:bottom-[19%] sm:left-[7%] lg:left-[11%]',
    sizeClass: 'w-[56px] sm:w-[86px] md:w-[98px]',
    bubbleAlignClass: 'bottom-full left-0 mb-2',
    bubbleTilt: -2,
    baseRotate: -5,
    floatX: [0, 8, -7, 5, 0],
    floatY: [0, -12, 4, -8, 0],
    floatRotate: [-5, -1, -8, -3, -5],
    duration: 8.1,
    delay: 0.8,
  },
  {
    id: 'bow',
    src: bowSrc,
    alt: 'Hand-drawn ribbon bow trinket',
    message: 'made with love & curiosity',
    accent: '#8DD3F4',
    positionClass: 'bottom-[7%] right-[4%] sm:bottom-[23%] sm:right-[8%] lg:right-[11%]',
    sizeClass: 'w-[66px] sm:w-[102px] md:w-[118px]',
    bubbleAlignClass: 'bottom-full right-0 mb-2',
    bubbleTilt: 2.5,
    baseRotate: 5,
    floatX: [0, -10, 6, -5, 0],
    floatY: [0, -13, 3, -9, 0],
    floatRotate: [5, 9, 1, 7, 5],
    duration: 7.0,
    delay: 1.1,
  },
  {
    id: 'star-mid-left',
    src: starSrc,
    alt: 'Small floating star trinket',
    message: 'policy × tech × design',
    accent: '#F4B936',
    positionClass: 'hidden md:block top-[45%] left-[4%] lg:left-[6%]',
    sizeClass: 'w-[44px] lg:w-[50px]',
    bubbleAlignClass: 'top-full left-0 mt-2',
    bubbleTilt: 2,
    baseRotate: -10,
    floatX: [0, 7, -5, 4, 0],
    floatY: [0, -10, 6, -5, 0],
    floatRotate: [-10, -3, -15, -6, -10],
    duration: 5.8,
    delay: 1.5,
  },
  {
    id: 'star-bottom-right',
    src: starSrc,
    alt: 'Small floating star accent',
    message: 'click the title to replay :)',
    accent: '#F2A7BA',
    positionClass: 'hidden md:block bottom-[8%] right-[16%] lg:right-[20%]',
    sizeClass: 'w-[42px] lg:w-[48px]',
    bubbleAlignClass: 'bottom-full right-0 mb-2',
    bubbleTilt: -2,
    baseRotate: 12,
    floatX: [0, -8, 5, -3, 0],
    floatY: [0, -9, 4, -6, 0],
    floatRotate: [12, 18, 7, 15, 12],
    duration: 6.6,
    delay: 0.6,
  },
];

const FloatingTrinket = ({ trinket }) => {
  const [isActive, setIsActive] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={`absolute ${trinket.positionClass} pointer-events-auto ${
        isActive ? 'z-30' : 'z-10'
      }`}
    >
      {/* Floating motion wrapper — pop-up bubble lives inside so it moves with the trinket */}
      <motion.div
        className="relative inline-block"
        animate={
          prefersReducedMotion
            ? { rotate: trinket.baseRotate }
            : {
                x: trinket.floatX,
                y: trinket.floatY,
                rotate: trinket.floatRotate,
              }
        }
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : {
                duration: trinket.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: trinket.delay,
              }
        }
      >
        <motion.button
          type="button"
          onPointerEnter={(e) => {
            if (e.pointerType === 'mouse') setIsActive(true);
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === 'mouse') setIsActive(false);
          }}
          onBlur={() => setIsActive(false)}
          onClick={() => setIsActive((prev) => !prev)}
          whileHover={prefersReducedMotion ? undefined : { scale: 1.09 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 360, damping: 20 }}
          aria-label={`${trinket.alt}: ${trinket.message}`}
          className="relative block bg-transparent border-0 p-1 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-rust/40 rounded-xl"
        >
          <img
            src={trinket.src}
            alt={trinket.alt}
            draggable="false"
            className={`${trinket.sizeClass} h-auto block drop-shadow-[0_3px_8px_rgba(26,23,20,0.06)]`}
          />
        </motion.button>

        {/* Sticker pop-up word — moves seamlessly in lockstep with the floating trinket */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              role="tooltip"
              initial={{ opacity: 0, scale: 0.82, y: 6, rotate: trinket.bubbleTilt }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: trinket.bubbleTilt }}
              exit={{ opacity: 0, scale: 0.88, y: 4, rotate: trinket.bubbleTilt }}
              transition={{ type: 'spring', stiffness: 440, damping: 24 }}
              className={`pointer-events-none absolute ${trinket.bubbleAlignClass} z-40 w-max max-w-[260px]`}
            >
              <div
                className="bg-[#F7F3EA] text-ink border-[2px] border-ink rounded-[14px] rounded-bl-[3px] px-4 py-1.5 font-playfair font-medium text-[0.95rem] sm:text-[1.05rem] leading-snug tracking-[-0.01em] whitespace-nowrap"
                style={{
                  boxShadow: `3px 4px 0px ${trinket.accent}`,
                }}
              >
                {trinket.message}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const FloatingTrinkets = () => {
  return (
    <div
      className="absolute inset-0 z-[2] pointer-events-none overflow-visible"
      aria-label="Interactive floating sketchbook trinkets"
    >
      {TRINKETS.map((trinket) => (
        <FloatingTrinket key={trinket.id} trinket={trinket} />
      ))}
    </div>
  );
};

export default FloatingTrinkets;
