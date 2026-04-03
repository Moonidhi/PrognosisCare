export const contractHospitals = [
  { id: 'hosp-2', name: 'Fortis Hospital' },
  { id: 'hosp-1', name: 'CityCare Multi-Speciality Hospital' },
  { id: 'hosp-3', name: 'Max Hospital' },
];

export const contractDepartments = [
  'Pulmonology',
  'Endocrinology',
  'Oncology',
  'Dermatology',
  'Pathology',
  'ENT',
  'Nutrients & Dietetics',
  'Neurology',
  'General Medicine',
  'Cardiology',
];

const femaleFirstNames = new Set([
  'Kavya', 'Ritu', 'Anjali', 'Neha', 'Rohini', 'Meera', 'Shreya', 'Anitha', 'Divya', 'Sneha',
  'Riya', 'Pooja', 'Nisha', 'Priya', 'Deepika', 'Reena', 'Farah', 'Kavita', 'Ananya', 'Lakshmi',
  'Sana', 'Nandini', 'Sonia', 'Aditi', 'Meenakshi', 'Anita',
]);

function extractFirstName(fullName) {
  return fullName.replace(/^Dr\.\s*/i, '').trim().split(/\s+/)[0] || '';
}

function inferGenderFromName(fullName) {
  const firstName = extractFirstName(fullName);
  return femaleFirstNames.has(firstName) ? 'Female' : 'Male';
}

function createUniqueProfileImage(gender, hospitalIdx, deptIdx, doctorIdx) {
  const uniqueNumber = hospitalIdx * 100 + deptIdx * 10 + doctorIdx + 101;
  const randomUserIndex = uniqueNumber % 100;
  if (gender === 'Female') {
    return `https://randomuser.me/api/portraits/women/${randomUserIndex}.jpg`;
  }
  return `https://randomuser.me/api/portraits/men/${randomUserIndex}.jpg`;
}

const departmentExpansionPool = {
  Pulmonology: [
    ['Dr. Nikhil Batra', 11, 'MD Pulmonary Medicine', 'Chronic cough and airway disease', '9 AM–1 PM', ['Hindi', 'English']],
    ['Dr. Tara Srinivasan', 10, 'DNB Respiratory Medicine', 'Interstitial lung disease', '10 AM–2 PM', ['English', 'Tamil']],
    ['Dr. Omkar Deshpande', 9, 'FCCP Pulmonology', 'Bronchoscopy', '11 AM–3 PM', ['Marathi', 'English']],
    ['Dr. Priya Talwar', 8, 'MD Tuberculosis & Chest', 'Tuberculosis management', '2 PM–6 PM', ['Hindi', 'English']],
    ['Dr. Sandeep Kamat', 13, 'DM Pulmonary Critical Care', 'ICU respiratory care', '9 AM–3 PM', ['English', 'Kannada']],
    ['Dr. Leena Joseph', 7, 'Respiratory Fellowship', 'Pediatric asthma', '12 PM–5 PM', ['Malayalam', 'English']],
    ['Dr. Hitesh Arora', 12, 'MD Pulmonary Medicine', 'Allergic airway disorders', '1 PM–6 PM', ['Hindi', 'English']],
    ['Dr. Rina Das', 9, 'DNB Chest Medicine', 'Pulmonary rehabilitation', '10 AM–4 PM', ['Bengali', 'English']],
  ],
  Endocrinology: [
    ['Dr. Kavita Bansal', 12, 'DM Endocrinology', 'Type 1 diabetes care', '9 AM–1 PM', ['Hindi', 'English']],
    ['Dr. Aditya Menon', 10, 'Endocrine Fellowship', 'Metabolic syndrome', '10 AM–2 PM', ['Malayalam', 'English']],
    ['Dr. Nisha Rao', 9, 'DM Endocrinology', 'PCOS and hormonal disorders', '11 AM–3 PM', ['English', 'Kannada']],
    ['Dr. Rohan Malviya', 8, 'MD Medicine DM Endo', 'Bone and calcium disorders', '2 PM–6 PM', ['Hindi', 'English']],
    ['Dr. Simran Oberoi', 13, 'DM Endocrinology', 'Gestational diabetes', '9 AM–3 PM', ['Hindi', 'English']],
    ['Dr. Vivek Patil', 11, 'DNB Endocrinology', 'Insulin optimization', '12 PM–5 PM', ['Marathi', 'English']],
    ['Dr. Asha Narayanan', 9, 'Endocrine Specialist', 'Adrenal disorders', '1 PM–6 PM', ['Tamil', 'English']],
    ['Dr. Kunal Suri', 10, 'DM Endocrinology', 'Pituitary disorders', '10 AM–4 PM', ['Hindi', 'English']],
  ],
  Oncology: [
    ['Dr. Pooja Rajan', 11, 'DM Medical Oncology', 'Targeted therapy', '9 AM–1 PM', ['English', 'Hindi']],
    ['Dr. Harsh Vohra', 10, 'MD Oncology', 'Head and neck cancers', '10 AM–2 PM', ['Hindi', 'English']],
    ['Dr. Neelima Paul', 9, 'Clinical Oncology Fellowship', 'Immunotherapy', '11 AM–3 PM', ['English', 'Bengali']],
    ['Dr. Ritesh Dutta', 8, 'Medical Oncology', 'GI oncology', '2 PM–6 PM', ['Hindi', 'English']],
    ['Dr. Sana Qureshi', 13, 'DM Oncology', 'Lung cancer care', '9 AM–3 PM', ['Urdu', 'English']],
    ['Dr. Arun Bhardwaj', 12, 'Onco Medicine', 'Lymphoma treatment', '12 PM–5 PM', ['Hindi', 'English']],
    ['Dr. Megha Iqbal', 10, 'Breast Oncology Fellowship', 'Breast oncology', '1 PM–6 PM', ['English', 'Hindi']],
    ['Dr. Tejas Kulkarni', 9, 'DM Medical Oncology', 'Precision oncology', '10 AM–4 PM', ['Marathi', 'English']],
  ],
  Dermatology: [
    ['Dr. Ishita Verma', 11, 'MD Dermatology', 'Pigmentation disorders', '9 AM–1 PM', ['Hindi', 'English']],
    ['Dr. Ashwin Nair', 10, 'Clinical Dermatology', 'Hair loss treatment', '10 AM–2 PM', ['Malayalam', 'English']],
    ['Dr. Rupal Shah', 9, 'Dermatology Fellowship', 'Atopic dermatitis', '11 AM–3 PM', ['Gujarati', 'English']],
    ['Dr. Naman Joshi', 8, 'MD Skin & VD', 'Fungal infections', '2 PM–6 PM', ['Hindi', 'English']],
    ['Dr. Preeti Kaul', 13, 'Cosmetic Dermatology', 'Anti-aging treatments', '9 AM–3 PM', ['English', 'Hindi']],
    ['Dr. Sagar Rao', 12, 'Dermatology Specialist', 'Psoriasis care', '12 PM–5 PM', ['English', 'Kannada']],
    ['Dr. Esha Mathew', 10, 'MD Dermatology', 'Sensitive skin disorders', '1 PM–6 PM', ['English', 'Malayalam']],
    ['Dr. Tushar Goyal', 9, 'Dermatology & Cosmetology', 'Acne scars', '10 AM–4 PM', ['Hindi', 'English']],
  ],
  Pathology: [
    ['Dr. Charu Bedi', 11, 'MD Pathology', 'Cytopathology', '9 AM–1 PM', ['Hindi', 'English']],
    ['Dr. Gaurav Nanda', 10, 'Clinical Pathology', 'Hematology diagnostics', '10 AM–2 PM', ['Hindi', 'English']],
    ['Dr. Priyanka Sen', 9, 'MD Lab Medicine', 'Microbiology correlation', '11 AM–3 PM', ['Bengali', 'English']],
    ['Dr. Nishant Rawat', 8, 'Pathology Specialist', 'Biopsy reporting', '2 PM–6 PM', ['Hindi', 'English']],
    ['Dr. Neetu Bahl', 13, 'Histopathology Fellowship', 'Onco-pathology', '9 AM–3 PM', ['English', 'Hindi']],
    ['Dr. Amitesh Pillai', 12, 'MD Pathology', 'Clinical biochemistry', '12 PM–5 PM', ['English', 'Malayalam']],
    ['Dr. Samiksha Kale', 10, 'Clinical Laboratory Sciences', 'Endocrine assay interpretation', '1 PM–6 PM', ['Marathi', 'English']],
    ['Dr. Rohan Jindal', 9, 'Pathology Consultant', 'Autoimmune panel interpretation', '10 AM–4 PM', ['Hindi', 'English']],
  ],
  ENT: [
    ['Dr. Vinay Kaushik', 11, 'MS ENT', 'Nasal polyps and sinusitis', '9 AM–1 PM', ['Hindi', 'English']],
    ['Dr. Deepa Mathew', 10, 'ENT Fellowship', 'Vertigo and balance disorders', '10 AM–2 PM', ['Malayalam', 'English']],
    ['Dr. Sharad Kulkarni', 9, 'DNB Otorhinolaryngology', 'Voice and throat disorders', '11 AM–3 PM', ['Marathi', 'English']],
    ['Dr. Nupur Gandhi', 8, 'ENT Specialist', 'Ear infections', '2 PM–6 PM', ['Hindi', 'English']],
    ['Dr. Hemant Arora', 13, 'Head & Neck ENT', 'Nasal endoscopy', '9 AM–3 PM', ['Hindi', 'English']],
    ['Dr. Reema Nair', 12, 'ENT Surgeon', 'Tympanoplasty', '12 PM–5 PM', ['English', 'Malayalam']],
    ['Dr. Prakash Iyer', 10, 'MS ENT', 'Tinnitus care', '1 PM–6 PM', ['Tamil', 'English']],
    ['Dr. Sanya Choudhary', 9, 'ENT Consultant', 'Allergic rhinitis', '10 AM–4 PM', ['Hindi', 'English']],
  ],
  'Nutrients & Dietetics': [
    ['Dr. Kiran Sethi', 11, 'MSc Clinical Nutrition', 'Sports nutrition', '9 AM–1 PM', ['Hindi', 'English']],
    ['Dr. Namrata Bose', 10, 'Dietetics Fellowship', 'Renal diet plans', '10 AM–2 PM', ['Bengali', 'English']],
    ['Dr. Rhea Nambiar', 9, 'Clinical Dietetics', 'PCOS diet planning', '11 AM–3 PM', ['English', 'Malayalam']],
    ['Dr. Jatin Sehgal', 8, 'Nutrition Sciences', 'Pediatric nutrition', '2 PM–6 PM', ['Hindi', 'English']],
    ['Dr. Pallavi Rao', 13, 'MSc Nutrition', 'Cardiac diet protocols', '9 AM–3 PM', ['Kannada', 'English']],
    ['Dr. Deepali Arora', 12, 'Registered Dietitian', 'Weight management', '12 PM–5 PM', ['Hindi', 'English']],
    ['Dr. Arvind Krishnan', 10, 'Clinical Nutrition', 'Metabolic nutrition', '1 PM–6 PM', ['Tamil', 'English']],
    ['Dr. Swati Bhatia', 9, 'Dietetic Practice', 'Diabetes meal planning', '10 AM–4 PM', ['Hindi', 'English']],
  ],
  Neurology: [
    ['Dr. Taranjeet Singh', 11, 'DM Neurology', 'Epilepsy management', '9 AM–1 PM', ['Hindi', 'English']],
    ['Dr. Lakshmi Menon', 10, 'Neuro Fellowship', 'Parkinsonism', '10 AM–2 PM', ['Malayalam', 'English']],
    ['Dr. Nitin Purohit', 9, 'DM Neurology', 'Peripheral neuropathy', '11 AM–3 PM', ['Hindi', 'English']],
    ['Dr. Vaishali Rao', 8, 'Neurology Specialist', 'Vertigo neurology', '2 PM–6 PM', ['Kannada', 'English']],
    ['Dr. Pankaj Sood', 13, 'Neuro Medicine', 'Stroke prevention', '9 AM–3 PM', ['Hindi', 'English']],
    ['Dr. Irene Joseph', 12, 'Clinical Neurology', 'Demyelinating disorders', '12 PM–5 PM', ['English', 'Malayalam']],
    ['Dr. Bhavesh Trivedi', 10, 'DM Neurology', 'Cognitive disorders', '1 PM–6 PM', ['Gujarati', 'English']],
    ['Dr. Rachita Malhotra', 9, 'Neuro Consultant', 'Headache disorders', '10 AM–4 PM', ['Hindi', 'English']],
  ],
  'General Medicine': [
    ['Dr. Saurabh Tyagi', 11, 'MD Internal Medicine', 'Hypertension and fever', '9 AM–1 PM', ['Hindi', 'English']],
    ['Dr. Aditi Nair', 10, 'General Medicine', 'Preventive medicine', '10 AM–2 PM', ['Malayalam', 'English']],
    ['Dr. Kartik Bahl', 9, 'MD Medicine', 'Infectious disease triage', '11 AM–3 PM', ['Hindi', 'English']],
    ['Dr. Pooja Nanda', 8, 'Internal Medicine', 'Metabolic disorders', '2 PM–6 PM', ['Hindi', 'English']],
    ['Dr. Mitesh Shah', 13, 'MD General Medicine', 'Comorbidity management', '9 AM–3 PM', ['Gujarati', 'English']],
    ['Dr. Lincy Thomas', 12, 'General Physician', 'Senior citizen care', '12 PM–5 PM', ['English', 'Malayalam']],
    ['Dr. Rohit Saxena', 10, 'Internal Medicine', 'Acute care medicine', '1 PM–6 PM', ['Hindi', 'English']],
    ['Dr. Niharika Iyer', 9, 'Lifestyle Medicine', 'Chronic disease prevention', '10 AM–4 PM', ['Tamil', 'English']],
  ],
  Cardiology: [
    ['Dr. Nikhil Arora', 11, 'DM Cardiology', 'Hypertension and ECG', '9 AM–1 PM', ['Hindi', 'English']],
    ['Dr. Rina Mathew', 10, 'Clinical Cardiology', 'Heart failure care', '10 AM–2 PM', ['English', 'Malayalam']],
    ['Dr. Sumit Khurana', 9, 'Interventional Cardiology', 'Coronary risk evaluation', '11 AM–3 PM', ['Hindi', 'English']],
    ['Dr. Apeksha Nene', 8, 'DNB Cardiology', 'Preventive cardiology', '2 PM–6 PM', ['Marathi', 'English']],
    ['Dr. Pranav Ghosh', 13, 'DM Cardiology', 'Arrhythmia management', '9 AM–3 PM', ['Bengali', 'English']],
    ['Dr. Roshni Patel', 12, 'Cardiac Imaging', 'Echo diagnostics', '12 PM–5 PM', ['Gujarati', 'English']],
    ['Dr. Adarsh Nair', 10, 'Clinical Cardiology', 'Post-MI rehabilitation', '1 PM–6 PM', ['English', 'Malayalam']],
    ['Dr. Kaviraj Sen', 9, 'Cardiology Specialist', 'Lipid and heart risk clinic', '10 AM–4 PM', ['Hindi', 'English']],
  ],
};

