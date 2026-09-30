import { Easing } from "react-native-reanimated";

// Motion is calm and short. The artwork is the focus, not the animation.
export const duration = { fast: 140, base: 240, slow: 420 } as const;

// Gentle deceleration, no overshoot.
export const easing = Easing.bezier(0.2, 0.8, 0.2, 1);

export const spring = {
  press: { damping: 18, stiffness: 320, mass: 0.6 },
  pop: { damping: 9, stiffness: 260, mass: 0.6 }, // the save-heart pop
  tab: { damping: 22, stiffness: 240, mass: 0.8 },
} as const;
