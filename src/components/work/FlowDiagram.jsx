import React from 'react';
import TechIcon from '../TechIcon';
import useInView from '../../hooks/useInView';
import useTicker from '../../hooks/useTicker';
import './FlowDiagram.css';

const STEP_MS = 700;

/* Left-to-right pipeline. While on screen a packet lights each stage in
   turn, the whole chain flashes complete, then it loops. */
export default function FlowDiagram({ title, nodes }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const steps = React.useMemo(
    () => [...nodes.map(() => STEP_MS), 1600, 400],
    [nodes],
  );
  const step = useTicker(steps, inView, nodes.length);
  const complete = step >= nodes.length;

  return (
    <div className={`flow${complete ? ' flow--complete' : ''}`} ref={ref}>
      <div className="flow__head">
        <span className="flow__title">{title}</span>
        <span className="flow__status">
          {complete ? '✓ complete' : `stage ${Math.min(step + 1, nodes.length)}/${nodes.length}`}
        </span>
      </div>
      <div className="flow__track" style={{ '--n': nodes.length, '--p': Math.min(step, nodes.length - 1) }}>
        <span className="flow__rail" aria-hidden="true"><span className="flow__fill" /></span>
        <ol className="flow__nodes">
        {nodes.map((node, i) => {
          const state = complete || step > i ? 'done' : step === i ? 'active' : 'idle';
          return (
            <li key={`${node.label}-${i}`} className={`flow__node is-${state}`}>
              <span className="flow__chip"><TechIcon name={node.icon} /></span>
              <span className="flow__label">{node.label}</span>
            </li>
          );
        })}
        </ol>
      </div>
    </div>
  );
}
