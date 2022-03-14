const ctx = new (window.AudioContext || window.webkitAudioContext)()
const fft = new AnalyserNode(ctx, { fftSize: 2048 })
const src = new AudioBufferSourceNode( ctx )
const gn = new GainNode(ctx, {gain:0.75})


createWaveCanvas({element: 'section', analyser: fft })
createFrequencyCanvas({element:'section', analyser:fft, scale:5,color:'pink'})
createWaveCanvas({element: 'section', analyser: fft })
createFrequencyCanvas({element:'section', analyser:fft, scale:5,color:'cyan'})
createWaveCanvas({element: 'section', analyser: fft })
createFrequencyCanvas({element:'section', analyser:fft, scale:5,color:'magenta'})
createWaveCanvas({element: 'section', analyser: fft })


function adsr (args){
  // param, _peak, _val, _time, _a, _d, _s, _r) {
  /*
                peak
                /\   val  val
               /| \__|____|
              / |    |    |\
             /  |    |    | \
       init /a  |d   |s   |r \ init

       <----------time------------>
  */
  const param = args.param
  const peak = args.peak||1
  const val = args.val||0.7
  const time = args.time||ctx.currentTime
  const dur = args.duration || 1
  const a = args.a||dur*0.2
  const d = args.d||dur*0.1
  const s = args.s||dur*0.5
  const r = args.r||dur*0.2



  const initVal = param.value
  param.setValueAtTime(initVal, time)
  param.linearRampToValueAtTime(peak, time+a)
  param.linearRampToValueAtTime(val, time+a+d)
  param.linearRampToValueAtTime(val, time+a+d+s)
  param.linearRampToValueAtTime(initVal, time+a+d+s+r)
}

const major = [0, 2, 4, 5, 7, 9, 11, 12]


function step(rootFreq, steps){
  let tr1 = Math.pow(2,1/12)
  let rnd = rootFreq*Math.pow(tr1,steps)
  return Math.round(rnd*100)/100
}

function tone(_time, _pitch, _duration){
  
  const time = _time||ctx.currentTime
  const duration = _duration||4


  const osc = new OscillatorNode(ctx, {
    frequency: _pitch,
    type: 'sine'
  })
  
  const lvl = new GainNode(ctx,{
    gain: 0.2 // scale volume down by half
  })
  osc.connect(lvl)
  lvl.connect(ctx.destination)
  lvl.connect(fft)
  osc.start(time)
  osc.stop(time + duration)
  src.connect(gn)
  gn.connect(fft)


  adsr({param: lvl.gain, duration: duration})

}


const tempo = 220
const beat = 60 / tempo
const bar = beat
const root = 220
const scale = major
const notes = [0, 2, 4, 5, 7, 9, 11, 12, 12, 11, 9,7,5,4,2,0]

const shifter = Math.round(Math.random()*55)

// Echo effect
for (let i = 0; i < notes.length; i++){

    const pitch = step(root,notes[i]+shifter)
    
    tone(beat*i, pitch, 0.25)
    tone(beat*i+0.1, pitch, 0.5)
    tone(Math.max(beat*i-0.2,0), pitch, 0.2)
    
}
