function ensureDepartmentRoster(entries, department) {
  const pool = departmentExpansionPool[department] ?? [];
  if (entries.length >= 10) return entries;

  const missing = 10 - entries.length;
  return [...entries, ...pool.slice(0, missing)];
}

function normalizeToFullRoster(doctorsByHospital) {
  return Object.fromEntries(
    Object.entries(doctorsByHospital).map(([hospitalName, departments]) => [
      hospitalName,
      Object.fromEntries(
        contractDepartments.map((department) => {
          const entries = departments[department] ?? [];
          return [department, ensureDepartmentRoster(entries, department)];
        })
      ),
    ])
  );
}

const sourceDoctors = {
  'Fortis Hospital': {
    Pulmonology: [
      ['Dr. Arjun Mehta', 12, 'MD Pulmonology AIIMS', 'Asthma & COPD', '9 AM–1 PM', ['English', 'Hindi'], 'Mon–Fri'],
      ['Dr. Kavya Iyer', 8, 'DNB Respiratory Medicine', 'Sleep Apnea', '2 PM–6 PM', ['English', 'Tamil'], 'Tue–Sat'],
      ['Dr. Rohit Sharma', 15, 'MD Chest Medicine', 'Lung Infection', '10 AM–4 PM', ['Hindi', 'English'], 'Mon–Thu'],
      ['Dr. Nisha Patel', 6, 'Fellowship Pulmonary Care', 'Allergy Lung', '9 AM–2 PM', ['English', 'Gujarati'], 'Mon–Sat'],
      ['Dr. Vikram Singh', 18, 'MD Pulmonology', 'Interstitial Lung Disease', '3 PM–7 PM', ['Hindi', 'English'], 'Tue–Sun'],
      ['Dr. Sneha Reddy', 10, 'DM Pulmonary Medicine', 'Bronchoscopy', '8 AM–12 PM', ['English', 'Telugu'], 'Mon–Fri'],
      ['Dr. Karan Verma', 9, 'MD Respiratory', 'Tuberculosis', '1 PM–5 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Farhan Khan', 14, 'DNB Pulmonology', 'Critical Care', '10 AM–3 PM', ['Urdu', 'English'], 'Tue–Sun'],
      ['Dr. Priya Nair', 7, 'MD Chest', 'Pediatric Pulmonary', '9 AM–1 PM', ['English', 'Malayalam'], 'Mon–Fri'],
      ['Dr. Aditya Bose', 11, 'Lung Rehab Fellowship', 'Smoking Disorders', '2 PM–6 PM', ['Bengali', 'English'], 'Wed–Sun'],
    ],
    Endocrinology: [
      ['Dr. Ritu Agarwal', 13, 'DM Endocrinology', 'Diabetes', '9 AM–1 PM', ['English', 'Hindi'], 'Mon–Fri'],
      ['Dr. Manoj Kulkarni', 17, 'MD Medicine DM Endo', 'Thyroid', '2 PM–7 PM', ['Marathi', 'English'], 'Tue–Sun'],
      ['Dr. Pooja Nair', 8, 'Fellowship Diabetes', 'PCOS', '10 AM–2 PM', ['English', 'Malayalam'], 'Mon–Sat'],
      ['Dr. Neeraj Jain', 11, 'DM Endocrinology', 'Hormone Disorders', '3 PM–6 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Lakshmi Narayanan', 15, 'MD Endocrine', 'Metabolic Syndrome', '9 AM–12 PM', ['Tamil', 'English'], 'Tue–Sun'],
      ['Dr. Mehul Shah', 9, 'DNB Endocrine', 'Obesity', '1 PM–5 PM', ['Gujarati', 'English'], 'Mon–Sat'],
      ['Dr. Sana Sheikh', 6, 'Endocrine Fellowship', 'Adrenal Disorders', '10 AM–3 PM', ['Urdu', 'English'], 'Mon–Fri'],
      ['Dr. Rahul Bansal', 14, 'DM Endocrinology', 'Osteoporosis', '8 AM–12 PM', ['Hindi', 'English'], 'Tue–Sat'],
      ['Dr. Ananya Chatterjee', 7, 'MD Medicine', 'Thyroid Cancer', '2 PM–6 PM', ['Bengali', 'English'], 'Mon–Fri'],
      ['Dr. Deepak Verghese', 12, 'DM Endocrine', 'Pituitary Disorders', '11 AM–4 PM', ['English', 'Malayalam'], 'Wed–Sun'],
    ],
    Oncology: [
      ['Dr. Vivek Sinha', 20, 'DM Medical Oncology', 'Chemotherapy', '9 AM–3 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Anjali Kapoor', 14, 'MD Oncology', 'Breast Cancer', '2 PM–6 PM', ['English', 'Hindi'], 'Tue–Sat'],
      ['Dr. Rajeev Menon', 18, 'DM Oncology', 'Lung Cancer', '10 AM–4 PM', ['English', 'Malayalam'], 'Mon–Thu'],
      ['Dr. Shalini Gupta', 9, 'Clinical Oncology', 'Pediatric Cancer', '9 AM–1 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Harish Pillai', 16, 'Surgical Oncology', 'Tumor Surgery', '1 PM–5 PM', ['English', 'Malayalam'], 'Tue–Sun'],
      ['Dr. Snehal Desai', 12, 'MD Oncology', 'Radiotherapy', '3 PM–7 PM', ['Gujarati', 'English'], 'Mon–Fri'],
      ['Dr. Farah Ahmed', 7, 'Oncology Fellowship', 'Blood Cancer', '8 AM–12 PM', ['Urdu', 'English'], 'Tue–Sat'],
      ['Dr. Prakash Iyer', 15, 'DM Oncology', 'GI Cancer', '10 AM–3 PM', ['Tamil', 'English'], 'Mon–Fri'],
      ['Dr. Nikhil Arora', 11, 'MD Oncology', 'Immunotherapy', '2 PM–6 PM', ['Hindi', 'English'], 'Wed–Sun'],
      ['Dr. Kavita Rao', 13, 'Clinical Oncology', 'Palliative Care', '9 AM–2 PM', ['English', 'Kannada'], 'Mon–Sat'],
    ],
    Dermatology: [
      ['Dr. Neha Sharma', 10, 'MD Dermatology', 'Acne', '9 AM–1 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Rohini Krishnan', 8, 'Cosmetic Dermatology', 'Laser', '2 PM–6 PM', ['English', 'Tamil'], 'Tue–Sun'],
      ['Dr. Amit Jain', 15, 'Skin Specialist', 'Psoriasis', '10 AM–4 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Sana Ali', 6, 'Aesthetic Skin', 'Anti Aging', '9 AM–2 PM', ['Urdu', 'English'], 'Mon–Sat'],
      ['Dr. Varun Mehta', 12, 'Dermatologic Surgery', 'Mole Removal', '3 PM–7 PM', ['English', 'Hindi'], 'Tue–Sun'],
      ['Dr. Priyanka Nair', 9, 'MD Dermatology', 'Hair Loss', '8 AM–12 PM', ['English', 'Malayalam'], 'Mon–Fri'],
      ['Dr. Tarun Bansal', 11, 'Clinical Dermatology', 'Eczema', '1 PM–5 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Divya Iyer', 7, 'Cosmetic Dermatology', 'Chemical Peels', '10 AM–3 PM', ['English', 'Tamil'], 'Tue–Fri'],
      ['Dr. Sameer Khan', 14, 'Skin Allergy', 'Dermatitis', '2 PM–6 PM', ['Urdu', 'English'], 'Mon–Sat'],
      ['Dr. Aditi Bose', 5, 'MD Dermatology', 'Pediatric Skin', '9 AM–1 PM', ['Bengali', 'English'], 'Mon–Fri'],
    ],
    Pathology: [
      ['Dr. Ramesh Gupta', 22, 'MD Pathology', 'Histopathology', '9 AM–3 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Shweta Iyer', 12, 'Clinical Pathology', 'Blood Tests', '10 AM–4 PM', ['English', 'Tamil'], 'Mon–Sat'],
      ['Dr. Akash Verma', 9, 'Cytopathology', 'FNAC', '8 AM–1 PM', ['Hindi', 'English'], 'Tue–Sat'],
      ['Dr. Pankaj Sharma', 16, 'Lab Medicine', 'Microbiology', '2 PM–6 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Nandini Pillai', 11, 'Molecular Pathology', 'Genetic Testing', '9 AM–2 PM', ['Malayalam', 'English'], 'Mon–Sat'],
      ['Dr. Imran Sheikh', 7, 'Clinical Biochemistry', 'Hormone Assay', '10 AM–3 PM', ['Urdu', 'English'], 'Tue–Sun'],
      ['Dr. Arvind Menon', 18, 'Hematopathology', 'Blood Disorders', '1 PM–5 PM', ['English', 'Malayalam'], 'Mon–Fri'],
      ['Dr. Kavita Desai', 13, 'Surgical Pathology', 'Tissue Diagnosis', '8 AM–12 PM', ['Gujarati', 'English'], 'Mon–Sat'],
      ['Dr. Rahul Nair', 6, 'Lab Diagnostics', 'Infection Screening', '9 AM–1 PM', ['English', 'Malayalam'], 'Tue–Sun'],
      ['Dr. Sonia Kapoor', 10, 'Clinical Pathology', 'Routine Tests', '2 PM–6 PM', ['Hindi', 'English'], 'Mon–Sat'],
    ],
    ENT: [
      ['Dr. Ajay Singh', 18, 'MS ENT', 'Sinus Surgery', '9 AM–1 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Meera Nair', 10, 'ENT', 'Hearing Loss', '2 PM–6 PM', ['English', 'Malayalam'], 'Mon–Sat'],
      ['Dr. Karthik Iyer', 12, 'MS ENT', 'Voice Disorders', '10 AM–4 PM', ['Tamil', 'English'], 'Tue–Sun'],
      ['Dr. Ritu Sharma', 8, 'ENT', 'Tonsillitis', '9 AM–2 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Farhan Ali', 14, 'ENT Surgery', 'Nasal Polyps', '3 PM–7 PM', ['Urdu', 'English'], 'Tue–Sun'],
      ['Dr. Sneha Reddy', 9, 'Pediatric ENT', 'Ear Infection', '8 AM–12 PM', ['Telugu', 'English'], 'Mon–Fri'],
      ['Dr. Vikrant Kapoor', 11, 'ENT', 'Vertigo', '1 PM–5 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Anil Menon', 15, 'Head Neck Surgery', 'Tumor Removal', '10 AM–3 PM', ['Malayalam', 'English'], 'Mon–Fri'],
      ['Dr. Pooja Desai', 6, 'ENT', 'Allergy', '2 PM–6 PM', ['Gujarati', 'English'], 'Tue–Sat'],
      ['Dr. Rajesh Pillai', 17, 'ENT', 'Cochlear Implant', '9 AM–1 PM', ['English', 'Malayalam'], 'Mon–Fri'],
    ],
    'Nutrients & Dietetics': [
      ['Dr. Shreya Kapoor', 9, 'MSc Nutrition', 'Weight Loss', '9 AM–1 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Anitha Reddy', 12, 'Dietetics', 'Diabetes Diet', '2 PM–6 PM', ['Telugu', 'English'], 'Mon–Fri'],
      ['Dr. Rahul Shah', 8, 'Nutrition Science', 'Sports Nutrition', '10 AM–3 PM', ['Gujarati', 'English'], 'Mon–Sat'],
      ['Dr. Meenakshi Iyer', 15, 'Clinical Nutrition', 'Thyroid Diet', '9 AM–2 PM', ['Tamil', 'English'], 'Mon–Fri'],
      ['Dr. Farah Khan', 6, 'Diet Planning', 'Pregnancy Diet', '1 PM–5 PM', ['Urdu', 'English'], 'Tue–Sun'],
      ['Dr. Vivek Menon', 10, 'Nutrition Therapy', 'Cardiac Diet', '8 AM–12 PM', ['Malayalam', 'English'], 'Mon–Sat'],
      ['Dr. Pooja Verma', 7, 'Weight Management', 'Obesity', '2 PM–6 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Kavya Nair', 11, 'Pediatric Nutrition', 'Child Diet', '9 AM–1 PM', ['English', 'Malayalam'], 'Mon–Sat'],
      ['Dr. Aman Bansal', 5, 'Lifestyle Nutrition', 'Detox', '3 PM–7 PM', ['Hindi', 'English'], 'Tue–Sun'],
      ['Dr. Snehal Deshmukh', 13, 'Therapeutic Diet', 'Kidney Diet', '10 AM–4 PM', ['Marathi', 'English'], 'Mon–Fri'],
    ],
    Neurology: [
      ['Dr. Raghav Khanna', 16, 'DM Neurology', 'Stroke', '9 AM–1 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Divya Menon', 9, 'Neuro Specialist', 'Migraine', '2 PM–6 PM', ['Malayalam', 'English'], 'Mon–Sat'],
      ['Dr. Suresh Reddy', 14, 'DM Neuro', 'Epilepsy', '10 AM–4 PM', ['Telugu', 'English'], 'Tue–Sun'],
      ['Dr. Mehul Shah', 11, 'Neuro Disorders', 'Parkinson’s', '9 AM–2 PM', ['Gujarati', 'English'], 'Mon–Sat'],
      ['Dr. Ananya Roy', 7, 'Clinical Neuro', 'Neuropathy', '1 PM–5 PM', ['Bengali', 'English'], 'Mon–Fri'],
      ['Dr. Karthik Iyer', 13, 'Neuro Surgery', 'Brain Tumor', '8 AM–12 PM', ['Tamil', 'English'], 'Tue–Sat'],
      ['Dr. Farhan Khan', 10, 'Neuro Care', 'Alzheimer’s', '2 PM–6 PM', ['Urdu', 'English'], 'Mon–Fri'],
      ['Dr. Priya Nair', 12, 'DM Neuro', 'Multiple Sclerosis', '9 AM–1 PM', ['English', 'Malayalam'], 'Mon–Sat'],
      ['Dr. Vikram Singh', 18, 'Senior Neurologist', 'Spinal Disorders', '10 AM–3 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Neha Kapoor', 8, 'Neuro Medicine', 'Head Injury', '3 PM–7 PM', ['Hindi', 'English'], 'Tue–Sun'],
    ],
    'General Medicine': [
      ['Dr. Amit Verma', 15, 'MD Medicine', 'Fever & Infection', '9 AM–2 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Sneha Iyer', 9, 'MD General', 'Lifestyle Disease', '2 PM–6 PM', ['Tamil', 'English'], 'Mon–Fri'],
      ['Dr. Rahul Sharma', 12, 'Physician', 'Hypertension', '10 AM–4 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Kavita Nair', 8, 'General Medicine', 'Diabetes', '9 AM–1 PM', ['English', 'Malayalam'], 'Tue–Sun'],
      ['Dr. Mehul Shah', 11, 'Internal Medicine', 'Chronic Illness', '1 PM–5 PM', ['Gujarati', 'English'], 'Mon–Fri'],
      ['Dr. Sana Ali', 7, 'General Physician', 'Viral Fever', '2 PM–6 PM', ['Urdu', 'English'], 'Mon–Sat'],
      ['Dr. Arvind Menon', 14, 'MD Medicine', 'Preventive Care', '9 AM–3 PM', ['Malayalam', 'English'], 'Mon–Fri'],
      ['Dr. Pooja Kapoor', 6, 'Physician', 'Digestive Issues', '10 AM–2 PM', ['Hindi', 'English'], 'Tue–Sat'],
      ['Dr. Nikhil Bose', 10, 'Internal Medicine', 'Metabolic Disease', '8 AM–12 PM', ['Bengali', 'English'], 'Mon–Fri'],
      ['Dr. Ritu Jain', 13, 'MD Medicine', 'Immunity Disorders', '3 PM–7 PM', ['Hindi', 'English'], 'Mon–Sat'],
    ],
    Cardiology: [
      ['Dr. Vikram Malhotra', 20, 'DM Cardiology', 'Heart Attack', '9 AM–2 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Meera Pillai', 12, 'Cardiologist', 'ECG & Echo', '2 PM–6 PM', ['Malayalam', 'English'], 'Mon–Sat'],
      ['Dr. Rahul Jain', 10, 'Heart Specialist', 'Hypertension', '10 AM–4 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Arjun Menon', 15, 'Interventional Cardiology', 'Angioplasty', '9 AM–1 PM', ['English', 'Malayalam'], 'Tue–Sun'],
      ['Dr. Kavya Sharma', 8, 'Clinical Cardiology', 'Heart Failure', '1 PM–5 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Suresh Reddy', 14, 'DM Cardio', 'Arrhythmia', '8 AM–12 PM', ['Telugu', 'English'], 'Mon–Sat'],
      ['Dr. Mehul Shah', 11, 'Cardiac Care', 'Cholesterol', '2 PM–6 PM', ['Gujarati', 'English'], 'Tue–Sun'],
      ['Dr. Farhan Khan', 13, 'Heart Specialist', 'Valve Disease', '9 AM–3 PM', ['Urdu', 'English'], 'Mon–Fri'],
      ['Dr. Neha Kapoor', 7, 'Cardiologist', 'Preventive Heart Care', '10 AM–2 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Aditya Bose', 16, 'Senior Cardiologist', 'Cardiac Surgery Support', '3 PM–7 PM', ['Bengali', 'English'], 'Mon–Fri'],
    ],
  },
  'CityCare Multi-Speciality Hospital': {
    Pulmonology: [
      ['Dr. Raghav Verma', 14, 'MD Pulmonology', 'COPD', '9 AM–1 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Divya Iyer', 9, 'Respiratory Medicine', 'Asthma', '2 PM–6 PM', ['Tamil', 'English'], 'Tue–Sun'],
      ['Dr. Faisal Ahmed', 12, 'Lung Specialist', 'Bronchoscopy', '10 AM–4 PM', ['Urdu', 'English'], 'Mon–Fri'],
      ['Dr. Mehul Patel', 7, 'Pulmonary Care', 'TB', '9 AM–2 PM', ['Gujarati', 'English'], 'Mon–Sat'],
      ['Dr. Kavita Sharma', 15, 'Chest Medicine', 'ILD', '3 PM–7 PM', ['Hindi', 'English'], 'Tue–Sun'],
      ['Dr. Arvind Nair', 11, 'Pulmonary Rehab', 'Sleep Apnea', '8 AM–12 PM', ['Malayalam', 'English'], 'Mon–Fri'],
      ['Dr. Suresh Reddy', 18, 'DM Pulmonology', 'Lung Cancer', '1 PM–5 PM', ['Telugu', 'English'], 'Mon–Sat'],
      ['Dr. Pooja Verma', 6, 'Allergy Lung', 'Chronic Asthma', '10 AM–3 PM', ['Hindi', 'English'], 'Tue–Sun'],
      ['Dr. Nitin Bose', 10, 'Respiratory Medicine', 'Smoking Disorders', '9 AM–1 PM', ['Bengali', 'English'], 'Mon–Fri'],
      ['Dr. Anita Menon', 13, 'Pulmonary Medicine', 'Critical Care', '2 PM–6 PM', ['English', 'Malayalam'], 'Mon–Sat'],
    ],
    Endocrinology: [
      ['Dr. Rakesh Bansal', 19, 'DM Endocrinology', 'Diabetes', '9 AM–3 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Meera Pillai', 11, 'Thyroid Specialist', 'Thyroid Specialist', '2 PM–6 PM', ['Malayalam', 'English'], 'Tue–Sat'],
      ['Dr. Sana Sheikh', 8, 'Hormone Disorders', 'Hormone Disorders', '10 AM–2 PM', ['Urdu', 'English'], 'Mon–Sat'],
      ['Dr. Varun Mehta', 15, 'Metabolic Disorders', 'Metabolic Disorders', '1 PM–5 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Lakshmi Iyer', 12, 'PCOS', 'PCOS', '9 AM–1 PM', ['Tamil', 'English'], 'Mon–Sat'],
      ['Dr. Rahul Jain', 7, 'Osteoporosis', 'Osteoporosis', '2 PM–6 PM', ['Hindi', 'English'], 'Tue–Sun'],
      ['Dr. Neha Kapoor', 10, 'Thyroid Cancer', 'Thyroid Cancer', '10 AM–4 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Arjun Menon', 13, 'Pituitary Disorders', 'Pituitary Disorders', '9 AM–2 PM', ['Malayalam', 'English'], 'Mon–Sat'],
      ['Dr. Pankaj Shah', 6, 'Obesity', 'Obesity', '3 PM–7 PM', ['Gujarati', 'English'], 'Tue–Sun'],
      ['Dr. Ananya Roy', 9, 'Hormone Therapy', 'Hormone Therapy', '8 AM–12 PM', ['Bengali', 'English'], 'Mon–Fri'],
    ],
    Oncology: [
      ['Dr. Vikram Malhotra', 21, 'Medical Oncology', 'Chemotherapy', '9 AM–3 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Ritu Sharma', 14, 'Breast Cancer', 'Breast Cancer', '2 PM–6 PM', ['Hindi', 'English'], 'Tue–Sat'],
      ['Dr. Farhan Khan', 12, 'Lung Cancer', 'Lung Cancer', '10 AM–4 PM', ['Urdu', 'English'], 'Mon–Fri'],
      ['Dr. Priya Nair', 9, 'Pediatric Oncology', 'Pediatric Oncology', '9 AM–1 PM', ['English', 'Malayalam'], 'Mon–Sat'],
      ['Dr. Sameer Gupta', 18, 'Surgical Oncology', 'Surgical Oncology', '1 PM–5 PM', ['Hindi', 'English'], 'Tue–Sun'],
      ['Dr. Kavya Iyer', 10, 'Radiotherapy', 'Radiotherapy', '3 PM–7 PM', ['Tamil', 'English'], 'Mon–Fri'],
      ['Dr. Aditya Bose', 13, 'Blood Cancer', 'Blood Cancer', '8 AM–12 PM', ['Bengali', 'English'], 'Tue–Sat'],
      ['Dr. Snehal Desai', 8, 'Immunotherapy', 'Immunotherapy', '10 AM–3 PM', ['Gujarati', 'English'], 'Mon–Sat'],
      ['Dr. Rajeev Menon', 16, 'GI Cancer', 'GI Cancer', '2 PM–6 PM', ['Malayalam', 'English'], 'Mon–Fri'],
      ['Dr. Anjali Kapoor', 11, 'Palliative Care', 'Palliative Care', '9 AM–2 PM', ['Hindi', 'English'], 'Tue–Sun'],
    ],
    Dermatology: [
      ['Dr. Neha Jain', 9, 'MD Dermatology', 'Acne', '9 AM–1 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Rohit Sharma', 14, 'Psoriasis', 'Psoriasis', '10 AM–4 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Sana Ali', 7, 'Cosmetic Skin', 'Cosmetic Skin', '2 PM–6 PM', ['Urdu', 'English'], 'Mon–Sat'],
      ['Dr. Varun Kapoor', 12, 'Hair Loss', 'Hair Loss', '9 AM–2 PM', ['Hindi', 'English'], 'Tue–Sun'],
      ['Dr. Meera Nair', 10, 'Laser Therapy', 'Laser Therapy', '3 PM–7 PM', ['English', 'Malayalam'], 'Mon–Fri'],
      ['Dr. Karthik Iyer', 15, 'Skin Allergy', 'Skin Allergy', '8 AM–12 PM', ['Tamil', 'English'], 'Mon–Sat'],
      ['Dr. Pooja Shah', 6, 'Anti Aging', 'Anti Aging', '1 PM–5 PM', ['Gujarati', 'English'], 'Tue–Sun'],
      ['Dr. Aman Bansal', 11, 'Eczema', 'Eczema', '10 AM–3 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Kavita Rao', 8, 'Pediatric Skin', 'Pediatric Skin', '9 AM–1 PM', ['Kannada', 'English'], 'Mon–Fri'],
      ['Dr. Divya Menon', 13, 'Chemical Peels', 'Chemical Peels', '2 PM–6 PM', ['Malayalam', 'English'], 'Mon–Sat'],
    ],
    Pathology: [
      ['Dr. Ramesh Gupta', 20, 'Histopathology', 'Histopathology', '9 AM–3 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Shweta Iyer', 11, 'Blood Tests', 'Blood Tests', '10 AM–4 PM', ['Tamil', 'English'], 'Mon–Sat'],
      ['Dr. Akash Verma', 9, 'FNAC', 'FNAC', '8 AM–1 PM', ['Hindi', 'English'], 'Tue–Sat'],
      ['Dr. Pankaj Sharma', 16, 'Microbiology', 'Microbiology', '2 PM–6 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Nandini Pillai', 12, 'Molecular Testing', 'Molecular Testing', '9 AM–2 PM', ['Malayalam', 'English'], 'Mon–Sat'],
      ['Dr. Imran Sheikh', 7, 'Biochemistry', 'Biochemistry', '10 AM–3 PM', ['Urdu', 'English'], 'Tue–Sun'],
      ['Dr. Arvind Menon', 18, 'Hematology', 'Hematology', '1 PM–5 PM', ['Malayalam', 'English'], 'Mon–Fri'],
      ['Dr. Kavita Desai', 13, 'Tissue Diagnosis', 'Tissue Diagnosis', '8 AM–12 PM', ['Gujarati', 'English'], 'Mon–Sat'],
      ['Dr. Rahul Nair', 6, 'Lab Diagnostics', 'Lab Diagnostics', '9 AM–1 PM', ['English', 'Malayalam'], 'Tue–Sun'],
      ['Dr. Sonia Kapoor', 10, 'Clinical Lab', 'Clinical Lab', '2 PM–6 PM', ['Hindi', 'English'], 'Mon–Sat'],
    ],
    ENT: [
      ['Dr. Ajay Singh', 18, 'Sinus Surgery', 'Sinus Surgery', '9 AM–1 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Meera Nair', 10, 'Hearing Loss', 'Hearing Loss', '2 PM–6 PM', ['Malayalam', 'English'], 'Mon–Sat'],
      ['Dr. Karthik Iyer', 12, 'Voice Disorders', 'Voice Disorders', '10 AM–4 PM', ['Tamil', 'English'], 'Tue–Sun'],
      ['Dr. Ritu Sharma', 8, 'Tonsils', 'Tonsils', '9 AM–2 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Farhan Ali', 14, 'Nasal Polyps', 'Nasal Polyps', '3 PM–7 PM', ['Urdu', 'English'], 'Tue–Sun'],
      ['Dr. Sneha Reddy', 9, 'Pediatric ENT', 'Pediatric ENT', '8 AM–12 PM', ['Telugu', 'English'], 'Mon–Fri'],
      ['Dr. Vikrant Kapoor', 11, 'Vertigo', 'Vertigo', '1 PM–5 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Anil Menon', 15, 'Neck Surgery', 'Neck Surgery', '10 AM–3 PM', ['Malayalam', 'English'], 'Mon–Fri'],
      ['Dr. Pooja Desai', 6, 'Allergy ENT', 'Allergy ENT', '2 PM–6 PM', ['Gujarati', 'English'], 'Tue–Sat'],
      ['Dr. Rajesh Pillai', 17, 'Cochlear Implant', 'Cochlear Implant', '9 AM–1 PM', ['English', 'Malayalam'], 'Mon–Fri'],
    ],
    'Nutrients & Dietetics': [
      ['Dr. Shreya Kapoor', 9, 'Weight Loss', 'Weight Loss', '9 AM–1 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Anitha Reddy', 12, 'Diabetes Diet', 'Diabetes Diet', '2 PM–6 PM', ['Telugu', 'English'], 'Mon–Fri'],
      ['Dr. Rahul Shah', 8, 'Sports Nutrition', 'Sports Nutrition', '10 AM–3 PM', ['Gujarati', 'English'], 'Mon–Sat'],
      ['Dr. Meenakshi Iyer', 15, 'Thyroid Diet', 'Thyroid Diet', '9 AM–2 PM', ['Tamil', 'English'], 'Mon–Fri'],
      ['Dr. Farah Khan', 6, 'Pregnancy Diet', 'Pregnancy Diet', '1 PM–5 PM', ['Urdu', 'English'], 'Tue–Sun'],
      ['Dr. Vivek Menon', 10, 'Cardiac Diet', 'Cardiac Diet', '8 AM–12 PM', ['Malayalam', 'English'], 'Mon–Sat'],
      ['Dr. Pooja Verma', 7, 'Obesity', 'Obesity', '2 PM–6 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Kavya Nair', 11, 'Pediatric Diet', 'Pediatric Diet', '9 AM–1 PM', ['English', 'Malayalam'], 'Mon–Sat'],
      ['Dr. Aman Bansal', 5, 'Detox', 'Detox', '3 PM–7 PM', ['Hindi', 'English'], 'Tue–Sun'],
      ['Dr. Snehal Deshmukh', 13, 'Kidney Diet', 'Kidney Diet', '10 AM–4 PM', ['Marathi', 'English'], 'Mon–Fri'],
    ],
    Neurology: [
      ['Dr. Rajat Khanna', 16, 'Stroke Specialist', 'Stroke Specialist', '9 AM–1 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Divya Menon', 9, 'Migraine', 'Migraine', '2 PM–6 PM', ['Malayalam', 'English'], 'Mon–Sat'],
      ['Dr. Suresh Reddy', 14, 'Epilepsy', 'Epilepsy', '10 AM–4 PM', ['Telugu', 'English'], 'Tue–Sun'],
      ['Dr. Mehul Shah', 11, 'Parkinson’s', 'Parkinson’s', '9 AM–2 PM', ['Gujarati', 'English'], 'Mon–Sat'],
      ['Dr. Ananya Roy', 7, 'Neuropathy', 'Neuropathy', '1 PM–5 PM', ['Bengali', 'English'], 'Mon–Fri'],
      ['Dr. Karthik Iyer', 13, 'Brain Tumor', 'Brain Tumor', '8 AM–12 PM', ['Tamil', 'English'], 'Tue–Sat'],
      ['Dr. Farhan Khan', 10, 'Alzheimer’s', 'Alzheimer’s', '2 PM–6 PM', ['Urdu', 'English'], 'Mon–Fri'],
      ['Dr. Priya Nair', 12, 'Multiple Sclerosis', 'Multiple Sclerosis', '9 AM–1 PM', ['English', 'Malayalam'], 'Mon–Sat'],
      ['Dr. Vikram Singh', 18, 'Spinal Disorders', 'Spinal Disorders', '10 AM–3 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Neha Kapoor', 8, 'Head Injury', 'Head Injury', '3 PM–7 PM', ['Hindi', 'English'], 'Tue–Sun'],
    ],
    'General Medicine': [
      ['Dr. Amit Verma', 15, 'Fever', 'Fever', '9 AM–2 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Sneha Iyer', 9, 'Lifestyle Disease', 'Lifestyle Disease', '2 PM–6 PM', ['Tamil', 'English'], 'Mon–Fri'],
      ['Dr. Rahul Sharma', 12, 'Hypertension', 'Hypertension', '10 AM–4 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Kavita Nair', 8, 'Diabetes', 'Diabetes', '9 AM–1 PM', ['English', 'Malayalam'], 'Tue–Sun'],
      ['Dr. Mehul Shah', 11, 'Chronic Illness', 'Chronic Illness', '1 PM–5 PM', ['Gujarati', 'English'], 'Mon–Fri'],
      ['Dr. Sana Ali', 7, 'Viral Fever', 'Viral Fever', '2 PM–6 PM', ['Urdu', 'English'], 'Mon–Sat'],
      ['Dr. Arvind Menon', 14, 'Preventive Care', 'Preventive Care', '9 AM–3 PM', ['Malayalam', 'English'], 'Mon–Fri'],
      ['Dr. Pooja Kapoor', 6, 'Digestive Issues', 'Digestive Issues', '10 AM–2 PM', ['Hindi', 'English'], 'Tue–Sat'],
      ['Dr. Nikhil Bose', 10, 'Metabolic Disease', 'Metabolic Disease', '8 AM–12 PM', ['Bengali', 'English'], 'Mon–Fri'],
      ['Dr. Ritu Jain', 13, 'Immunity Disorders', 'Immunity Disorders', '3 PM–7 PM', ['Hindi', 'English'], 'Mon–Sat'],
    ],
    Cardiology: [
      ['Dr. Vikram Malhotra', 20, 'Heart Attack', 'Heart Attack', '9 AM–2 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Meera Pillai', 12, 'ECG', 'ECG', '2 PM–6 PM', ['Malayalam', 'English'], 'Mon–Sat'],
      ['Dr. Rahul Jain', 10, 'Hypertension', 'Hypertension', '10 AM–4 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Arjun Menon', 15, 'Angioplasty', 'Angioplasty', '9 AM–1 PM', ['English', 'Malayalam'], 'Tue–Sun'],
      ['Dr. Kavya Sharma', 8, 'Heart Failure', 'Heart Failure', '1 PM–5 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Suresh Reddy', 14, 'Arrhythmia', 'Arrhythmia', '8 AM–12 PM', ['Telugu', 'English'], 'Mon–Sat'],
      ['Dr. Mehul Shah', 11, 'Cholesterol', 'Cholesterol', '2 PM–6 PM', ['Gujarati', 'English'], 'Tue–Sun'],
      ['Dr. Farhan Khan', 13, 'Valve Disease', 'Valve Disease', '9 AM–3 PM', ['Urdu', 'English'], 'Mon–Fri'],
      ['Dr. Neha Kapoor', 7, 'Preventive Cardio', 'Preventive Cardio', '10 AM–2 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Aditya Bose', 16, 'Cardiac Surgery Support', 'Cardiac Surgery Support', '3 PM–7 PM', ['Bengali', 'English'], 'Mon–Fri'],
    ],
  },
  'Max Hospital': {
    Pulmonology: [
      ['Dr. Aman Khurana', 13, 'MD Pulmonology (AIIMS)', 'Asthma & airway inflammation', '9 AM–1 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Riya Menon', 7, 'DNB Respiratory Medicine', 'Sleep apnea & ventilation therapy', '2 PM–6 PM', ['Malayalam', 'English'], 'Tue–Sun'],
      ['Dr. Imran Khan', 16, 'MD Chest Medicine', 'COPD management', '10 AM–4 PM', ['Urdu', 'English'], 'Mon–Fri'],
      ['Dr. Kiran Patel', 9, 'Fellowship Pulmonary Care', 'Lung infections', '9 AM–2 PM', ['Gujarati', 'English'], 'Mon–Sat'],
      ['Dr. Harish Iyer', 12, 'DM Pulmonary Medicine', 'Bronchoscopy', '3 PM–7 PM', ['Tamil', 'English'], 'Tue–Sun'],
      ['Dr. Sneha Kapoor', 8, 'Pulmonary Rehabilitation Certification', 'Lung recovery therapy', '8 AM–12 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Ravi Nair', 14, 'MD Respiratory Medicine', 'Tuberculosis treatment', '1 PM–5 PM', ['Malayalam', 'English'], 'Mon–Sat'],
      ['Dr. Pawan Verma', 10, 'MD Pulmonology', 'Smoking-related disorders', '10 AM–3 PM', ['Hindi', 'English'], 'Tue–Sun'],
      ['Dr. Deepika Roy', 6, 'Pediatric Pulmonary Fellowship', 'Childhood lung disease', '9 AM–1 PM', ['Bengali', 'English'], 'Mon–Fri'],
      ['Dr. Joseph Mathew', 18, 'DM Critical Care Pulmonology', 'ICU respiratory support', '2 PM–6 PM', ['English', 'Malayalam'], 'Mon–Sat'],
    ],
    Endocrinology: [
      ['Dr. Mohit Agarwal', 17, 'DM Endocrinology', 'Diabetes management', '9 AM–3 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Reena Iyer', 11, 'MD Medicine + Endocrine Fellowship', 'Thyroid disorders', '2 PM–6 PM', ['Tamil', 'English'], 'Tue–Sat'],
      ['Dr. Farah Khan', 8, 'Clinical Endocrinology Fellowship', 'Hormonal imbalance', '10 AM–2 PM', ['Urdu', 'English'], 'Mon–Sat'],
      ['Dr. Anil Menon', 15, 'DM Metabolic Medicine', 'Metabolic syndrome', '1 PM–5 PM', ['Malayalam', 'English'], 'Mon–Fri'],
      ['Dr. Kavita Sharma', 12, 'Reproductive Endocrinology', 'PCOS', '9 AM–1 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Rahul Jain', 7, 'Endocrine Care Certification', 'Osteoporosis', '2 PM–6 PM', ['Hindi', 'English'], 'Tue–Sun'],
      ['Dr. Suresh Reddy', 10, 'DM Oncology Endocrine', 'Thyroid cancer', '10 AM–4 PM', ['Telugu', 'English'], 'Mon–Fri'],
      ['Dr. Mehul Shah', 13, 'Pituitary Specialist Training', 'Pituitary disorders', '9 AM–2 PM', ['Gujarati', 'English'], 'Mon–Sat'],
      ['Dr. Ananya Bose', 6, 'Clinical Nutrition Endocrine', 'Obesity treatment', '3 PM–7 PM', ['Bengali', 'English'], 'Tue–Sun'],
      ['Dr. Lakshmi Pillai', 9, 'Hormone Therapy Certification', 'Hormone replacement therapy', '8 AM–12 PM', ['Malayalam', 'English'], 'Mon–Fri'],
    ],
    Oncology: [
      ['Dr. Rajiv Kapoor', 22, 'DM Medical Oncology', 'Chemotherapy planning', '9 AM–3 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Meera Nair', 15, 'Breast Oncology Fellowship', 'Breast cancer care', '2 PM–6 PM', ['Malayalam', 'English'], 'Tue–Sat'],
      ['Dr. Vikram Singh', 13, 'Lung Cancer Specialist', 'Thoracic oncology', '10 AM–4 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Pooja Sharma', 8, 'Pediatric Oncology Fellowship', 'Childhood cancers', '9 AM–1 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Arjun Menon', 17, 'Surgical Oncology', 'Tumor removal surgery', '1 PM–5 PM', ['Malayalam', 'English'], 'Tue–Sun'],
      ['Dr. Kavya Iyer', 11, 'Radiation Oncology', 'Radiotherapy planning', '3 PM–7 PM', ['Tamil', 'English'], 'Mon–Fri'],
      ['Dr. Sameer Khan', 9, 'Hemato Oncology', 'Blood cancers', '8 AM–12 PM', ['Urdu', 'English'], 'Tue–Sat'],
      ['Dr. Neha Kapoor', 12, 'Immunotherapy Specialist', 'Targeted therapy', '10 AM–3 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Rakesh Gupta', 18, 'GI Oncology', 'Gastro cancers', '2 PM–6 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Anjali Verma', 10, 'Palliative Medicine', 'End-of-life care', '9 AM–2 PM', ['Hindi', 'English'], 'Tue–Sun'],
    ],
    Dermatology: [
      ['Dr. Ritu Jain', 10, 'MD Dermatology', 'Acne & scars', '9 AM–1 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Aman Bansal', 14, 'Clinical Dermatology', 'Psoriasis', '10 AM–4 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Sana Ali', 7, 'Cosmetic Dermatology', 'Aesthetic procedures', '2 PM–6 PM', ['Urdu', 'English'], 'Mon–Sat'],
      ['Dr. Mehul Shah', 12, 'Hair Restoration Training', 'Hair loss treatment', '9 AM–2 PM', ['Gujarati', 'English'], 'Tue–Sun'],
      ['Dr. Divya Menon', 11, 'Laser Dermatology Certification', 'Laser therapy', '3 PM–7 PM', ['Malayalam', 'English'], 'Mon–Fri'],
      ['Dr. Karthik Iyer', 15, 'Allergy Dermatology', 'Skin allergy treatment', '8 AM–12 PM', ['Tamil', 'English'], 'Mon–Sat'],
      ['Dr. Pooja Kapoor', 6, 'Anti-aging Dermatology', 'Skin rejuvenation', '1 PM–5 PM', ['Hindi', 'English'], 'Tue–Sun'],
      ['Dr. Rahul Sharma', 13, 'Clinical Dermatology', 'Eczema treatment', '10 AM–3 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Kavita Rao', 8, 'Pediatric Dermatology', 'Child skin disorders', '9 AM–1 PM', ['Kannada', 'English'], 'Mon–Fri'],
      ['Dr. Nikhil Bose', 9, 'Cosmetic Skin Therapy', 'Chemical peels', '2 PM–6 PM', ['Bengali', 'English'], 'Mon–Sat'],
    ],
    Pathology: [
      ['Dr. Mahesh Gupta', 21, 'MD Pathology', 'Histopathology', '9 AM–3 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Shweta Iyer', 12, 'Clinical Pathology', 'Blood analysis', '10 AM–4 PM', ['Tamil', 'English'], 'Mon–Sat'],
      ['Dr. Akash Verma', 9, 'Cytopathology', 'Cell analysis', '8 AM–1 PM', ['Hindi', 'English'], 'Tue–Sat'],
      ['Dr. Pankaj Sharma', 17, 'Microbiology', 'Infection detection', '2 PM–6 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Nandini Pillai', 11, 'Molecular Pathology', 'Genetic testing', '9 AM–2 PM', ['Malayalam', 'English'], 'Mon–Sat'],
      ['Dr. Imran Sheikh', 8, 'Clinical Biochemistry', 'Chemical testing', '10 AM–3 PM', ['Urdu', 'English'], 'Tue–Sun'],
      ['Dr. Arvind Menon', 19, 'Hematopathology', 'Blood disorders', '1 PM–5 PM', ['Malayalam', 'English'], 'Mon–Fri'],
      ['Dr. Kavita Desai', 13, 'Surgical Pathology', 'Tissue diagnosis', '8 AM–12 PM', ['Gujarati', 'English'], 'Mon–Sat'],
      ['Dr. Rahul Nair', 7, 'Lab Diagnostics', 'Routine testing', '9 AM–1 PM', ['English', 'Malayalam'], 'Tue–Sun'],
      ['Dr. Sonia Kapoor', 10, 'Clinical Lab Medicine', 'Medical reports', '2 PM–6 PM', ['Hindi', 'English'], 'Mon–Sat'],
    ],
    ENT: [
      ['Dr. Ajay Singh', 18, 'MS ENT', 'Sinus surgery', '9 AM–1 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Meera Nair', 11, 'ENT Specialist', 'Hearing loss', '2 PM–6 PM', ['Malayalam', 'English'], 'Mon–Sat'],
      ['Dr. Karthik Iyer', 13, 'Voice Specialist', 'Voice disorders', '10 AM–4 PM', ['Tamil', 'English'], 'Tue–Sun'],
      ['Dr. Ritu Sharma', 9, 'ENT', 'Tonsil disorders', '9 AM–2 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Farhan Ali', 15, 'ENT Surgery', 'Nasal polyps', '3 PM–7 PM', ['Urdu', 'English'], 'Tue–Sun'],
      ['Dr. Sneha Reddy', 10, 'Pediatric ENT', 'Ear infections', '8 AM–12 PM', ['Telugu', 'English'], 'Mon–Fri'],
      ['Dr. Vikrant Kapoor', 12, 'ENT', 'Vertigo treatment', '1 PM–5 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Anil Menon', 16, 'Head Neck Surgery', 'Tumor removal', '10 AM–3 PM', ['Malayalam', 'English'], 'Mon–Fri'],
      ['Dr. Pooja Desai', 7, 'ENT Allergy Specialist', 'Nasal allergy', '2 PM–6 PM', ['Gujarati', 'English'], 'Tue–Sat'],
      ['Dr. Rajesh Pillai', 18, 'Cochlear Implant Surgeon', 'Hearing implants', '9 AM–1 PM', ['English', 'Malayalam'], 'Mon–Fri'],
    ],
    'Nutrients & Dietetics': [
      ['Dr. Shreya Kapoor', 9, 'MSc Clinical Nutrition', 'Weight loss plans', '9 AM–1 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Anitha Reddy', 12, 'Dietetics Certification', 'Diabetes diet', '2 PM–6 PM', ['Telugu', 'English'], 'Mon–Fri'],
      ['Dr. Rahul Shah', 8, 'Sports Nutrition Specialist', 'Athlete diet', '10 AM–3 PM', ['Gujarati', 'English'], 'Mon–Sat'],
      ['Dr. Meenakshi Iyer', 15, 'Clinical Nutrition', 'Thyroid diet', '9 AM–2 PM', ['Tamil', 'English'], 'Mon–Fri'],
      ['Dr. Farah Khan', 6, 'Pregnancy Nutrition', 'Maternal diet', '1 PM–5 PM', ['Urdu', 'English'], 'Tue–Sun'],
      ['Dr. Vivek Menon', 10, 'Cardiac Nutrition', 'Heart diet', '8 AM–12 PM', ['Malayalam', 'English'], 'Mon–Sat'],
      ['Dr. Pooja Verma', 7, 'Weight Management', 'Obesity diet', '2 PM–6 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Kavya Nair', 11, 'Pediatric Nutrition', 'Child diet', '9 AM–1 PM', ['English', 'Malayalam'], 'Mon–Sat'],
      ['Dr. Aman Bansal', 5, 'Lifestyle Nutrition', 'Detox plans', '3 PM–7 PM', ['Hindi', 'English'], 'Tue–Sun'],
      ['Dr. Snehal Deshmukh', 13, 'Therapeutic Diet', 'Kidney diet', '10 AM–4 PM', ['Marathi', 'English'], 'Mon–Fri'],
    ],
    Neurology: [
      ['Dr. Rajat Khanna', 16, 'DM Neurology', 'Stroke management', '9 AM–1 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Divya Menon', 9, 'Neuro Specialist', 'Migraine', '2 PM–6 PM', ['Malayalam', 'English'], 'Mon–Sat'],
      ['Dr. Suresh Reddy', 14, 'Epileptologist', 'Epilepsy', '10 AM–4 PM', ['Telugu', 'English'], 'Tue–Sun'],
      ['Dr. Mehul Shah', 11, 'Movement Disorder Specialist', 'Parkinson’s', '9 AM–2 PM', ['Gujarati', 'English'], 'Mon–Sat'],
      ['Dr. Ananya Roy', 7, 'Clinical Neurology', 'Neuropathy', '1 PM–5 PM', ['Bengali', 'English'], 'Mon–Fri'],
      ['Dr. Karthik Iyer', 13, 'Neuro Surgery', 'Brain tumors', '8 AM–12 PM', ['Tamil', 'English'], 'Tue–Sat'],
      ['Dr. Farhan Khan', 10, 'Neurodegenerative Disorders', 'Alzheimer’s', '2 PM–6 PM', ['Urdu', 'English'], 'Mon–Fri'],
      ['Dr. Priya Nair', 12, 'DM Neurology', 'Multiple sclerosis', '9 AM–1 PM', ['English', 'Malayalam'], 'Mon–Sat'],
      ['Dr. Vikram Singh', 18, 'Spine Specialist', 'Spinal disorders', '10 AM–3 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Neha Kapoor', 8, 'Neuro Trauma Care', 'Head injury', '3 PM–7 PM', ['Hindi', 'English'], 'Tue–Sun'],
    ],
    'General Medicine': [
      ['Dr. Amit Verma', 15, 'MD Medicine', 'Fever treatment', '9 AM–2 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Sneha Iyer', 9, 'Lifestyle Medicine', 'Lifestyle disorders', '2 PM–6 PM', ['Tamil', 'English'], 'Mon–Fri'],
      ['Dr. Rahul Sharma', 12, 'Physician', 'Hypertension', '10 AM–4 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Kavita Nair', 8, 'Internal Medicine', 'Diabetes', '9 AM–1 PM', ['English', 'Malayalam'], 'Tue–Sun'],
      ['Dr. Mehul Shah', 11, 'Chronic Disease Specialist', 'Long-term illness', '1 PM–5 PM', ['Gujarati', 'English'], 'Mon–Fri'],
      ['Dr. Sana Ali', 7, 'General Physician', 'Viral infections', '2 PM–6 PM', ['Urdu', 'English'], 'Mon–Sat'],
      ['Dr. Arvind Menon', 14, 'Preventive Medicine', 'Health screening', '9 AM–3 PM', ['Malayalam', 'English'], 'Mon–Fri'],
      ['Dr. Pooja Kapoor', 6, 'Digestive Specialist', 'GI problems', '10 AM–2 PM', ['Hindi', 'English'], 'Tue–Sat'],
      ['Dr. Nikhil Bose', 10, 'Metabolic Medicine', 'Metabolic disorders', '8 AM–12 PM', ['Bengali', 'English'], 'Mon–Fri'],
      ['Dr. Ritu Jain', 13, 'Immunology Medicine', 'Immunity disorders', '3 PM–7 PM', ['Hindi', 'English'], 'Mon–Sat'],
    ],
    Cardiology: [
      ['Dr. Vikram Malhotra', 20, 'DM Cardiology', 'Heart attack treatment', '9 AM–2 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Meera Pillai', 12, 'Clinical Cardiology', 'ECG & Echo', '2 PM–6 PM', ['Malayalam', 'English'], 'Mon–Sat'],
      ['Dr. Rahul Jain', 10, 'Cardiac Medicine', 'Hypertension', '10 AM–4 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Arjun Menon', 15, 'Interventional Cardiology', 'Angioplasty', '9 AM–1 PM', ['English', 'Malayalam'], 'Tue–Sun'],
      ['Dr. Kavya Sharma', 8, 'Heart Failure Specialist', 'Cardiac failure', '1 PM–5 PM', ['Hindi', 'English'], 'Mon–Fri'],
      ['Dr. Suresh Reddy', 14, 'Electrophysiology', 'Arrhythmia', '8 AM–12 PM', ['Telugu', 'English'], 'Mon–Sat'],
      ['Dr. Mehul Shah', 11, 'Preventive Cardiology', 'Cholesterol management', '2 PM–6 PM', ['Gujarati', 'English'], 'Tue–Sun'],
      ['Dr. Farhan Khan', 13, 'Structural Heart Specialist', 'Valve disease', '9 AM–3 PM', ['Urdu', 'English'], 'Mon–Fri'],
      ['Dr. Neha Kapoor', 7, 'Preventive Cardiac Care', 'Risk screening', '10 AM–2 PM', ['Hindi', 'English'], 'Mon–Sat'],
      ['Dr. Aditya Bose', 16, 'Cardiac Surgery Support', 'Pre/post surgery care', '3 PM–7 PM', ['Bengali', 'English'], 'Mon–Fri'],
    ],
  },
};

