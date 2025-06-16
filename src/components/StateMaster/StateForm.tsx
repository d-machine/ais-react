import { useEffect, useState } from "react";
import { useAddStore } from "../../useAddStore";
import Form from "../Input/Index";
import { postApiCall } from "../../api/base";

interface Props {
  formId: string;
  setIsModalOpen: (value: boolean) => void;
  onSave?: () => void; // Callback to refresh the list after saving
}

export default function StateForm({ formId, setIsModalOpen, onSave }: Props) {
  const { addEntry, setFormData, setSelectedValues } = useAddStore();
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<any>(null);
  const [countries, setCountries] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Initialize the form entry in the store
        const currentState = useAddStore.getState();
        if (!currentState.entries[formId]) {
          addEntry(formId);
           
          // Set initial values to empty strings to avoid undefined
          setFormData(formId, "state_name", "");
          setFormData(formId, "state_code", "");
          setFormData(formId, "description", "");
          setFormData(formId, "country_id", "");
        }
        
        // Fetch countries for the dropdown
        try {
          const response = await postApiCall(
            "api/generic/executeQuery",
            {
              configFile: "list-countries",
              path: ["queryInfo"]
            },
            true
          );
          
          if (response.data) {
            setCountries(response.data);
          }
        } catch (error) {
          console.error("Error fetching countries:", error);
        }
        
        // Here you would normally fetch the config from the API
        // For this example, we're hardcoding the config structure
        setConfig([{
          sectionType: "FIELDS",
          sectionName: "State Details",
          fields: [
            {
              name: "state_name",
              label: "State Name",
              type: "TEXT",
              required: true
            },
            {
              name: "state_code",
              label: "State Code",
              type: "TEXT",
              required: true
            },
            {
              name: "description",
              label: "Description",
              type: "TEXTAREA",
              required: false
            },
            {
              name: "country_id",
              label: "Country",
              type: "SELECT",
              required: true,
              multi: false,
              selectConfig: {
                options: countries.map(country => ({
                  id: country.country_id,
                  name: country.country_name
                }))
              }
            }
          ],
          // Setting applicableActions to empty array to hide the default buttons
          applicableActions: [],
          actionConfig: {
            SAVE: {
              label: "Save State",
              actionType: "EXECUTE_QUERY",
              queryInfo: {
                returnType: "SCALAR",
                query: `
                  INSERT INTO wms.state_master
                    (name, code, description, country_id, last_updated_by, last_updated_at)
                  VALUES
                    ($1, $2, $3, $4, $5, NOW())
                  RETURNING id;
                `,
                payload: ["state_name", "state_code", "description", "country_id"],
                contextParams: ["current_user_id"],
                path: ["sections", "0", "actionConfig", "SAVE", "queryInfo"]
              }
            },
            CANCEL: {
              label: "Discard Changes"
            }
          }
        }]);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching config:", error);
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, [formId, addEntry]);

  const handleSaveState = async () => {
    try {
      const formData = useAddStore.getState().entries[formId]?.metadata;
      const selectedValues = useAddStore.getState().entries[formId]?.selectedValues;
      
      if (!formData) {
        console.error("No form data found");
        return;
      }

      if (!formData.state_name || !formData.state_code) {
        alert("State name and code are required");
        return;
      }

      if (!selectedValues?.country_id?.id) {
        alert("Please select a country");
        return;
      }

      // Simple approach with minimal fields
      console.log("Saving state with data:", formData);
      console.log("Selected country:", selectedValues.country_id);
      
      try {
        const response = await postApiCall(
          "api/generic/executeQuery",
          {
            query: "INSERT INTO wms.state_master (name, code, description, country_id, last_updated_by) VALUES ($1, $2, $3, $4, 1) RETURNING id",
            returnType: "SCALAR",
            payload: [
              formData.state_name,
              formData.state_code,
              formData.description || "",
              selectedValues.country_id.id
            ]
          },
          true
        );
        
        console.log("State saved successfully with ID:", response);
        setIsModalOpen(false);
        if (onSave) onSave();
      } catch (error) {
        console.error("Error saving state:", error);
        alert("Failed to save state. Please check console for details.");
      }
    } catch (error) {
      console.error("Save attempt failed:", error);
      alert("Failed to save state. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  if (isLoading || !config) return <div>Loading...</div>;

  return (
    <div style={{ 
      width: "90%",
      height: "100%", 
      display: "flex",
      flexDirection: "column",
      gap: "5px" 
    }}>
      <div style={{
        flex: "1 1 auto", 
        minHeight: 0, 
        overflowY: "auto" 
      }}>
        <Form
          configFile="state-master"
          setIsModalOpen={setIsModalOpen}
          selectedValues={useAddStore.getState().entries[formId]?.selectedValues || {}}
          setSelectedValues={setSelectedValues}
          setFormData={setFormData}
          formData={useAddStore.getState().entries[formId]?.metadata || {}}
          formId={formId}
          section={config[0]}
        />
      </div>
      
      <div style={{ 
        display: "flex", 
        justifyContent: "flex-start", 
        gap: "10px", 
        marginTop: "20px" 
      }}>
        <button 
          style={{
            backgroundColor: "#2196f3",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
          onClick={handleSaveState}
        >
          Save State
        </button>
        <button 
          style={{
            backgroundColor: "#f5f5f5",
            color: "#333",
            border: "1px solid #ddd",
            padding: "10px 15px",
            borderRadius: "4px",
            cursor: "pointer"
          }}
          onClick={handleCancel}
        >
          Discard Changes
        </button>
      </div>
    </div>
  );
} 