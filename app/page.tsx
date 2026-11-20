import { TimerForm } from "@/components/timerForm"
import { VolumeChooser } from "@/components/volume-chooser"

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
        <div className="w-full max-w-md text-center">
          <p className="text-sm font-light leading-relaxed text-foreground/55">
            A motivational timer built for people with ADHD. You set a fixed
            duration or a random range, then it runs short back-to-back intervals
            with a brief alarm between each one. The unpredictability and steady
            rhythm help keep focus without long stretches of waiting. Pause,
            resume, or adjust sound and theme anytime while the loop keeps going.
          </p>
        </div>
        <TimerForm />
      </div>
      <div className="mx-auto w-full max-w-md px-6 pb-6">
        <VolumeChooser inputId="page-volume" quiet />
      </div>
    </div>
  )
}
