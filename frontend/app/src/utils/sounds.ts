// Generates sounds via Web Audio API — no audio files needed

function getCtx(): AudioContext | null {
  try { return new (window.AudioContext || (window as any).webkitAudioContext)() } catch { return null }
}

function beep(ac: AudioContext, freq: number, startAt: number, duration: number, vol: number) {
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, startAt)
  gain.gain.setValueAtTime(vol, startAt)
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration)
  osc.start(startAt)
  osc.stop(startAt + duration)
}

/** Two-tone ascending chime — new message received */
export function playMessageSound() {
  const ac = getCtx()
  if (!ac) return
  const t = ac.currentTime
  beep(ac, 880,  t,        0.12, 0.25)
  beep(ac, 1100, t + 0.11, 0.18, 0.20)
}

/** Soft double-pulse — new notification */
export function playNotificationSound() {
  const ac = getCtx()
  if (!ac) return
  const t = ac.currentTime
  beep(ac, 660, t,        0.08, 0.20)
  beep(ac, 880, t + 0.09, 0.22, 0.15)
}
