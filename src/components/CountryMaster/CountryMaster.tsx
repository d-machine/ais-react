import { useState, useEffect } from "react";
import { useAddStore } from "../../useAddStore";
import { postApiCall } from "../../api/base";
import CountryForm from "./CountryForm";
import styles from "./CountryMaster.module.css";

interface Country {
  country_id: number;
  country_name: string;
  country_code: string;
  description: string;
  last_updated_at: string;
  last_updated_by_name: string;
}

export default function CountryMaster() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [formId, setFormId] = useState("");
  
  useEffect(() => {
    fetchCountries();
  }, []);
  
  const fetchCountries = async () => {
    try {
      setIsLoading(true);
      const response = await postApiCall(
        "api/generic/executeQuery",
        {
          configFile: "list-countries",
          fetchquery: {},
          path: ["queryInfo"]
        },
        true
      );
      
      setCountries(response.data || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching countries:", error);
      setIsLoading(false);
    }
  };
  
  const handleAddCountry = () => {
    setSelectedCountry(null);
    const newFormId = `country-form-${Date.now()}`;
    setFormId(newFormId);
    setIsModalOpen(true);
  };
  
  const handleEditCountry = (country: Country) => {
    setSelectedCountry(country);
    const newFormId = `country-form-${Date.now()}`;
    setFormId(newFormId);
    
    // Pre-fill the form with country data
    const { fillform } = useAddStore.getState();
    fillform(newFormId, {
      country_id: country.country_id,
      country_name: country.country_name,
      country_code: country.country_code,
      description: country.description || ""
    });
    
    setIsModalOpen(true);
  };
  
  const handleDeleteCountry = async (country: Country) => {
    if (window.confirm(`Are you sure you want to delete ${country.country_name}?`)) {
      try {
        await postApiCall(
          "api/generic/executeQuery",
          {
            configFile: "list-countries",
            fetchquery: {},
            path: ["actionConfig", "DELETE"],
            payload: [country.country_id]
          },
          true
        );
        
        // Refresh the list after deletion
        fetchCountries();
      } catch (error) {
        console.error("Error deleting country:", error);
      }
    }
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Country Management</h2>
        <button className={styles.addButton} onClick={handleAddCountry}>
          Add Country
        </button>
      </div>
      
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Country Name</th>
                <th>Country Code</th>
                <th>Description</th>
                <th>Last Updated</th>
                <th>Updated By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {countries.length > 0 ? (
                countries.map((country) => (
                  <tr key={country.country_id}>
                    <td>{country.country_name}</td>
                    <td>{country.country_code}</td>
                    <td>{country.description || "-"}</td>
                    <td>{new Date(country.last_updated_at).toLocaleString()}</td>
                    <td>{country.last_updated_by_name}</td>
                    <td>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleEditCountry(country)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleDeleteCountry(country)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    No countries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {isModalOpen && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <h3>{selectedCountry ? "Edit Country" : "Add Country"}</h3>
                  <button
                    className={styles.closeButton}
                    onClick={() => setIsModalOpen(false)}
                  >
                    &times;
                  </button>
                </div>
                <div className={styles.modalBody}>
                  <CountryForm
                    formId={formId}
                    setIsModalOpen={setIsModalOpen}
                    onSave={fetchCountries}
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