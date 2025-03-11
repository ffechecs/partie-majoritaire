import { ComponentProps } from "react"
import { Chessboard } from "react-chessboard"

type ChessboardProps = ComponentProps<typeof Chessboard>

const defaultConfig = {
  id: "simpleBoard",
  animationDuration: 200,
  // arePiecesDraggable: false,
  customDarkSquareStyle: {
    backgroundColor: "#48ADD7",
  },
  customLightSquareStyle: {
    backgroundColor: "#DFF6FF",
  },
  customArrowColor: "#FF0000",
} satisfies ChessboardProps

type BoardProps = Omit<ChessboardProps, keyof typeof defaultConfig> & {}

// const CustomSquareRenderer = forwardRef<HTMLDivElement, CustomSquareProps>(
//   (props, ref) => {
//     const { children, square, squareColor, style } = props

//     return (
//       <div ref={ref} style={{ ...style, position: "relative" }}>
//         {children}
//         <div
//           style={{
//             position: "absolute",
//             right: 0,
//             bottom: 0,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             height: 16,
//             width: 16,
//             borderTopLeftRadius: 6,
//             backgroundColor: squareColor === "black" ? "#064e3b" : "#312e81",
//             color: "#fff",
//             fontSize: 14,
//           }}
//         >
//           {square}
//         </div>
//       </div>
//     )
//   }
// )

export function Board({ ...rest }: BoardProps) {
  return (
    <Chessboard
      // customSquare={CustomSquareRenderer}
      {...defaultConfig}
      {...rest}
    />
  )
}
