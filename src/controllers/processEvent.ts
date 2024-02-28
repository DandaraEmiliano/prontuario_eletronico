import axios from "axios";

export const handler = async (event: any) => {
  try {

    console.log("Starting message processing", event);

    const newPatient = {
      name: "João Gabriel",
      age: 30,
      gender: "male",
    };

    const response = await axios.post(
      "http://localhost:3000/api/patients",
      newPatient
    );
    console.log("API Response:", response.data);

    const patients = await axios.get("http://localhost:3000/api/patients");
      console.log("Patients List:", patients.data);
      
    return { status: "success" };
  } catch (error) {
    console.log("Error", error);
    throw new Error("Error processing message");
  }
};
