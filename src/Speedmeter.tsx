import React, { useEffect, useState } from 'react';
import './Speedmeter.css'; // Import CSS file for styling

const Speedmeter: React.FC = () => {
  const [statValueCurrent, setStatValueCurrent] = useState(0);

  const outerRingRadius = 164;
  const digitRingRadius = 145;

  const frameCount = 100;
  const frameInterval = 50;
  const digitValueMax = 160;
  const statValueMax = 90.0;
  const statValueInterval = statValueMax / frameCount;

  useEffect(() => {
    const $ticks = document.querySelectorAll('.tick') as NodeListOf<HTMLElement>;
    const $digits = document.querySelectorAll('.digit') as NodeListOf<HTMLElement>;

    $ticks.forEach(($tick, i) => {
      const angle = 210 - i * 5;
      const theta = deg2rad(angle);
      const radius = outerRingRadius + (i % 6 ? 0 : 4);
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * -radius;

      $tick.style.transform = `translate(${x}px, ${y}px) rotate(${-angle}deg)`;
    });

    $digits.forEach(($digit, i) => {
      const angle = 210 - i * 30;
      const theta = deg2rad(angle);
      const x = Math.cos(theta) * digitRingRadius;
      const y = Math.sin(theta) * -digitRingRadius;

      $digit.style.transform = `translate(${x}px, ${y}px)`;
    });

    updateDetails(0);
  }, []);

  function deg2rad(angle: number) {
    return angle * (Math.PI / 180);
  }

  function setStatValue(value: number) {
    const angle = -120 + 240 * (value / digitValueMax);
    const progress = document.querySelector('.progress') as HTMLElement;
    progress.style.transform = `rotate(${angle}deg)`;
  }

  function updateDetails(step: number) {
    if (step > statValueMax) {
      return;
    }
    step += statValueInterval
    setStatValue(step);
    setStatValueCurrent(step);
    setTimeout(() => {updateDetails(step)}, frameInterval);
  }

  const handleRetry = () => {
    setStatValueCurrent(0);
    updateDetails(0)
  };


  return (
    <section className="container">
      <div className="Speedmeter">
        <div className="inner-ring"></div>
        <div className="outer-ring">
          {[...Array(49)].map((_, index) => (
            <span key={index} className="tick"></span>
          ))}
        </div>
        <div className="digit-ring">
          {[0, 20, 40, 60, 80, 100, 120, 140, 160].map((value, index) => (
            <span key={index} className="digit">{value}</span>
          ))}
        </div>
        <div className="details">
          <p className="label">Download</p>
          <p className="speed">{statValueCurrent.toFixed(1)}</p>
          <p className="unit">Mbps</p>
        </div>
        <div className="progress"></div>
        <button className="retry-button" onClick={handleRetry}>Retry</button>
        <footer>
          <div className="stat">
            <label>Ping</label>
            <p>2ms</p>
          </div>
          <div className="stat">
            <label>Upload</label>
            <p>67.7 Mbps</p>
          </div>
        </footer>
      </div>
      <div className="overlay"></div>
    </section>
  );
};

export default Speedmeter;
