// Barrina Gardens CRM — Resident Onboarding Form
// Branded form based on the Google Form question list (77 questions)
// Staff can share the /onboarding URL with new residents
import { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle, User, Heart, Phone, FileText, Pill } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const LOGO_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663364956560/3kCyjBhX6Z8kZVCZhWirGM/logopng_e0be7378.png';

const STEPS = [
  { id: 1, title: 'Personal Details', icon: <User size={16} /> },
  { id: 2, title: 'Emergency Contacts', icon: <Phone size={16} /> },
  { id: 3, title: 'Legal & Financial', icon: <FileText size={16} /> },
  { id: 4, title: 'Medical Information', icon: <Heart size={16} /> },
  { id: 5, title: 'Medications', icon: <Pill size={16} /> },
];

interface FormData {
  // Personal
  title: string; firstName: string; lastName: string; preferredName: string;
  gender: string; dob: string; email: string; mobile: string; landline: string;
  hasCoResident: string; unitNo: string; unitType: string;
  hasPet: string; petType: string; petBreed: string;
  // Emergency Contact 1
  ec1Title: string; ec1FirstName: string; ec1LastName: string; ec1Email: string;
  ec1Mobile: string; ec1Landline: string; ec1Relationship: string; ec1Address: string;
  hasEc2: string;
  // Emergency Contact 2
  ec2Title: string; ec2FirstName: string; ec2LastName: string; ec2Email: string;
  ec2Mobile: string; ec2Landline: string; ec2Relationship: string; ec2Address: string;
  // Doctor
  doctorName: string; doctorClinic: string; doctorEmail: string; doctorMobile: string;
  doctorLandline: string; doctorAddress: string;
  // Lawyer
  lawyerFirm: string; lawyerName: string; lawyerEmail: string; lawyerMobile: string;
  lawyerLandline: string; lawyerAddress: string;
  // Legal
  hasPoa: string; poaHolder: string; poaAttorney: string; poaAttorneyEmail: string;
  poaAttorneyPhone: string; poaAttorneyAddress: string;
  hasWill: string; willHolder: string; willExecutor: string; executorEmail: string;
  executorPhone: string; executorAddress: string;
  // Medical
  medicare: string; ambulance: string; healthFund: string; healthFundNo: string;
  medicalConditions: string; allergies: string;
  // Medications (up to 10)
  med1: string; med2: string; med3: string; med4: string; med5: string;
  med6: string; med7: string; med8: string; med9: string; med10: string;
}