const sourceDoctorsFullRoster = normalizeToFullRoster(sourceDoctors);

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const dayMap = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
};

function parseWorkingDays(workingDaysText) {
  if (!workingDaysText) {
    return new Set(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
  }

  const [startText, endText] = workingDaysText.split('–').map((value) => value.trim());
  const start = dayMap[startText];
  const end = dayMap[endText];

  if (!start || !end) {
    return new Set(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
  }

  const startIndex = weekDays.indexOf(start);
  const endIndex = weekDays.indexOf(end);

  if (startIndex === -1 || endIndex === -1) {
    return new Set(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
  }

  const activeDays = new Set();

  if (startIndex <= endIndex) {
    for (let index = startIndex; index <= endIndex; index += 1) {
      activeDays.add(weekDays[index]);
    }
    return activeDays;
  }

  for (let index = startIndex; index < weekDays.length; index += 1) {
    activeDays.add(weekDays[index]);
  }
  for (let index = 0; index <= endIndex; index += 1) {
    activeDays.add(weekDays[index]);
  }

  return activeDays;
}

function createWeeklySchedule(slotText, workingDaysText) {
  const activeDays = parseWorkingDays(workingDaysText);

  return {
    Monday: activeDays.has('Monday') ? slotText : 'Off',
    Tuesday: activeDays.has('Tuesday') ? slotText : 'Off',
    Wednesday: activeDays.has('Wednesday') ? slotText : 'Off',
    Thursday: activeDays.has('Thursday') ? slotText : 'Off',
    Friday: activeDays.has('Friday') ? slotText : 'Off',
    Saturday: activeDays.has('Saturday') ? slotText : 'Off',
    Sunday: activeDays.has('Sunday') ? slotText : 'Off',
  };
}

function slotArrayFromRange(slotText) {
  const [start, end] = slotText.split('–').map((value) => value.trim());
  return [start, end];
}

export const contractDoctors = Object.entries(sourceDoctorsFullRoster).flatMap(([hospitalName, departments], hospitalIdx) => {
  const hospital = contractHospitals.find((item) => item.name === hospitalName);

  return Object.entries(departments).flatMap(([department, entries], deptIdx) =>
    entries.map((entry, doctorIdx) => {
      const [fullName, experienceYears, degree, focus, slotText, languages, workingDaysText] = entry;
      const inferredGender = inferGenderFromName(fullName);
      const id = `${hospital.id}-${department.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${doctorIdx + 1}`;

      return {
        id,
        fullName,
        gender: inferredGender,
        department,
        specialization: focus,
        experienceYears,
        educationShort: degree,
        educationHistory: [
          { degree: 'MBBS', institution: 'AIIMS New Delhi', year: `${2005 + doctorIdx}` },
          { degree, institution: 'Speciality Medical Institute', year: `${2010 + doctorIdx}` },
        ],
        consultationFee: 900 + deptIdx * 80,
        languages,
        profileImage: createUniqueProfileImage(inferredGender, hospitalIdx, deptIdx, doctorIdx),
        availabilityStatus: 'Available',
        weeklyAvailability: createWeeklySchedule(slotText, workingDaysText),
        availableTimeSlots: slotArrayFromRange(slotText),
        professionalBio: `${fullName} focuses on ${focus.toLowerCase()} with ${experienceYears} years of experience.`,
        workTimeline: [
          { period: '2012 - 2018', role: `Consultant ${department}` },
          { period: '2018 - Present', role: `Senior Specialist, ${hospitalName}` },
        ],
        hospitalAffiliation: hospitalName,
        hospitalId: hospital.id,
        certifications: ['Medical Council Registered', 'Clinical Excellence Training'],
        publications: ['Clinical outcomes review', 'Department case publication'],
        patientReviews: [
          { reviewer: 'Patient A', rating: 5, comment: 'Very helpful consultation.' },
          { reviewer: 'Patient B', rating: 4, comment: 'Clear treatment explanation.' },
        ],
      };
    })
  );
});
