import React, { useState } from 'react';
import styles from './EntryList.module.css';
import { useStore } from '../store';
import ItemMaster from '../components/EntryForm/ItemMaster';

interface ItemMaster {
  id: number;
  itemcode: string;
  itemdescription: string;
  conversion: number;
  itemcategory: string;
  itembrand: string;
  palletcapacity: number;
}
interface EntryListProps {
  setModalContent: (content: React.ReactNode) => void;
  setisopen: (isOpen: boolean) => void;
  entries: ItemMaster[];

}
const EntryList= ({ entries ,setModalContent, setisopen}: EntryListProps) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
    const handleRadioChange = (id: number) => {
    setSelectedId(prevSelectedId => (prevSelectedId === id ? null : id));
  };
  const handleEdit = (id: number): void => {
    const data = entries.filter((entry) => entry.id === id);
    console.log(data[0], "data");
    const formId = `ab${id.toString()}`;
    const currentState = useStore.getState();
    if (!currentState.entries[formId]) {
      currentState.addEntry(formId);
      currentState.setFormData(formId, 'itemcode', data[0].itemcode);
      currentState.setFormData(formId, 'itemdescription', data[0].itemdescription);
      currentState.setFormData(formId, 'conversion', data[0].conversion);
      currentState.setFormData(formId, 'itemcategory', data[0].itemcategory);
      currentState.setFormData(formId, 'itembrand', data[0].itembrand);
      currentState.setFormData(formId, 'palletcapacity', data[0].palletcapacity);
      currentState.setFormData(formId, 'id', data[0].id);
    }
    setModalContent(<ItemMaster formId={formId} />);
    setisopen(true);
  };
  const handleAddNew = (): void => {
    const formId = `ab${entries.length + 1}`;
    const currentState = useStore.getState();
    if (!currentState.entries[formId]) {
      currentState.addEntry(formId);
    }
    setModalContent(<ItemMaster formId={formId} />);
    setisopen(true);
  }
  const handleCopy = (id: number): void => {
    const data = entries.filter((entry) => entry.id === id);
    console.log(data[0], "data");
    const formId = `copy${id.toString()}`;
    const currentState = useStore.getState();
    if (!currentState.entries[formId]) {
      currentState.addEntry(formId);
      currentState.setFormData(formId, 'itemcode', data[0].itemcode);
      currentState.setFormData(formId, 'itemdescription', data[0].itemdescription);
      currentState.setFormData(formId, 'conversion', data[0].conversion);
      currentState.setFormData(formId, 'itemcategory', data[0].itemcategory);
      currentState.setFormData(formId, 'itembrand', data[0].itembrand);
      currentState.setFormData(formId, 'palletcapacity', data[0].palletcapacity);
    }
    setModalContent(<ItemMaster formId={formId} />);
    setisopen(true);
  };
  return (
    <>
    <div className={styles.entryListContainer}>
      <h2>Entry List</h2>
      <table className={styles.entryTable}>
        <thead>
          <tr>
            <th>Select</th>
            <th>Item Code</th>
            <th>Description</th>
            <th>Conversion</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Pallet Capacity</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(entry => (
            <tr key={entry.id} className={styles.entryListItem}>
              <td>
                <input
                  type="radio"
                  name="entry"
                  checked={selectedId === entry.id}
                  onChange={() => handleRadioChange(entry.id)}
                  />
              </td>
              <td>{entry.itemcode}</td>
              <td>{entry.itemdescription}</td>
              <td>{entry.conversion}</td>
              <td>{entry.itemcategory}</td>
              <td>{entry.itembrand}</td>
              <td>{entry.palletcapacity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.buttonContainer}>
        <button
          onClick={() => selectedId && handleCopy(selectedId)}
          disabled={!selectedId}
          className={!selectedId ? styles.disabledButton : ''}>
          Copy
        </button>
        <button
          onClick={() => selectedId && handleEdit(selectedId)}
          disabled={!selectedId}
          className={!selectedId ? styles.disabledButton : ''}>
          Edit
        </button>
        <button onClick={handleAddNew}>Add New</button>
      </div>
    </div>
    {/* <Modal isOpen={isopen} onClose={() => setisopen(false)}>{modalContent}</Modal> */}
    </>
  );
};
export default EntryList;