const EMPTY: FormData = {
  title: '', firstName: '', lastName: '', preferredName: '', gender: '', dob: '', email: '',
  mobile: '', landline: '', hasCoResident: '', unitNo: '', unitType: '', hasPet: '', petType: '', petBreed: '',
  ec1Title: '', ec1FirstName: '', ec1LastName: '', ec1Email: '', ec1Mobile: '', ec1Landline: '',
  ec1Relationship: '', ec1Address: '', hasEc2: '',
  ec2Title: '', ec2FirstName: '', ec2LastName: '', ec2Email: '', ec2Mobile: '', ec2Landline: '',
  ec2Relationship: '', ec2Address: '',
  doctorName: '', doctorClinic: '', doctorEmail: '', doctorMobile: '', doctorLandline: '', doctorAddress: '',
  lawyerFirm: '', lawyerName: '', lawyerEmail: '', lawyerMobile: '', lawyerLandline: '', lawyerAddress: '',
  hasPoa: '', poaHolder: '', poaAttorney: '', poaAttorneyEmail: '', poaAttorneyPhone: '', poaAttorneyAddress: '',
  hasWill: '', willHolder: '', willExecutor: '', executorEmail: '', executorPhone: '', executorAddress: '',
  medicare: '', ambulance: '', healthFund: '', healthFundNo: '', medicalConditions: '', allergies: '',
  med1: '', med2: '', med3: '', med4: '', med5: '', med6: '', med7: '', med8: '', med9: '', med10: '',
};

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-foreground">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function SelectField({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder?: string }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9">
        <SelectValue placeholder={placeholder || 'Select...'} />
      </SelectTrigger>
      <SelectContent>
        {options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

export default function ResidentOnboarding() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  const set = (field: keyof FormData, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = () => {
    if (!form.firstName || !form.lastName || !form.unitNo) {
      toast.error('Please fill in all required fields before submitting.');
      return;
    }
    setSubmitted(true);
    toast.success('Resident information submitted successfully!');
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <img src={LOGO_URL} alt="Barrina Gardens" className="h-20 mx-auto object-contain" />
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: 'oklch(0.48 0.12 145 / 0.1)' }}>
            <CheckCircle size={32} style={{ color: 'oklch(0.48 0.12 145)' }} />
          </div>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Thank You!</h2>
          <p className="text-muted-foreground">Your information has been submitted to the Barrina Gardens team. We will be in touch shortly.</p>
          <p className="text-sm text-muted-foreground">If you have any questions, please contact us at <strong>(03) 9877 1200</strong></p>
          <button onClick={() => { setSubmitted(false); setForm(EMPTY); setStep(1); }}
            className="text-sm text-muted-foreground underline">Submit another response</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden mb-4">
          <div className="px-6 py-4 flex items-center gap-4" style={{ background: 'oklch(0.48 0.12 145)' }}>
            <img src={LOGO_URL} alt="Barrina Gardens" className="h-12 object-contain" />
            <div>
              <h1 className="text-lg font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Resident Information Form</h1>
              <p className="text-white/80 text-xs">Barrina Gardens Retirement Village — Welcome Home</p>
            </div>
          </div>
          <div className="px-6 py-3 bg-amber-50 border-b border-amber-100">
            <p className="text-xs text-amber-700">Fields marked with <span className="text-red-500 font-bold">*</span> are required. All other fields are optional but help us serve you better.</p>
          </div>
        </div>

        {/* Step Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-border p-4 mb-4">
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === s.id ? 'text-white' : step > s.id ? 'text-white' : 'text-muted-foreground bg-muted'}`}
                    style={step >= s.id ? { background: 'oklch(0.48 0.12 145)' } : {}}>
                    {step > s.id ? <CheckCircle size={14} /> : s.id}
                  </div>
                  <p className={`text-[10px] mt-1 text-center leading-tight hidden sm:block ${step === s.id ? 'font-semibold' : 'text-muted-foreground'}`}>{s.title}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="h-0.5 flex-1 mx-1 rounded" style={{ background: step > s.id ? 'oklch(0.48 0.12 145)' : 'var(--border)' }} />
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">Step {step} of {STEPS.length}: {STEPS[step - 1].title}</p>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-4">
          {step === 1 && (
            <>
              <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Personal Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Title" required>
                  <SelectField value={form.title} onChange={v => set('title', v)} options={['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Prof', 'Rev']} />
                </Field>
                <Field label="Gender" required>
                  <SelectField value={form.gender} onChange={v => set('gender', v)} options={['Male', 'Female', 'Non-binary', 'Prefer not to say']} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="First Name" required>
                  <Input value={form.firstName} onChange={e => set('firstName', e.target.value)} className="h-9" />
                </Field>
                <Field label="Last Name" required>
                  <Input value={form.lastName} onChange={e => set('lastName', e.target.value)} className="h-9" />
                </Field>
              </div>
              <Field label="Preferred Name (if different)">
                <Input value={form.preferredName} onChange={e => set('preferredName', e.target.value)} className="h-9" placeholder="e.g. Liz, Bob" />
              </Field>
              <Field label="Date of Birth" required>
                <Input type="date" value={form.dob} onChange={e => set('dob', e.target.value)} className="h-9" />
              </Field>
              <Field label="Email Address">
                <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="h-9" placeholder="If you don't use email, a trusted person's email is fine" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Mobile Number">
                  <Input type="tel" value={form.mobile} onChange={e => set('mobile', e.target.value)} className="h-9" />
                </Field>
                <Field label="Landline Number">
                  <Input type="tel" value={form.landline} onChange={e => set('landline', e.target.value)} className="h-9" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Unit Number" required>
                  <Input value={form.unitNo} onChange={e => set('unitNo', e.target.value)} className="h-9" placeholder="e.g. 15, 36B" />
                </Field>
                <Field label="Unit Type" required>
                  <SelectField value={form.unitType} onChange={v => set('unitType', v)} options={['1 Bedroom', '2 Bedroom', '2 Bedroom + Study', '3 Bedroom', 'Studio']} />
                </Field>
              </div>
              <Field label="Does someone else live in your unit?" required>
                <SelectField value={form.hasCoResident} onChange={v => set('hasCoResident', v)} options={['Yes', 'No']} />
              </Field>
              <Field label="Do you have a pet?" required>
                <SelectField value={form.hasPet} onChange={v => set('hasPet', v)} options={['Yes', 'No']} />
              </Field>
              {form.hasPet === 'Yes' && (
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Pet Type">
                    <Input value={form.petType} onChange={e => set('petType', e.target.value)} className="h-9" placeholder="e.g. Dog, Cat" />
                  </Field>
                  <Field label="Breed">
                    <Input value={form.petBreed} onChange={e => set('petBreed', e.target.value)} className="h-9" />
                  </Field>
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Emergency Contact 1</h2>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Title" required>
                  <SelectField value={form.ec1Title} onChange={v => set('ec1Title', v)} options={['Mr', 'Mrs', 'Ms', 'Miss', 'Dr']} />
                </Field>
                <Field label="First Name" required>
                  <Input value={form.ec1FirstName} onChange={e => set('ec1FirstName', e.target.value)} className="h-9" />
                </Field>
                <Field label="Last Name" required>
                  <Input value={form.ec1LastName} onChange={e => set('ec1LastName', e.target.value)} className="h-9" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Mobile" required>
                  <Input type="tel" value={form.ec1Mobile} onChange={e => set('ec1Mobile', e.target.value)} className="h-9" />
                </Field>
                <Field label="Landline">
                  <Input type="tel" value={form.ec1Landline} onChange={e => set('ec1Landline', e.target.value)} className="h-9" />
                </Field>
              </div>
              <Field label="Email">
                <Input type="email" value={form.ec1Email} onChange={e => set('ec1Email', e.target.value)} className="h-9" />
              </Field>
              <Field label="Relationship">
                <Input value={form.ec1Relationship} onChange={e => set('ec1Relationship', e.target.value)} className="h-9" placeholder="e.g. Daughter, Son, Friend" />
              </Field>
              <Field label="Address">
                <Input value={form.ec1Address} onChange={e => set('ec1Address', e.target.value)} className="h-9" />
              </Field>

              <div className="border-t border-border pt-4">
                <Field label="Do you want to provide a second emergency contact?" required>
                  <SelectField value={form.hasEc2} onChange={v => set('hasEc2', v)} options={['Yes', 'No']} />
                </Field>
              </div>

              {form.hasEc2 === 'Yes' && (
                <>
                  <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Emergency Contact 2</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <Field label="Title" required>
                      <SelectField value={form.ec2Title} onChange={v => set('ec2Title', v)} options={['Mr', 'Mrs', 'Ms', 'Miss', 'Dr']} />
                    </Field>
                    <Field label="First Name" required>
                      <Input value={form.ec2FirstName} onChange={e => set('ec2FirstName', e.target.value)} className="h-9" />
                    </Field>
                    <Field label="Last Name" required>
                      <Input value={form.ec2LastName} onChange={e => set('ec2LastName', e.target.value)} className="h-9" />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Mobile" required>
                      <Input type="tel" value={form.ec2Mobile} onChange={e => set('ec2Mobile', e.target.value)} className="h-9" />
                    </Field>
                    <Field label="Landline">
                      <Input type="tel" value={form.ec2Landline} onChange={e => set('ec2Landline', e.target.value)} className="h-9" />
                    </Field>
                  </div>
                  <Field label="Email">
                    <Input type="email" value={form.ec2Email} onChange={e => set('ec2Email', e.target.value)} className="h-9" />
                  </Field>
                  <Field label="Relationship">
                    <Input value={form.ec2Relationship} onChange={e => set('ec2Relationship', e.target.value)} className="h-9" />
                  </Field>
                  <Field label="Address">
                    <Input value={form.ec2Address} onChange={e => set('ec2Address', e.target.value)} className="h-9" />
                  </Field>
                </>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Doctor Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Doctor's Name">
                  <Input value={form.doctorName} onChange={e => set('doctorName', e.target.value)} className="h-9" />
                </Field>
                <Field label="Clinic / Practice Name">
                  <Input value={form.doctorClinic} onChange={e => set('doctorClinic', e.target.value)} className="h-9" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Doctor's Mobile">
                  <Input type="tel" value={form.doctorMobile} onChange={e => set('doctorMobile', e.target.value)} className="h-9" />
                </Field>
                <Field label="Doctor's Landline">
                  <Input type="tel" value={form.doctorLandline} onChange={e => set('doctorLandline', e.target.value)} className="h-9" />
                </Field>
              </div>
              <Field label="Doctor's Address">
                <Input value={form.doctorAddress} onChange={e => set('doctorAddress', e.target.value)} className="h-9" />
              </Field>

              <div className="border-t border-border pt-4">
                <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Lawyer Details</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Law Firm Name">
                  <Input value={form.lawyerFirm} onChange={e => set('lawyerFirm', e.target.value)} className="h-9" />
                </Field>
                <Field label="Lawyer's Name">
                  <Input value={form.lawyerName} onChange={e => set('lawyerName', e.target.value)} className="h-9" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Lawyer's Mobile">
                  <Input type="tel" value={form.lawyerMobile} onChange={e => set('lawyerMobile', e.target.value)} className="h-9" />
                </Field>
                <Field label="Lawyer's Landline">
                  <Input type="tel" value={form.lawyerLandline} onChange={e => set('lawyerLandline', e.target.value)} className="h-9" />
                </Field>
              </div>

              <div className="border-t border-border pt-4">
                <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Power of Attorney & Will</h2>
              </div>
              <Field label="Have you granted an Enduring Power of Attorney?">
                <SelectField value={form.hasPoa} onChange={v => set('hasPoa', v)} options={['Yes', 'No']} />
              </Field>
              {form.hasPoa === 'Yes' && (
                <>
                  <Field label="Who holds the original Power of Attorney?">
                    <Input value={form.poaHolder} onChange={e => set('poaHolder', e.target.value)} className="h-9" />
                  </Field>
                  <Field label="Attorney's Name">
                    <Input value={form.poaAttorney} onChange={e => set('poaAttorney', e.target.value)} className="h-9" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Attorney's Phone">
                      <Input type="tel" value={form.poaAttorneyPhone} onChange={e => set('poaAttorneyPhone', e.target.value)} className="h-9" />
                    </Field>
                    <Field label="Attorney's Email">
                      <Input type="email" value={form.poaAttorneyEmail} onChange={e => set('poaAttorneyEmail', e.target.value)} className="h-9" />
                    </Field>
                  </div>
                </>
              )}
              <Field label="Have you made a Will?">
                <SelectField value={form.hasWill} onChange={v => set('hasWill', v)} options={['Yes', 'No']} />
              </Field>
              {form.hasWill === 'Yes' && (
                <>
                  <Field label="Who holds the original Will?">
                    <Input value={form.willHolder} onChange={e => set('willHolder', e.target.value)} className="h-9" />
                  </Field>
                  <Field label="Executor's Name">
                    <Input value={form.willExecutor} onChange={e => set('willExecutor', e.target.value)} className="h-9" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Executor's Phone">
                      <Input type="tel" value={form.executorPhone} onChange={e => set('executorPhone', e.target.value)} className="h-9" />
                    </Field>
                    <Field label="Executor's Email">
                      <Input type="email" value={form.executorEmail} onChange={e => set('executorEmail', e.target.value)} className="h-9" />
                    </Field>
                  </div>
                </>
              )}
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Medical Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Medicare Number">
                  <Input value={form.medicare} onChange={e => set('medicare', e.target.value)} className="h-9" />
                </Field>
                <Field label="Ambulance Victoria Member No.">
                  <Input value={form.ambulance} onChange={e => set('ambulance', e.target.value)} className="h-9" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Private Health Fund">
                  <Input value={form.healthFund} onChange={e => set('healthFund', e.target.value)} className="h-9" placeholder="e.g. Medibank, BUPA" />
                </Field>
                <Field label="Health Fund Member No.">
                  <Input value={form.healthFundNo} onChange={e => set('healthFundNo', e.target.value)} className="h-9" />
                </Field>
              </div>
              <Field label="Medical Conditions">
                <textarea
                  value={form.medicalConditions}
                  onChange={e => set('medicalConditions', e.target.value)}
                  className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Please list any diagnosed medical conditions (e.g. diabetes, heart condition, dementia)"
                />
              </Field>
              <Field label="Allergies">
                <textarea
                  value={form.allergies}
                  onChange={e => set('allergies', e.target.value)}
                  className="w-full min-h-[60px] px-3 py-2 text-sm rounded-md border border-input bg-background resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="e.g. Penicillin, peanuts, latex, sulphur"
                />
              </Field>
            </>
          )}

          {step === 5 && (
            <>
              <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Medications</h2>
              <p className="text-sm text-muted-foreground">Please list all long-term medications and what condition they are for (e.g. "Metformin 500mg — Type 2 Diabetes")</p>
              <div className="space-y-3">
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <Field key={n} label={`Medication ${n}`}>
                    <Input
                      value={form[`med${n}` as keyof FormData]}
                      onChange={e => set(`med${n}` as keyof FormData, e.target.value)}
                      className="h-9"
                      placeholder="Medication name, dosage — condition"
                    />
                  </Field>
                ))}
              </div>
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 mt-2">
                <p className="text-xs text-green-700">
                  <strong>Almost done!</strong> Please review your information before submitting. You can go back to any step to make changes.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-white"
          >
            <ChevronLeft size={14} /> Back
          </button>
          <span className="text-xs text-muted-foreground">{step} / {STEPS.length}</span>
          {step < STEPS.length ? (
            <button
              onClick={() => setStep(s => Math.min(STEPS.length, s + 1))}
              className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg text-white transition-colors"
              style={{ background: 'oklch(0.48 0.12 145)' }}
            >
              Next <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-5 py-2 text-sm rounded-lg text-white font-medium transition-colors"
              style={{ background: 'oklch(0.48 0.12 145)' }}
            >
              <CheckCircle size={14} /> Submit
            </button>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4 pb-8">
          Barrina Gardens Retirement Village · 26 Barrina Street, Blackburn South VIC 3130 · (03) 9877 1200
        </p>
      </div>
    </div>
  );
}
