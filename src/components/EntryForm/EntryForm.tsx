import styles from './EntryForm.module.css';

export default function EntryForm() {
  return (
    <div className={styles.parent}>
      <div className={styles.child + ' ' + styles.child1}>
        <label>Ent No</label>
        <input className={styles.input + ' ' + styles.input1} type="text" />
      </div>
      <div className={styles.child + ' ' + styles.child2}>
        <label>Ent Date</label>
        <input className={styles.input + ' ' + styles.input2} type="text" />
      </div>
      <div className={styles.child + ' ' + styles.child3}>
        <label>Challan No</label>
        <input className={styles.input + ' ' + styles.input3} type="text" />
      </div>
      <div className={styles.child + ' ' + styles.child4}>
        <label>Challan Dt</label>
        <input className={styles.input + ' ' + styles.input4} type="text" />
      </div>
      <div className={styles.child + ' ' + styles.child5}>
        <button className={styles.input + ' ' + styles.input5}>Log</button>
      </div>
      <div className={styles.child + ' ' + styles.child6}>
        <label>Process</label>
        <input className={styles.input + ' ' + styles.input6} type="text" />
      </div>
      <div className={styles.child + ' ' + styles.child7}>
        <label>Lot No</label>
        <input className={styles.input + ' ' + styles.input7} type="text" />
      </div>
      <div className={styles.child + ' ' + styles.child8}>
        <label>Party</label>
        <input className={styles.input + ' ' + styles.input8} type="text" />
      </div>
      <div className={styles.child + ' ' + styles.child9}>
        <label>Godown</label>
        <input className={styles.input + ' ' + styles.input9} type="text" />
      </div>
      <div className={styles.child + ' ' + styles.child10}>
        <label>Transport</label>
        <input className={styles.input + ' ' + styles.input10} type="text" />
      </div>
      <div className={styles.child + ' ' + styles.child11}>
        <label>Lrno.</label>
        <input className={styles.input + ' ' + styles.input11} type="text" />
      </div>
      <div className={styles.child + ' ' + styles.child12}>
        <label>Lrdt.</label>
        <input className={styles.input + ' ' + styles.input12} type="text" />
      </div>
      <div className={styles.child + ' ' + styles.child13}>
        <label>Something</label>
        <input className={styles.input + ' ' + styles.input13} type="text" />
      </div>
      <div className={styles.child + ' ' + styles.child14}>
        <label>Shade</label>
        <input className={styles.input + ' ' + styles.input14} type="text" />
      </div>
      <div className={styles.child + ' ' + styles.child15}>
        <label>Color</label>
        <input className={styles.input + ' ' + styles.input15} type="text" />
      </div>
    </div>
  );
} 