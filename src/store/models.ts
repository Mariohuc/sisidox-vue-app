export interface User {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  photoURL: string;
  roles: Role[]; // Only can take one of the follow values: 'PATIENT', 'DOCTOR', 'ADMINISTRATOR'
  disabled: boolean;
}

export enum Role {
  PATIENT = "PATIENT",
  DOCTOR = "DOCTOR",
  ADMINISTRATOR = "ADMINISTRATOR",
  GUEST = "GUEST"
}

export enum WordType {
  SPECIALTY = "SPECIALTY",
  ALLERGY = "ALLERGY",
  DISEASE = "DISEASE",
  MEDICATION = "MEDICATION"
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  imagePath: string;
  belongTo: Role[];
}

export interface Appointment {
  uid: string;
  startTime: string; // date and time
  endTime: string; // date and time
  cost: number;
  status: number;
  status_name?: string;
  verificationCode?: string;
  isFree: boolean;
  doctorId: string;
}

export interface AppointmentTicket {
  id: number;
  name?: string;
  start?: string;
  end?: string;
  startTime: any;
  endTime: any;
  cost: number;
  color?: string;
  verificationCode?: string;
  isFree: boolean;
  doctorId: string;
  recordStatus?: string;
}

export interface AppointmentTicketRange {
  start: string; //only date
  end: string; //only date
  tickets: AppointmentTicket[];
}

export interface AppointmentsRange {
  start: string; //only date
  end: string; //only date
  appointments: Appointment[];
}

export interface DoctorData {
  doctorId: string;
  fullname: string;
  specialty: string;
  cmpNumber: string;
  gender: string;
  appointmentCost: number;
  formalPhotoUrl?: string;
  personalDescription: string;
  createdAt: string;
  updatedAt?: string;
  recordStatus: string;
}
export interface DoctorSum {
  appointmentCost: number;
  cmpNumber: string;
  doctorId: string;
  doctorRating: number;
  fullname: string;
  gender: string;
  numberOfReviews: number;
  photoUrl: string;
  specialty: string;
  specialtyName: string;
}

export interface DictionaryWord {
  id?: string;
  codeword: string;
  name: string;
  description: string;
  type: WordType;
  recordStatus: string;
}

export interface AppStatus {
  label: string;
  color: string;
}

export interface Pagination {
  page: number;
  per_page: number;
  pre_page: number | null;
  next_page: number | null;
  total: number;
  total_pages: number;
  data: any[];
}

export interface DoctorCreationTicket {
  createdAt: string;
  documentNumber: string;
  documentType: string;
  id: string;
  recordStatus: string;
}

export interface BookedAppointment {
  id: string;
  patientId: string;
  doctorId: string;
  startTime: string;
  endTime: string;
  previousPatientComments: string;
  doctorConclusions: string;
  medicationSupplied: string;
  mpPaymentId: string;
  mpPaymentStatus: string;
  createdAt: string;
  updatedAt: string;
  apptStatus: string;
  recordStatus: string;
}

export interface MpSellerCredential {
  id: string;
  userId: string;
  accessToken?: string;
  refreshToken: string;
  publicKey: string;
  createdAt: string;
  updatedAt: string;
  recordStatus: string;
}

export interface SnackBarParams {
  snackbar: boolean;
  timeout?: number;
  color: string;
  text: string;
}

export interface AlertParams {
  visible: boolean;
  type: string;
  icon?: string;
  text: string;
}

export interface MercadoPagoPayload {
  token: string;
  issuer_id?: string;
  payment_method_id: string;
  transaction_amount: number;
  installments: number;
  description: string;
  payer: { email: string; identification?: { type: string; number: string } };
}

export interface CardFormData {
  amount: string;
  cardholderEmail: string;
  identificationNumber: string;
  identificationType: string;
  installments: string;
  issuerId: string;
  merchantAccountId: string;
  paymentMethodId: string;
  processingMode: string;
  token: string;
}
