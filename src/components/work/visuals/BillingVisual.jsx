import React from 'react';
import Frame from '../Frame';
import useInView from '../../../hooks/useInView';
import useTicker, { useLoopCount } from '../../../hooks/useTicker';
import useCountUp from '../../../hooks/useCountUp';
import './BillingVisual.css';

const STEPS = [1100, 1000, 1000, 1000, 1300, 2000, 1500];
const STATUS = ['ready', 'scanning', 'scanning', 'scanning', 'low stock', 'bill generated', 'committed'];
const LOW = 3;
const GST = 0.05;

const ITEMS = [
  { sku: 'RC-05', name: 'Basmati rice 5kg', price: 549, stock: 24, qty: 1 },
  { sku: 'TD-01', name: 'Toor dal 1kg', price: 162, stock: 9, qty: 2 },
  { sku: 'SO-01', name: 'Sunflower oil 1L', price: 189, stock: 31, qty: 1 },
  { sku: 'TE-05', name: 'Assam tea 500g', price: 265, stock: 4, qty: 2 },
];
const CAP = 32;
const SUBTOTAL = ITEMS.reduce((s, it) => s + it.price * it.qty, 0);
const TOTAL = SUBTOTAL * (1 + GST);

const rupee = (n) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function Total({ run }) {
  const n = useCountUp(TOTAL, { start: run, duration: 1100 });
  return <b>{rupee(run ? n : 0)}</b>;
}

function BillingScene({ step }) {
  const added = Math.min(step, ITEMS.length); // items scanned so far
  const last = ITEMS[added - 1];
  const manager = step >= 4;

  return (
    <div className="bill">
      <div className="bill__left">
        <div className="bill__seg" style={{ '--x': manager ? 1 : 0 }}>
          <span className={manager ? '' : 'is-on'}>Customer</span>
          <span className={manager ? 'is-on' : ''}>Manager</span>
        </div>

        <table className="bill__stock">
          <thead><tr><th>SKU</th><th>Item</th><th>Qty</th><th aria-label="Level" /></tr></thead>
          <tbody>
            {ITEMS.map((it, i) => {
              const left = i < added ? it.stock - it.qty : it.stock;
              const low = left <= LOW;
              return (
                <tr key={it.sku} className={`${i === added - 1 && step <= 4 ? 'is-hit' : ''}${low ? ' is-low' : ''}`}>
                  <td>{it.sku}</td>
                  <td>{it.name}</td>
                  <td className="bill__qty">{left}</td>
                  <td>
                    <span className="bill__lvl"><b style={{ width: `${(left / CAP) * 100}%` }} /></span>
                    {low && manager && <em className="bill__reorder">reorder</em>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <code className="bill__sql" key={step}>
          {last
            ? <>UPDATE stock SET qty = qty − {last.qty} WHERE sku = '{last.sku}'; <b>COMMIT</b>;</>
            : <>SELECT * FROM stock; <b>-- 4 rows</b></>}
        </code>
      </div>

      <div className="bill__printer">
        <span className="bill__slot" />
        <div className="bill__receipt">
          <p className="bill__shop">KIRANA &amp; CO.<small>Invoice #0412 · Cashier 02</small></p>
          <ul className="bill__lines">
            {ITEMS.slice(0, added).map((it) => (
              <li key={it.sku}>
                <span>{it.name}<small>{it.qty} × {it.price}</small></span>
                <span>{rupee(it.price * it.qty)}</span>
              </li>
            ))}
          </ul>
          {step >= 5 && (
            <div className="bill__sum">
              <p><span>Subtotal</span><span>{rupee(SUBTOTAL)}</span></p>
              <p><span>GST 5%</span><span>{rupee(SUBTOTAL * GST)}</span></p>
              <p className="bill__total"><span>Total</span><Total run={step >= 5} /></p>
              <span className="bill__stamp">Paid</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BillingVisual() {
  const [ref, inView] = useInView({ threshold: 0.35 });
  const step = useTicker(STEPS, inView);
  const loop = useLoopCount(step);
  return (
    <div ref={ref} className="rv-host">
      <Frame title="billing.py — mysql@localhost" status={STATUS[step]} tone={step >= 5 ? 'ok' : 'run'}>
        {inView || step > 0 ? <BillingScene key={loop} step={step} /> : null}
      </Frame>
    </div>
  );
}
