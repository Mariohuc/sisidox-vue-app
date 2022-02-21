import HTTP from "@/http";
import { CardFormData } from "@/store/models";

export async function uploadDoctorPhoto(formData: FormData): Promise<void> {
  const headers = {
    "Content-Type": "multipart/form-data",
    "Access-Control-Allow-Origin": "*"
  };

  await HTTP().post('/doctor-data/upload-photo', formData, { headers });
}
