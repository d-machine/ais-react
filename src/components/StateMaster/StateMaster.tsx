import { useState, useEffect } from "react";
import { useAddStore } from "../../useAddStore";
import { postApiCall } from "../../api/base";
import StateForm from "./StateForm";
import styles from "./StateMaster.module.css";

interface State {
  state_id: number;
  state_name: string;
  state_code: string;
  description: string;
  country_name: string;
  last_updated_at: string;
  last_updated_by_name: string;
}

export default function StateMaster() {
  const [states, setStates] = useState<State[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [formId, setFormId] = useState("");
  
  useEffect(() => {
    fetchStates();
  }, []);
  
  const fetchStates = async () => {
    try {
      setIsLoading(true);
      const response = await postApiCall(
        "api/generic/executeQuery",
        {
          configFile: "list-states",
          path: ["queryInfo"]
        },
        true
      );
      
      setStates(response.data || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching states:", error);
      setIsLoading(false);
    }
  };
  
  const handleAddState = () => {
    setSelectedState(null);
    const newFormId = `state-form-${Date.now()}`;
    setFormId(newFormId);
    setIsModalOpen(true);
  };
  
  const handleEditState = (state: State) => {
    setSelectedState(state);
    const newFormId = `state-form-${Date.now()}`;
    setFormId(newFormId);
    
    // Pre-fill the form with state data
    const { fillform } = useAddStore.getState();
    fillform(newFormId, {
      state_id: state.state_id,
      state_name: state.state_name,
      state_code: state.state_code,
      description: state.description || ""
    });
    
    setIsModalOpen(true);
  };
  
  const handleDeleteState = async (state: State) => {
    if (window.confirm(`Are you sure you want to delete ${state.state_name}?`)) {
      try {
        await postApiCall(
          "api/generic/executeQuery",
          {
            configFile: "list-states",
            path: ["actionConfig", "DELETE"],
            payload: [state.state_id]
          },
          true
        );
        
        // Refresh the list after deletion
        fetchStates();
      } catch (error) {
        console.error("Error deleting state:", error);
      }
    }
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>State Management</h2>
        <button className={styles.addButton} onClick={handleAddState}>
          Add State
        </button>
      </div>
      
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>State Name</th>
                <th>State Code</th>
                <th>Country</th>
                <th>Description</th>
                <th>Last Updated</th>
                <th>Updated By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {states.length > 0 ? (
                states.map((state) => (
                  <tr key={state.state_id}>
                    <td>{state.state_name}</td>
                    <td>{state.state_code}</td>
                    <td>{state.country_name}</td>
                    <td>{state.description || "-"}</td>
                    <td>{new Date(state.last_updated_at).toLocaleString()}</td>
                    <td>{state.last_updated_by_name}</td>
                    <td>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleEditState(state)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleDeleteState(state)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center" }}>
                    No states found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {isModalOpen && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <h3>{selectedState ? "Edit State" : "Add State"}</h3>
                  <button
                    className={styles.closeButton}
                    onClick={() => setIsModalOpen(false)}
                  >
                    &times;
                  </button>
                </div>
                <div className={styles.modalBody}>
                  <StateForm
                    formId={formId}
                    setIsModalOpen={setIsModalOpen}
                    onSave={fetchStates}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 