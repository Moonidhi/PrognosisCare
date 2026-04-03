import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BillingBreakdown from '../components/BillingBreakdown';
import { useApp } from '../context/AppContext';

const testCatalog = [
  { id: 'test-cbc', name: 'Blood Test (CBC)', cost: 750 },
  { id: 'test-lipid', name: 'Lipid Profile', cost: 1400 },
  { id: 'test-thyroid', name: 'Thyroid Profile', cost: 1100 },
  { id: 'test-ecg', name: 'ECG', cost: 1200 },
  { id: 'test-xray', name: 'Chest X-Ray', cost: 950 },
  { id: 'test-lft', name: 'Liver Function Test', cost: 1300 },
];

function LabBookingPage() {
  const navigate = useNavigate();
  const { state, loading, confirmBooking, addMedicalRecord } = useApp();

  const [location, setLocation] = useState(state.selectedHospital.locations[0]);
  const [slot, setSlot] = useState('2026-02-20T10:30');
  const [selectedTestId, setSelectedTestId] = useState(testCatalog[0].id);
  const [prescriptionFile, setPrescriptionFile] = useState(null);

  const selectedTest = testCatalog.find((item) => item.id === selectedTestId) || testCatalog[0];

  const bill = useMemo(() => {
    const serviceFee = state.selectedHospital.serviceFee;
    const taxRate = state.selectedHospital.taxRate;
    const rows = [selectedTest].map((test) => {
      const tax = Math.round(test.cost * taxRate);
      return {
        name: test.name,
        basePrice: test.cost,
        discountedPrice: test.cost,
        serviceFee,
        tax,
        total: test.cost + serviceFee + tax,
      };
    });

    const subtotal = rows.reduce((sum, row) => sum + row.discountedPrice, 0);
    const fees = rows.reduce((sum, row) => sum + row.serviceFee, 0);
    const taxes = rows.reduce((sum, row) => sum + row.tax, 0);

    return {
      rows,
      subtotal,
      fees,
      taxes,
      total: subtotal + fees + taxes,
    };
  }, [selectedTest, state.selectedHospital.serviceFee, state.selectedHospital.taxRate]);

  const handleConfirm = async () => {
    const draft = {
      tests: [selectedTest],
      hospital: state.selectedHospital,
      location,
      slot,
      insuranceEnabled: false,
      prescriptionName: prescriptionFile?.name || null,
      bill,
    };

    await confirmBooking(draft);

    if (prescriptionFile) {
      await addMedicalRecord({
        file: prescriptionFile,
        recordType: 'Prescription',
        notes: `Prescription uploaded for ${selectedTest.name}`,
      });
    }

    navigate('/payment');
  };

  return (
    <div className="page-shell grid gap-4 lg:grid-cols-5">
      <section className="card space-y-4 lg:col-span-2">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-med-600">Hospital Booking</p>
          <h2 className="text-xl font-semibold">{state.selectedHospital.name}</h2>
          <p className="text-sm text-slate-600">{state.selectedHospital.address}</p>
          <p className="mt-2 text-sm text-slate-600">{state.selectedHospital.description}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {state.selectedHospital.accreditation}
            </span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              ⭐ {state.selectedHospital.rating} Rating
            </span>
            <span className="rounded-full bg-med-100 px-3 py-1 text-xs font-medium text-med-700">
              {state.selectedHospital.emergencySupport}
            </span>
          </div>

          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Specialties</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {state.selectedHospital.specialties.map((speciality) => (
              <span key={speciality} className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700">
                {speciality}
              </span>
            ))}
          </div>

          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Specialist Units</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-700">
            {(state.selectedHospital.specialistUnits || []).map((unit) => (
              <li key={unit}>{unit}</li>
            ))}
          </ul>

          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Key Facilities</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-700">
            {(state.selectedHospital.facilities || []).map((facility) => (
              <li key={facility}>{facility}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Select Lab Test</p>
          <select className="input" value={selectedTestId} onChange={(event) => setSelectedTestId(event.target.value)}>
            {testCatalog.map((test) => (
              <option key={test.id} value={test.id}>
                {test.name} — ₹{test.cost}
              </option>
            ))}
          </select>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          Upload Prescription (optional)
          <input
            className="input mt-2"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(event) => setPrescriptionFile(event.target.files?.[0] || null)}
          />
        </label>

        <div>
          <p className="mb-2 text-sm font-medium">Choose Hospital Location</p>
          <select className="input" value={location} onChange={(e) => setLocation(e.target.value)}>
            {state.selectedHospital.locations.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          Preferred Date & Time Slot
          <input className="input mt-2" type="datetime-local" value={slot} onChange={(e) => setSlot(e.target.value)} />
        </label>

        {prescriptionFile ? (
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
            Attached prescription: {prescriptionFile.name}
          </p>
        ) : null}

        <div className="flex gap-2 pt-2">
          <button className="btn-primary flex-1" onClick={handleConfirm} disabled={loading.booking}>
            {loading.booking ? 'Reserving Slot...' : 'Confirm & Pay'}
          </button>
          <button className="btn-secondary" onClick={() => navigate('/triage')}>
            Cancel
          </button>
        </div>
      </section>

      <div className="lg:col-span-3">
        <BillingBreakdown bill={bill} title="Itemized Bill" />
        <section className="card mt-4">
          <h3 className="text-lg font-semibold">Cost Breakdown</h3>
          <div className="mt-3 space-y-1 text-sm text-slate-700">
            <div className="flex justify-between"><span>Test Fee</span><span>₹{selectedTest.cost}</span></div>
            <div className="flex justify-between"><span>Service Charge</span><span>₹{bill.fees}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>₹{bill.taxes}</span></div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold text-med-700"><span>Total</span><span>₹{bill.total}</span></div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LabBookingPage;
