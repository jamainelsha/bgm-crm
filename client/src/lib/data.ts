// BGM CRM — Central Data Store
// Mock data modelled on the Barrina Gardens Access database schema
// In production, this would be replaced by API calls to a backend

export type ResidentStatus = 'Active' | 'Departed' | 'Deceased' | 'On Leave';
export type UnitStatus = 'Occupied' | 'Vacant' | 'Under Maintenance' | 'Reserved';
export type ContractStatus = 'Active' | 'Terminated' | 'Pending Settlement';
export type EnquiryStatus = 'New' | 'Contacted' | 'Tour Scheduled' | 'Application' | 'Waitlisted' | 'Closed Won' | 'Closed Lost';
export type TaskStatus = 'Open' | 'In Progress' | 'Completed' | 'Overdue';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type MaintenanceStatus = 'Logged' | 'Assigned' | 'In Progress' | 'Completed' | 'Deferred';
export type NoteType = 'General' | 'Medical' | 'Financial' | 'Legal' | 'Family' | 'Maintenance' | 'Sales';
export type UserRole = 'Village Manager' | 'Sales' | 'Admin' | 'Resident Liaison' | 'Maintenance' | 'Finance';

export interface Resident {
  id: string;
  residentId: string;
  title: string;
  firstName: string;
  preferredName: string;
  middleName?: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  age: number;
  mobile?: string;
  phone?: string;
  email?: string;
  status: ResidentStatus;
  contractId?: string;
  unitNo?: string;
  photo?: string;
  // Health
  medicareNo?: string;
  ambulanceNo?: string;
  healthInsName?: string;
  healthInsNo?: string;
  // Doctor
  drName?: string;
  clinicName?: string;
  drPhone?: string;
  drEmail?: string;
  // Legal
  lawyerName?: string;
  firmName?: string;
  // POA
  poaName?: string;
  poaAppointed?: string;
  // Emergency contacts
  emergencyContacts: EmergencyContact[];
  medications: Medication[];
  allergies: string[];
  notes: Note[];
  moveInDate?: string;
  moveOutDate?: string;
  pets?: Pet[];
}

