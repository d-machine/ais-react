import { InputType } from "./types";
import InputSelect from "./InputSelect";
import InputText from "./InputText";
import InputDate from "./InputDate";
import InputButton from "./InputButton";


interface DependencyField{
    as: string;
    key: string;
}

interface Dependency{
    dependency: string;
    fields: DependencyField[];
}

interface Field{
    name:string;
    type:string;
    label:string;
    grid_column:string;
    dependencies:Dependency[];
    select_query: string;
    to_show: string;
    width:number;
    input_width:number;
};  

interface InputProps{
    field:Field;
    handleInputChange:(e: React.ChangeEvent<HTMLInputElement>) => void;
    formData: { [key: string]: string | number };
    selectedValues: { [key: string]: { id: string | number; name: string } };
    setModalTitle: (title: string) => void;
    setModalName: (name: string) => void;
    setModalData: (data: Array<{ id: number ; name: string }>) => void;
    setModalOpen: (open: boolean) => void;
}

const INPUT_MAP = {
    [InputType.TEXT]: InputText,
    [InputType.DATE]: InputDate,
    [InputType.SELECT]: InputSelect,
    [InputType.BUTTON]:InputButton
  } ;
  


export default function Form({field,handleInputChange, formData,selectedValues,setModalTitle,setModalName,setModalData,setModalOpen}:InputProps){
    const INPUT = INPUT_MAP[field.type];

    return (
        <INPUT field={field}  handleInputChange={handleInputChange} formData={formData}

        selectedValues={selectedValues} 
        setModalTitle={setModalTitle} 
        setModalName={setModalName} 
        setModalData={setModalData} 
        setModalOpen={setModalOpen}

        />
    );
}

