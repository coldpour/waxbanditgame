import { useEffect, useRef } from "react";
import "./App.css";

function App() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");

    let requestId;
    let time = 0;
    const speed = 20;

    const update = () => {
      time += 1;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        (canvas.width / 2) * Math.abs(Math.cos(time / speed)),
        0,
        2 * Math.PI
      );
      ctx.fill();
    };

    const loop = () => {
      draw();
      update();
      requestId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(requestId);
    };
  });

  return (
    <div>
      <canvas width="400" height="400" ref={ref} />
    </div>
  );
}

export default App;
