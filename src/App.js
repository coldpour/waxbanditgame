import { useEffect, useRef } from "react";
import "./App.css";

const drawRect = (ctx, [x, y, width, height]) => {
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.fill();
};

const drawCircle = (ctx, [x, y, radius]) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
};

function App() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");

    let requestId;
    let time = 0;
    const r1 = {
      x: 0,
      y: (canvas.height - 50) / 2,
      w: 50,
      h: 50,
      velocity: 0.01,
    };

    const update = () => {
      time += 1;
      r1.x =
        ((canvas.width + r1.w * 4) / 2) * Math.cos(time * r1.velocity) +
        (canvas.width - r1.w) / 2;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawRect(ctx, [r1.x, r1.y, r1.w, r1.h]);
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
      <canvas width="400" height="400" ref={ref} onClick={() => {}} />
    </div>
  );
}

export default App;
