import React from 'react';
import RagVisual from './visuals/RagVisual';
import GovVisual from './visuals/GovVisual';
import ManimVisual from './visuals/ManimVisual';
import BillingVisual from './visuals/BillingVisual';
import './Frame.css';

const VISUALS = {
  rag: RagVisual,
  gov: GovVisual,
  manim: ManimVisual,
  billing: BillingVisual,
};

export default function ProjectVisual({ kind }) {
  const Visual = VISUALS[kind];
  return Visual ? <Visual /> : null;
}