export interface EmergencyContact {
  id: string;
  callSeq: number;
  title: string;
  fullName: string;
  relationship: string;
  mobile?: string;
  phone?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

export interface Note {
  id: string;
  type: NoteType;
  date: string;
  time: string;
  user: string;
  content: string;
}

export interface Pet {
  type: string;
  breed: string;
}

export interface Unit {
  id: string;
  unitNo: string;
  unitType: 'Villa' | 'Apartment' | 'Studio' | 'Cottage';
  unitStyle: '1BR' | '2BR' | '3BR' | 'Studio';
  status: UnitStatus;
  marketValue: number;
  landSize?: number;
  sqm: number;
  contractId?: string;
  residentIds: string[];
  photos: string[];
  notes: Note[];
  lastMaintenanceDate?: string;
  features: string[];
}

export interface Contract {
  id: string;
  contractNo: string;
  unitNo: string;
  unitId: string;
  status: ContractStatus;
  settlementAmount: number;
  startDate: string;
  endDate?: string;
  years: number;
  cappedYears: number;
  dmfPercent: number;
  deferred: number;
  residentIds: string[];
  pets: Pet[];
  notes: Note[];
  // Termination
  terminationReason?: string;
  terminationSettlement?: number;
  terminationDeferred?: number;
  commission?: number;
  commissionPercent?: number;
  legalFees?: number;
  otherFees?: number;
  payToResident?: number;
  payToManagement?: number;
}

export interface Enquiry {
  id: string;
  enquiryNo: string;
  title: string;
  firstName: string;
  lastName: string;
  email?: string;
  mobile?: string;
  phone?: string;
  status: EnquiryStatus;
  source: string;
  enquiryDate: string;
  preferredUnitType?: string;
  budget?: number;
  notes: Note[];
  nextFollowUp?: string;
  assignedTo?: string;
  tourDate?: string;
  waitlistPosition?: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  assignedTo?: string;
  relatedTo?: string;
  relatedType?: 'Resident' | 'Unit' | 'Enquiry' | 'Contract';
  dueDate?: string;
  completedDate?: string;
  createdDate: string;
  createdBy: string;
  notes?: string;
}

export interface MaintenanceRequest {
  id: string;
  requestNo: string;
  title: string;
  description: string;
  status: MaintenanceStatus;
  priority: TaskPriority;
  category: string;
  unitNo?: string;
  unitId?: string;
  reportedBy: string;
  reportedDate: string;
  assignedTo?: string;
  scheduledDate?: string;
  completedDate?: string;
  cost?: number;
  notes: Note[];
}

export interface Appointment {
  id: string;
  title: string;
  type: 'Tour' | 'Meeting' | 'Move-In' | 'Move-Out' | 'Medical' | 'Legal' | 'Other';
  date: string;
  time: string;
  duration: number; // minutes
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show';
  relatedTo?: string;
  relatedType?: 'Resident' | 'Enquiry';
  attendees: string[];
  notes?: string;
  location?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  initials: string;
  active: boolean;
}

// ============================================================
// MOCK DATA
// ============================================================

export const users: User[] = [
  { id: 'u1', name: 'Sarah Mitchell', email: 'sarah.mitchell@barrina.com.au', role: 'Village Manager', initials: 'SM', active: true },
  { id: 'u2', name: 'James Nguyen', email: 'james.nguyen@barrina.com.au', role: 'Sales', initials: 'JN', active: true },
  { id: 'u3', name: 'Linda Park', email: 'linda.park@barrina.com.au', role: 'Admin', initials: 'LP', active: true },
  { id: 'u4', name: 'Tom Walsh', email: 'tom.walsh@barrina.com.au', role: 'Maintenance', initials: 'TW', active: true },
  { id: 'u5', name: 'Murat Iz', email: 'murat.iz@barrina.com.au', role: 'Village Manager', initials: 'MI', active: true },
  { id: 'u6', name: 'Rachel Chen', email: 'rachel.chen@barrina.com.au', role: 'Resident Liaison', initials: 'RC', active: true },
  { id: 'u7', name: 'David Okafor', email: 'david.okafor@barrina.com.au', role: 'Finance', initials: 'DO', active: true },
];

export const currentUser = users[0];

export const residents: Resident[] = [
  {
    id: 'r1', residentId: 'HARREN01', title: 'Mr', firstName: 'Harold', preferredName: 'Harry', lastName: 'Renshaw',
    gender: 'Male', dateOfBirth: '1942-03-15', age: 83, mobile: '0412 345 678', phone: '02 9876 5432',
    email: 'h.renshaw@email.com', status: 'Active', contractId: 'c1', unitNo: '02',
    medicareNo: '2345 67890 1', ambulanceNo: 'AMB-44521', healthInsName: 'Medibank', healthInsNo: 'MED-88234',
    drName: 'Dr. Patricia Wong', clinicName: 'Barrina Medical Centre', drPhone: '02 9876 1234',
    lawyerName: 'Robert Hartley', firmName: 'Hartley & Associates',
    poaName: 'Susan Renshaw', poaAppointed: '2020-06-01',
    emergencyContacts: [
      { id: 'ec1', callSeq: 1, title: 'Mrs', fullName: 'Susan Renshaw', relationship: 'Daughter', mobile: '0423 456 789', phone: '02 9234 5678' },
      { id: 'ec2', callSeq: 2, title: 'Mr', fullName: 'Peter Renshaw', relationship: 'Son', mobile: '0434 567 890' }
    ],
    medications: [
      { id: 'm1', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
      { id: 'm2', name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily (evening)' }
    ],
    allergies: ['Penicillin', 'Aspirin'],
    notes: [
      { id: 'n1', type: 'General', date: '2024-11-15', time: '10:30', user: 'Sarah Mitchell', content: 'Harry settled in well. Attended welcome morning tea.' },
      { id: 'n2', type: 'Medical', date: '2025-01-08', time: '14:00', user: 'Rachel Chen', content: 'Reminded about upcoming cardiology appointment. Transport arranged.' }
    ],
    moveInDate: '2022-01-01', pets: [{ type: 'Dog', breed: 'Labrador' }]
  },
  {
    id: 'r2', residentId: 'CHRLOO02', title: 'Mrs', firstName: 'Christine', preferredName: 'Chris', lastName: 'Looney',
    gender: 'Female', dateOfBirth: '1945-07-22', age: 80, mobile: '0415 678 901', phone: '02 9345 6789',
    email: 'c.looney@email.com', status: 'Active', contractId: 'c2', unitNo: '05',
    medicareNo: '3456 78901 2', ambulanceNo: 'AMB-55632',
    drName: 'Dr. James Patel', clinicName: 'Greenfield Family Practice', drPhone: '02 9765 4321',
    emergencyContacts: [
      { id: 'ec3', callSeq: 1, title: 'Mr', fullName: 'Brian Looney', relationship: 'Son', mobile: '0445 789 012' }
    ],
    medications: [
      { id: 'm3', name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily' }
    ],
    allergies: [],
    notes: [
      { id: 'n3', type: 'General', date: '2025-02-10', time: '11:00', user: 'Rachel Chen', content: 'Christine requested garden maintenance for Unit 05 front bed.' }
    ],
    moveInDate: '2019-12-01'
  },
  {
    id: 'r3', residentId: 'MURIZX01', title: 'Mr', firstName: 'Murat', preferredName: 'Murat', lastName: 'Iz',
    gender: 'Male', dateOfBirth: '1948-11-05', age: 77, mobile: '0418 234 567',
    status: 'Active', contractId: 'c3', unitNo: '08',
    emergencyContacts: [
      { id: 'ec4', callSeq: 1, title: 'Ms', fullName: 'Ayse Iz', relationship: 'Daughter', mobile: '0456 890 123' }
    ],
    medications: [], allergies: ['Sulfa drugs'],
    notes: [], moveInDate: '2022-01-01'
  },
  {
    id: 'r4', residentId: 'SHIDHI01', title: 'Mrs', firstName: 'Shirley', preferredName: 'Shirl', lastName: 'Dhillon',
    gender: 'Female', dateOfBirth: '1940-04-30', age: 85, mobile: '0421 345 678',
    status: 'Active', contractId: 'c4', unitNo: '10A',
    emergencyContacts: [
      { id: 'ec5', callSeq: 1, title: 'Mr', fullName: 'Raj Dhillon', relationship: 'Son', mobile: '0467 901 234' }
    ],
    medications: [
      { id: 'm4', name: 'Warfarin', dosage: '3mg', frequency: 'Once daily' },
      { id: 'm5', name: 'Furosemide', dosage: '40mg', frequency: 'Once daily (morning)' }
    ],
    allergies: ['Latex'],
    notes: [
      { id: 'n4', type: 'Medical', date: '2025-03-01', time: '09:00', user: 'Rachel Chen', content: 'INR check due next week. Reminded family.' }
    ],
    moveInDate: '2020-12-01'
  },
  {
    id: 'r5', residentId: 'WILBEA01', title: 'Mr', firstName: 'William', preferredName: 'Bill', lastName: 'Beaumont',
    gender: 'Male', dateOfBirth: '1938-09-12', age: 87, mobile: '0419 456 789',
    status: 'Departed', contractId: 'c5', unitNo: '15',
    emergencyContacts: [],
    medications: [], allergies: [],
    notes: [
      { id: 'n5', type: 'General', date: '2024-08-15', time: '16:00', user: 'Sarah Mitchell', content: 'Contract terminated. Unit 15 now vacant and ready for inspection.' }
    ],
    moveInDate: '2020-12-01', moveOutDate: '2024-08-10'
  },
  {
    id: 'r6', residentId: 'JONMAR01', title: 'Mrs', firstName: 'Margaret', preferredName: 'Marg', lastName: 'Jones',
    gender: 'Female', dateOfBirth: '1943-02-18', age: 82, mobile: '0422 567 890',
    status: 'Active', contractId: 'c6', unitNo: '11A',
    emergencyContacts: [
      { id: 'ec6', callSeq: 1, title: 'Ms', fullName: 'Karen Jones', relationship: 'Daughter', mobile: '0478 012 345' }
    ],
    medications: [
      { id: 'm6', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' }
    ],
    allergies: [],
    notes: [], moveInDate: '2021-06-01'
  },
];

export const units: Unit[] = [
  {
    id: 'u01', unitNo: '02', unitType: 'Villa', unitStyle: '2BR', status: 'Occupied',
    marketValue: 485000, landSize: 320, sqm: 98, contractId: 'c1', residentIds: ['r1'],
    photos: ['https://d2xsxph8kpxj0f.cloudfront.net/310519663364956560/3kCyjBhX6Z8kZVCZhWirGM/bgm-unit-placeholder_1f396481.jpg'],
    notes: [], features: ['Double garage', 'Garden courtyard', 'Air conditioning', 'Dishwasher'],
    lastMaintenanceDate: '2025-01-15'
  },
  {
    id: 'u02', unitNo: '05', unitType: 'Villa', unitStyle: '2BR', status: 'Occupied',
    marketValue: 510000, landSize: 345, sqm: 105, contractId: 'c2', residentIds: ['r2'],
    photos: ['https://d2xsxph8kpxj0f.cloudfront.net/310519663364956560/3kCyjBhX6Z8kZVCZhWirGM/bgm-unit-placeholder_1f396481.jpg'],
    notes: [], features: ['Single garage', 'Garden courtyard', 'Air conditioning', 'Solar panels'],
    lastMaintenanceDate: '2024-11-20'
  },
  {
    id: 'u03', unitNo: '08', unitType: 'Villa', unitStyle: '2BR', status: 'Occupied',
    marketValue: 495000, landSize: 310, sqm: 100, contractId: 'c3', residentIds: ['r3'],
    photos: ['https://d2xsxph8kpxj0f.cloudfront.net/310519663364956560/3kCyjBhX6Z8kZVCZhWirGM/bgm-unit-placeholder_1f396481.jpg'],
    notes: [], features: ['Double garage', 'Air conditioning'],
    lastMaintenanceDate: '2025-02-01'
  },
  {
    id: 'u04', unitNo: '10A', unitType: 'Villa', unitStyle: '2BR', status: 'Occupied',
    marketValue: 520000, landSize: 360, sqm: 112, contractId: 'c4', residentIds: ['r4'],
    photos: ['https://d2xsxph8kpxj0f.cloudfront.net/310519663364956560/3kCyjBhX6Z8kZVCZhWirGM/bgm-unit-placeholder_1f396481.jpg'],
    notes: [], features: ['Double garage', 'Garden courtyard', 'Air conditioning', 'Dishwasher', 'Pergola'],
    lastMaintenanceDate: '2025-01-28'
  },
  {
    id: 'u05', unitNo: '10B', unitType: 'Villa', unitStyle: '1BR', status: 'Vacant',
    marketValue: 395000, sqm: 75, residentIds: [],
    photos: ['https://d2xsxph8kpxj0f.cloudfront.net/310519663364956560/3kCyjBhX6Z8kZVCZhWirGM/bgm-unit-placeholder_1f396481.jpg'],
    notes: [{ id: 'un1', type: 'General', date: '2025-02-20', time: '10:00', user: 'Sarah Mitchell', content: 'Unit freshly painted and ready for inspection.' }],
    features: ['Single garage', 'Air conditioning']
  },
  {
    id: 'u06', unitNo: '11A', unitType: 'Villa', unitStyle: '2BR', status: 'Occupied',
    marketValue: 505000, landSize: 330, sqm: 102, contractId: 'c6', residentIds: ['r6'],
    photos: ['https://d2xsxph8kpxj0f.cloudfront.net/310519663364956560/3kCyjBhX6Z8kZVCZhWirGM/bgm-unit-placeholder_1f396481.jpg'],
    notes: [], features: ['Single garage', 'Garden courtyard', 'Air conditioning'],
    lastMaintenanceDate: '2025-01-10'
  },
  {
    id: 'u07', unitNo: '12A', unitType: 'Villa', unitStyle: '3BR', status: 'Vacant',
    marketValue: 620000, landSize: 420, sqm: 145, residentIds: [],
    photos: ['https://d2xsxph8kpxj0f.cloudfront.net/310519663364956560/3kCyjBhX6Z8kZVCZhWirGM/bgm-unit-placeholder_1f396481.jpg'],
    notes: [], features: ['Double garage', 'Garden courtyard', 'Air conditioning', 'Dishwasher', 'Solar panels', 'Pergola']
  },
  {
    id: 'u08', unitNo: '15', unitType: 'Villa', unitStyle: '2BR', status: 'Under Maintenance',
    marketValue: 475000, landSize: 300, sqm: 95, residentIds: [],
    photos: ['https://d2xsxph8kpxj0f.cloudfront.net/310519663364956560/3kCyjBhX6Z8kZVCZhWirGM/bgm-unit-placeholder_1f396481.jpg'],
    notes: [{ id: 'un2', type: 'Maintenance', date: '2025-02-15', time: '09:00', user: 'Tom Walsh', content: 'Bathroom renovation in progress. Estimated completion 15 March.' }],
    features: ['Single garage', 'Air conditioning'],
    lastMaintenanceDate: '2025-02-15'
  },
  {
    id: 'u09', unitNo: '18', unitType: 'Apartment', unitStyle: '1BR', status: 'Vacant',
    marketValue: 340000, sqm: 65, residentIds: [],
    photos: ['https://d2xsxph8kpxj0f.cloudfront.net/310519663364956560/3kCyjBhX6Z8kZVCZhWirGM/bgm-unit-placeholder_1f396481.jpg'],
    notes: [], features: ['Air conditioning', 'Balcony']
  },
  {
    id: 'u10', unitNo: '21', unitType: 'Villa', unitStyle: '2BR', status: 'Reserved',
    marketValue: 490000, landSize: 315, sqm: 99, residentIds: [],
    photos: ['https://d2xsxph8kpxj0f.cloudfront.net/310519663364956560/3kCyjBhX6Z8kZVCZhWirGM/bgm-unit-placeholder_1f396481.jpg'],
    notes: [{ id: 'un3', type: 'Sales', date: '2025-03-01', time: '14:00', user: 'James Nguyen', content: 'Reserved for Patricia Morrison — application in progress.' }],
    features: ['Double garage', 'Garden courtyard', 'Air conditioning']
  },
];

export const contracts: Contract[] = [
  {
    id: 'c1', contractNo: 'CM02-220101-HR', unitNo: '02', unitId: 'u01', status: 'Active',
    settlementAmount: 420000, startDate: '2022-01-01', years: 3, cappedYears: 10,
    dmfPercent: 3.5, deferred: 14700, residentIds: ['r1'],
    pets: [{ type: 'Dog', breed: 'Labrador' }], notes: []
  },
  {
    id: 'c2', contractNo: 'CM05-191201-CL', unitNo: '05', unitId: 'u02', status: 'Active',
    settlementAmount: 450000, startDate: '2019-12-01', years: 5, cappedYears: 10,
    dmfPercent: 3.5, deferred: 78750, residentIds: ['r2'],
    pets: [], notes: []
  },
  {
    id: 'c3', contractNo: 'CM08-220101-MI', unitNo: '08', unitId: 'u03', status: 'Active',
    settlementAmount: 435000, startDate: '2022-01-01', years: 3, cappedYears: 10,
    dmfPercent: 3.5, deferred: 15225, residentIds: ['r3'],
    pets: [], notes: []
  },
  {
    id: 'c4', contractNo: 'CM10A-201201-SD', unitNo: '10A', unitId: 'u04', status: 'Active',
    settlementAmount: 460000, startDate: '2020-12-01', years: 4, cappedYears: 10,
    dmfPercent: 3.5, deferred: 64400, residentIds: ['r4'],
    pets: [], notes: []
  },
  {
    id: 'c5', contractNo: 'CM15-201201-WB', unitNo: '15', unitId: 'u08', status: 'Terminated',
    settlementAmount: 410000, startDate: '2020-12-01', endDate: '2024-08-10', years: 3, cappedYears: 10,
    dmfPercent: 3.5, deferred: 43050, residentIds: ['r5'],
    pets: [], notes: [],
    terminationReason: 'Resident moved to aged care facility',
    terminationSettlement: 410000, terminationDeferred: 43050,
    commission: 12300, commissionPercent: 3, legalFees: 2500, otherFees: 800,
    payToResident: 351350, payToManagement: 58650
  },
  {
    id: 'c6', contractNo: 'CM11A-210601-MJ', unitNo: '11A', unitId: 'u06', status: 'Active',
    settlementAmount: 445000, startDate: '2021-06-01', years: 4, cappedYears: 10,
    dmfPercent: 3.5, deferred: 62300, residentIds: ['r6'],
    pets: [], notes: []
  },
];

export const enquiries: Enquiry[] = [
  {
    id: 'e1', enquiryNo: 'ENQ-2025-001', title: 'Mrs', firstName: 'Patricia', lastName: 'Morrison',
    email: 'p.morrison@email.com', mobile: '0411 234 567', status: 'Application',
    source: 'Website', enquiryDate: '2025-01-15', preferredUnitType: '2BR Villa',
    budget: 500000, nextFollowUp: '2025-03-10', assignedTo: 'James Nguyen',
    notes: [
      { id: 'en1', type: 'Sales', date: '2025-01-15', time: '10:00', user: 'James Nguyen', content: 'Initial enquiry via website. Very interested in 2BR villa. Daughter will be involved in decision.' },
      { id: 'en2', type: 'Sales', date: '2025-02-01', time: '14:00', user: 'James Nguyen', content: 'Tour completed. Patricia loved Unit 21. Application forms sent.' }
    ]
  },
  {
    id: 'e2', enquiryNo: 'ENQ-2025-002', title: 'Mr', firstName: 'Robert', lastName: 'Chambers',
    mobile: '0422 345 678', status: 'Tour Scheduled',
    source: 'Referral', enquiryDate: '2025-02-05', preferredUnitType: '1BR Villa',
    budget: 420000, nextFollowUp: '2025-03-08', assignedTo: 'James Nguyen', tourDate: '2025-03-08',
    notes: [
      { id: 'en3', type: 'Sales', date: '2025-02-05', time: '11:30', user: 'James Nguyen', content: 'Referred by Harold Renshaw (Unit 02). Looking for 1BR. Tour booked for 8 March.' }
    ]
  },
  {
    id: 'e3', enquiryNo: 'ENQ-2025-003', title: 'Ms', firstName: 'Dorothy', lastName: 'Huang',
    email: 'd.huang@email.com', mobile: '0433 456 789', status: 'Waitlisted',
    source: 'Phone', enquiryDate: '2025-01-28', preferredUnitType: '2BR Villa',
    budget: 480000, waitlistPosition: 2, assignedTo: 'James Nguyen',
    notes: [
      { id: 'en4', type: 'Sales', date: '2025-01-28', time: '09:00', user: 'James Nguyen', content: 'Interested in 2BR villa. No current vacancies. Added to waitlist at position 2.' }
    ]
  },
  {
    id: 'e4', enquiryNo: 'ENQ-2025-004', title: 'Mr', firstName: 'George', lastName: 'Papadopoulos',
    email: 'g.papa@email.com', mobile: '0444 567 890', status: 'New',
    source: 'Walk-in', enquiryDate: '2025-03-05', preferredUnitType: '3BR Villa',
    budget: 650000, assignedTo: 'James Nguyen',
    notes: []
  },
  {
    id: 'e5', enquiryNo: 'ENQ-2024-089', title: 'Mrs', firstName: 'Helen', lastName: 'Fitzgerald',
    email: 'h.fitz@email.com', mobile: '0455 678 901', status: 'Closed Won',
    source: 'Website', enquiryDate: '2024-09-10', preferredUnitType: '2BR Villa',
    budget: 510000, assignedTo: 'James Nguyen',
    notes: [
      { id: 'en5', type: 'Sales', date: '2024-12-01', time: '10:00', user: 'James Nguyen', content: 'Contract signed for Unit 11A. Move-in confirmed for 1 June 2021.' }
    ]
  },
];

export const tasks: Task[] = [
  {
    id: 't1', title: 'Follow up Patricia Morrison application', status: 'Open', priority: 'High',
    category: 'Sales', assignedTo: 'James Nguyen', relatedTo: 'e1', relatedType: 'Enquiry',
    dueDate: '2025-03-10', createdDate: '2025-03-01', createdBy: 'James Nguyen',
    description: 'Application forms received. Need to review and confirm deposit.'
  },
  {
    id: 't2', title: 'INR check reminder — Shirley Dhillon', status: 'Open', priority: 'Urgent',
    category: 'Medical', assignedTo: 'Rachel Chen', relatedTo: 'r4', relatedType: 'Resident',
    dueDate: '2025-03-08', createdDate: '2025-03-01', createdBy: 'Rachel Chen',
    description: 'Warfarin patient. INR check overdue by 3 days. Coordinate with Dr. Wong.'
  },
  {
    id: 't3', title: 'Unit 15 bathroom renovation sign-off', status: 'In Progress', priority: 'Medium',
    category: 'Maintenance', assignedTo: 'Tom Walsh', relatedTo: 'u08', relatedType: 'Unit',
    dueDate: '2025-03-15', createdDate: '2025-02-15', createdBy: 'Sarah Mitchell',
    description: 'Bathroom renovation in progress. Final inspection required before listing.'
  },
  {
    id: 't4', title: 'Quarterly fire safety inspection', status: 'Open', priority: 'High',
    category: 'Compliance', assignedTo: 'Tom Walsh',
    dueDate: '2025-03-31', createdDate: '2025-03-01', createdBy: 'Sarah Mitchell',
    description: 'Annual fire safety compliance check for all units.'
  },
  {
    id: 't5', title: 'Welcome pack for Robert Chambers tour', status: 'Open', priority: 'Medium',
    category: 'Sales', assignedTo: 'Linda Park', relatedTo: 'e2', relatedType: 'Enquiry',
    dueDate: '2025-03-07', createdDate: '2025-03-05', createdBy: 'James Nguyen',
    description: 'Prepare welcome pack and unit information sheets for tour on 8 March.'
  },
  {
    id: 't6', title: 'Update resident emergency contact — Harold Renshaw', status: 'Completed', priority: 'Low',
    category: 'Admin', assignedTo: 'Linda Park', relatedTo: 'r1', relatedType: 'Resident',
    dueDate: '2025-02-28', completedDate: '2025-02-26', createdDate: '2025-02-20', createdBy: 'Rachel Chen'
  },
  {
    id: 't7', title: 'Contract renewal review — Christine Looney', status: 'Open', priority: 'Medium',
    category: 'Finance', assignedTo: 'David Okafor', relatedTo: 'r2', relatedType: 'Resident',
    dueDate: '2025-04-01', createdDate: '2025-03-01', createdBy: 'Sarah Mitchell',
    description: 'Contract approaching 6-year mark. Review DMF schedule and advise resident.'
  },
  {
    id: 't8', title: 'Overdue: Unit 10B inspection report', status: 'Overdue', priority: 'High',
    category: 'Admin', assignedTo: 'Linda Park', relatedTo: 'u05', relatedType: 'Unit',
    dueDate: '2025-02-28', createdDate: '2025-02-15', createdBy: 'Sarah Mitchell',
    description: 'Inspection report for vacant Unit 10B not yet filed.'
  },
];

export const maintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'mr1', requestNo: 'MR-2025-001', title: 'Bathroom renovation — Unit 15',
    description: 'Full bathroom renovation following departure of previous resident. New tiles, vanity, and shower screen.',
    status: 'In Progress', priority: 'Medium', category: 'Renovation',
    unitNo: '15', unitId: 'u08', reportedBy: 'Sarah Mitchell', reportedDate: '2025-02-15',
    assignedTo: 'Tom Walsh', scheduledDate: '2025-02-18', cost: 8500, notes: [
      { id: 'mn1', type: 'Maintenance', date: '2025-02-18', time: '08:00', user: 'Tom Walsh', content: 'Work commenced. Tiles removed. New tiles ordered.' },
      { id: 'mn2', type: 'Maintenance', date: '2025-03-01', time: '09:00', user: 'Tom Walsh', content: 'Tiling complete. Vanity installation scheduled for next week.' }
    ]
  },
  {
    id: 'mr2', requestNo: 'MR-2025-002', title: 'Air conditioner fault — Unit 02',
    description: 'Resident reports AC unit not cooling properly. Making unusual noise.',
    status: 'Completed', priority: 'High', category: 'HVAC',
    unitNo: '02', unitId: 'u01', reportedBy: 'Harold Renshaw', reportedDate: '2025-01-20',
    assignedTo: 'Tom Walsh', scheduledDate: '2025-01-22', completedDate: '2025-01-22', cost: 320, notes: [
      { id: 'mn3', type: 'Maintenance', date: '2025-01-22', time: '10:00', user: 'Tom Walsh', content: 'Faulty capacitor replaced. Unit now working correctly.' }
    ]
  },
  {
    id: 'mr3', requestNo: 'MR-2025-003', title: 'Garden path crack — Unit 05',
    description: 'Concrete path in front garden has developed a crack. Trip hazard.',
    status: 'Assigned', priority: 'High', category: 'Grounds',
    unitNo: '05', unitId: 'u02', reportedBy: 'Christine Looney', reportedDate: '2025-02-10',
    assignedTo: 'Tom Walsh', scheduledDate: '2025-03-10', notes: []
  },
  {
    id: 'mr4', requestNo: 'MR-2025-004', title: 'Leaking tap — Unit 08',
    description: 'Kitchen tap dripping constantly.',
    status: 'Logged', priority: 'Low', category: 'Plumbing',
    unitNo: '08', unitId: 'u03', reportedBy: 'Murat Iz', reportedDate: '2025-03-04', notes: []
  },
  {
    id: 'mr5', requestNo: 'MR-2025-005', title: 'Common area lighting — Main pathway',
    description: 'Three lights on main pathway not working. Safety concern at night.',
    status: 'Assigned', priority: 'Urgent', category: 'Electrical',
    reportedBy: 'Sarah Mitchell', reportedDate: '2025-03-05',
    assignedTo: 'Tom Walsh', scheduledDate: '2025-03-07', notes: []
  },
];

export const appointments: Appointment[] = [
  {
    id: 'a1', title: 'Village Tour — Robert Chambers', type: 'Tour',
    date: '2025-03-08', time: '10:00', duration: 90, status: 'Scheduled',
    relatedTo: 'e2', relatedType: 'Enquiry',
    attendees: ['James Nguyen', 'Robert Chambers'], location: 'Main Reception',
    notes: 'Show Unit 10B and Unit 18. Prepare welcome pack.'
  },
  {
    id: 'a2', title: 'Move-in Inspection — Patricia Morrison', type: 'Move-In',
    date: '2025-03-20', time: '09:00', duration: 120, status: 'Scheduled',
    relatedTo: 'e1', relatedType: 'Enquiry',
    attendees: ['Sarah Mitchell', 'Linda Park', 'Patricia Morrison'], location: 'Unit 21',
    notes: 'Final inspection and key handover for Unit 21.'
  },
  {
    id: 'a3', title: 'Resident welfare check — Shirley Dhillon', type: 'Meeting',
    date: '2025-03-07', time: '14:00', duration: 30, status: 'Scheduled',
    relatedTo: 'r4', relatedType: 'Resident',
    attendees: ['Rachel Chen', 'Shirley Dhillon'], location: 'Unit 10A',
    notes: 'Monthly welfare check. Discuss INR results when available.'
  },
  {
    id: 'a4', title: 'Village Tour — George Papadopoulos', type: 'Tour',
    date: '2025-03-12', time: '11:00', duration: 90, status: 'Scheduled',
    relatedTo: 'e4', relatedType: 'Enquiry',
    attendees: ['James Nguyen', 'George Papadopoulos'], location: 'Main Reception',
    notes: 'Show Unit 12A (3BR). Bring pricing sheet.'
  },
];

// ============================================================
// COMPUTED STATS
// ============================================================

export function getDashboardStats() {
  const totalUnits = units.length;
  const occupiedUnits = units.filter(u => u.status === 'Occupied').length;
  const vacantUnits = units.filter(u => u.status === 'Vacant').length;
  const maintenanceUnits = units.filter(u => u.status === 'Under Maintenance').length;
  const reservedUnits = units.filter(u => u.status === 'Reserved').length;
  const occupancyRate = Math.round((occupiedUnits / totalUnits) * 100);

  const activeResidents = residents.filter(r => r.status === 'Active').length;
  const newEnquiries = enquiries.filter(e => e.status === 'New').length;
  const openTasks = tasks.filter(t => t.status === 'Open' || t.status === 'Overdue').length;
  const overdueTasks = tasks.filter(t => t.status === 'Overdue').length;
  const openMaintenance = maintenanceRequests.filter(m => m.status !== 'Completed').length;
  const urgentMaintenance = maintenanceRequests.filter(m => m.priority === 'Urgent' && m.status !== 'Completed').length;

  const totalSettlement = contracts
    .filter(c => c.status === 'Active')
    .reduce((sum, c) => sum + c.settlementAmount, 0);

  const totalDeferred = contracts
    .filter(c => c.status === 'Active')
    .reduce((sum, c) => sum + c.deferred, 0);

  return {
    totalUnits, occupiedUnits, vacantUnits, maintenanceUnits, reservedUnits, occupancyRate,
    activeResidents, newEnquiries, openTasks, overdueTasks, openMaintenance, urgentMaintenance,
    totalSettlement, totalDeferred,
    upcomingAppointments: appointments.filter(a => a.status === 'Scheduled').length,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function getResidentByContractId(contractId: string): Resident | undefined {
  return residents.find(r => r.contractId === contractId);
}

export function getUnitByNo(unitNo: string): Unit | undefined {
  return units.find(u => u.unitNo === unitNo);
}
