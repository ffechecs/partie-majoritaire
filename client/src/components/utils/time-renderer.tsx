import { CountdownRendererFn } from "react-countdown"

const colors = [
  {
    highlight: "bg-red-500",
    background: "bg-red-100",
    border: "border-red-500",
  },
  {
    highlight: "bg-orange-500",
    background: "bg-orange-100",
    border: "border-orange-500",
  },
  // {
  //   highlight: "bg-[#48ADD7]",
  //   background: "bg-[#DFF6FF]",
  //   border: "border-[#48ADD7]",
  // },
  {
    highlight: "bg-green-500",
    background: "bg-green-100",
    border: "border-green-500",
  },
]

const lockColors = {
  highlight: "bg-zinc-500",
  background: "bg-zinc-100",
  border: "border-zinc-500",
}

export function LockCountdown() {
  const minutes = 0
  const progress = 0

  const seconds = 0
  const color = lockColors
  return (
    <div
      className={`flex h-10 flex-col items-center gap-2 ${color.border} relative overflow-hidden rounded-sm border-2`}
    >
      <span className="absolute top-1/2 -translate-y-1/2 text-2xl font-bold">
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
      <div className={`h-full w-full ${color.background}`}>
        <div
          className={`h-full ${color.highlight} `}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
type truc = CountdownRendererFn["arguments"]

export function getTimeRenderer(max: number): CountdownRendererFn {
  const renderer: CountdownRendererFn = ({
    minutes,
    seconds,
    completed,
    total,
    props,
  }) => {
    // completed = false
    // if (completed) {
    //   // Render a completed state
    //   return (
    //     <div className=`flex flex-col h-10  gap-2 items-center ${} rounded-sm overflow-hidden border-2 my-2 relative`>
    //       <span className="text-2xl font-bold absolute top-1/2 -translate-y-1/2">
    //         0:00
    //       </span>
    //       <div className="w-full h-full bg-[#DFF6FF]"></div>
    //     </div>
    //   )
    // } else {
    // progress (max time is 5 minutes)
    // total is time from end in ms
    // timer duration is 5 minutes
    let progress = (total / max) * 100

    // under 10 percent color should be colors[0]
    // under 25 percent color should be colors[1]
    // above color should be colors[2]

    const color =
      progress < 10 ? colors[0] : progress < 25 ? colors[1] : colors[2]

    // Render a countdown

    return (
      <div
        className={`flex h-10 flex-col items-center gap-2 ${color.border} relative overflow-hidden rounded-sm border-2`}
      >
        <span className="absolute top-1/2 -translate-y-1/2 text-2xl font-bold">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
        <div className={`h-full w-full ${color.background}`}>
          <div
            className={`h-full ${color.highlight} `}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    )
    // }
  }
  return renderer
}
