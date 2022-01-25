import HTTP from "@/http";
import { CardFormData } from "@/store/models";

export async function uploadDoctorPhoto(formData: FormData): Promise<void> {
  const headers = {
    "Content-Type": "multipart/form-data",
    "Access-Control-Allow-Origin": "*"
  };

  await HTTP().post('/doctor-data/upload-photo', formData, { headers });
}


export function getMercadoPagoPayload(cardFormData: CardFormData, appointmentData?: { specialty?: string }): { token: string, issuer_id: string, payment_method_id: string, transaction_amount: number, installments: number, description: string, payer: { email: string, identification: { type: string, number: string } } } 
{
  return {
    token: cardFormData.token,
    issuer_id: cardFormData.issuerId,
    payment_method_id: cardFormData.paymentMethodId,
    transaction_amount: Number(cardFormData.amount),
    installments: Number(cardFormData.installments),
    description: appointmentData?.specialty || "Cita General",
    payer: {
      email: cardFormData.cardholderEmail,
      identification: {
        type: cardFormData.identificationType,
        number: cardFormData.identificationNumber,
      },
    },
  }
}

/**
 * Example CardFormData
 *  {
 *    amount: "20"
      cardholderEmail: "mhuaypuna@unsa.edu.pe"
      identificationNumber: "72451847"
      identificationType: "DNI"
      installments: "1"
      issuerId: "12551"
      merchantAccountId: ""
      paymentMethodId: "visa"
      processingMode: "aggregator"
      token: "eda289e8e1a57fb85dad214f0d426d2f"
 * }
 */