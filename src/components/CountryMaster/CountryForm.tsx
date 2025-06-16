import { useEffect, useState } from "react";
import { useAddStore } from "../../useAddStore";
import Form from "../Input/Index";
import { postApiCall } from "../../api/base";

interface Props {
  formId: string;
  setIsModalOpen: (value: boolean) => void;
  onSave?: () => void; // Callback to refresh the list after saving
}

export default function CountryForm({ formId, setIsModalOpen, onSave }: Props) {
  const { addEntry, setFormData, setSelectedValues } = useAddStore();
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<any>(null);
  
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Initialize the form entry in the store
        const currentState = useAddStore.getState();
        if (!currentState.entries[formId]) {
          addEntry(formId);
          
          // Set initial values to empty strings to avoid undefined
          setFormData(formId, "country_name", "");
          setFormData(formId, "country_code", "");
          setFormData(formId, "description", "");
        }
        
        // Here you would normally fetch the config from the API
        // For this example, we're hardcoding the config structure
        setConfig([{
          sectionType: "FIELDS",
          sectionName: "Country Details",
          fields: [
            {
              name: "country_name",
              label: "Country Name",
              type: "TEXT",
              required: true
            },
            {
              name: "country_code",
              label: "Country Code",
              type: "TEXT",
              required: true
            },
            {
              name: "description",
              label: "Description",
              type: "TEXTAREA",
              required: false
            }
          ],
          applicableActions: [],
          actionConfig: {
            SAVE: {
              label: "Save Country",
              actionType: "EXECUTE_QUERY",
              queryInfo: {
                returnType: "SCALAR",
                query: `
                  INSERT INTO wms.country_master
                    (country_name, country_code, description, last_updated_by, last_updated_at)
                  VALUES
                    ($1, $2, $3, $4, NOW())
                  RETURNING id;
                `,
                payload: ["country_name", "country_code", "description"],
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

  const handleSaveCountry = async () => {
    try {
      const formData = useAddStore.getState().entries[formId]?.metadata;
      if (!formData) {
        console.error("No form data found");
        return;
      }

      if (!formData.country_name || !formData.country_code) {
        alert("Country name and code are required");
        return;
      }

      // Simple approach with minimal fields
      console.log("Saving country with data:", formData);
      
      try {
        const response = await postApiCall(
          "api/generic/executeQuery",
          {
            query: "INSERT INTO wms.country_master (country_name, country_code, description, last_updated_by) VALUES ($1, $2, $3, 1) RETURNING id",
            returnType: "SCALAR",
            payload: [
              formData.country_name,
              formData.country_code,
              formData.description || ""
            ]
          },
          true
        );
        
        console.log("Country saved successfully with ID:", response);
        setIsModalOpen(false);
        if (onSave) onSave();
      } catch (error) {
        console.error("Error saving country:", error);
        alert("Failed to save country. Please check console for details.");
      }
    } catch (error) {
      console.error("Save attempt failed:", error);
      alert("Failed to save country. Please try again.");
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
          configFile="country-master"
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
          onClick={handleSaveCountry}
        >
          Save Country
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