export interface User {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  photoURL: string;
  roles: string[]; // Only can take one of the follow values: 'PATIENT', 'DOCTOR', 'ADMINISTRATOR'
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
  uid: string;
  name: string;
  start: string;
  end: string;
  cost: number;
  color: string;
  verificationCode?: string;
  isFree: boolean;
  doctorId: string;
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
  uid?: string;
  fullnameOfDr: string;
  specialty: string;
  cmpNumber: string;
  appointmentCost: number;
  formalPhotoUrl?: string;
  personalDescription: string;
  disabled: boolean;
}

export interface DictionaryWord {
  uid?: string;
  name: string;
  description: string;
  type: WordType;
  metadata?: any;
  disabled: boolean;
}
