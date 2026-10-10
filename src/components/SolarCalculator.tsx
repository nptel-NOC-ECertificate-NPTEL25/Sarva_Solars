import React, { useState } from 'react';
import { submitLead } from '../services/api';
import {
  Sun,
  Calculator,
  Zap,
  TrendingUp,
  Download,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const SolarCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bill' | 'emi'>('bill');

  // Bill Calculator State
  const [monthlyBill, setMonthlyBill] = useState<number>(0);
  const [propertyType, setPropertyType] = useState<'home' | 'commercial'>('home');
  const [tariffRate, setTariffRate] = useState<number>(0);
  const [connectionType, setConnectionType] = useState<'On-Grid' | 'Off-Grid' | 'Hybrid'>('On-Grid');

  // Lead form state
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadState, setLeadState] = useState('Andhra Pradesh');
  const [leadCity, setLeadCity] = useState('');
  const [roofType, setRoofType] = useState('Terrace (Concrete)');
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadError, setLeadError] = useState('');

  // Indicative estimates only. Actual generation and savings depend on site conditions,
  // weather, consumption patterns, tariff structure, and export-metering rules.
  const isEstimateReady = monthlyBill > 0 && tariffRate > 0;
  const estimatedMonthlyUnits = isEstimateReady ? monthlyBill / tariffRate : 0;
  const estimatedKw = isEstimateReady
    ? Math.round((estimatedMonthlyUnits / 120) * 10) / 10
    : 0;
  const roofAreaSqFt = Math.ceil(estimatedKw * 100);
  const annualUnits = Math.round(estimatedKw * 4 * 365);
  const annualSavings = isEstimateReady
    ? Math.round(Math.min(annualUnits * tariffRate, monthlyBill * 12))
    : 0;

  // ₹55,000/kW is an illustrative cost assumption, not a government-set price.
  const systemCostGross = Math.round(estimatedKw * 55000);

  // PM Surya Ghar residential CFA estimate for eligible on-grid systems:
  // ₹30,000/kW for the first 2 kW and ₹18,000/kW for the next 1 kW.
  const subsidy =
    propertyType === 'home' && connectionType === 'On-Grid' && isEstimateReady
      ? Math.round(
          Math.min(estimatedKw, 2) * 30000 +
          Math.min(Math.max(estimatedKw - 2, 0), 1) * 18000
        )
      : 0;

  const netInvestment = Math.max(0, systemCostGross - subsidy);
  const paybackYears = annualSavings > 0
    ? Number((netInvestment / annualSavings).toFixed(1))
    : 0;
  const lifetimeSavings25Years = Math.round(
    annualSavings * ((Math.pow(1.03, 25) - 1) / 0.03)
  );
  const co2ReductionTonsPerYear = Number((annualUnits * 0.00082).toFixed(1));

  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // One lead per calculator session; later edits recalculate locally.
    if (leadSubmitted) return;

    setLeadError('');

    if (!isEstimateReady) {
      setLeadError('Enter a monthly bill and tariff above zero to calculate an estimate first.');
      return;
    }

    if (!leadName.trim() || !/^\d{10}$/.test(leadPhone.replace(/\D/g, ''))) {
      setLeadError('Enter your full name and a valid 10-digit mobile number.');
      return;
    }
setLeadLoading(true);
    try {
      await submitLead({
        fullName: leadName.trim(),
        phone: leadPhone.trim(),
        email: leadEmail.trim(),
        state: leadState.trim(),
        city: leadCity.trim(),
        solarFor: propertyType === 'home' ? 'Home' : 'Business',
        monthlyBill: `₹${monthlyBill.toLocaleString('en-IN')}/month`,
        roofType,
        connectionType,
        financeInterest: 'No',
        notes: [
          'Solar calculator enquiry.',
          `Tariff ₹${tariffRate}/unit.`,
          `Estimated monthly usage ${Math.round(estimatedMonthlyUnits)} units.`,
          `Estimated system ${isEstimateReady ? `${estimatedKw} kW` : '—'}.`,
          `Estimated annual generation ${annualUnits} kWh.`,
          `Indicative system cost ₹${systemCostGross}.`,
          `Estimated central subsidy ₹${subsidy}.`,
          `Estimated net investment ₹${netInvestment}.`,
          `Estimated annual energy-cost offset ₹${annualSavings}.`,
          `Estimated simple payback ${paybackYears} years.`,
          'Assumptions: 4 kWh/kW/day, ₹55,000/kW indicative cost, 100 sq ft/kW, and 3% annual tariff escalation for the lifetime projection.',
        ].join(' ')
      });
      setLeadSubmitted(true);
    } catch (error) {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : error instanceof Error
            ? error.message
            : 'Could not submit your enquiry. Please try again.';
      console.error('Solar calculator lead submission failed:', error);
      setLeadError(errorMessage);
    } finally {
      setLeadLoading(false);
    }
  };

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState<number>(netInvestment || 100000);
  const [interestRate, setInterestRate] = useState<number>(8.5); // % per annum
  const [tenureYears, setTenureYears] = useState<number>(5);

  // EMI Calculation: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  const emi =
    monthlyRate > 0
      ? Math.round(
          (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
            (Math.pow(1 + monthlyRate, totalMonths) - 1)
        )
      : Math.round(loanAmount / totalMonths);

  const totalPayable = emi * totalMonths;
  const totalInterest = Math.max(0, totalPayable - loanAmount);

  // Professional Sarva Solars PDF estimation report.
  const handleDownloadPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const now = new Date();
    const reportRef = `SS-${now.getTime().toString().slice(-8)}`;
    const generatedAt = now.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      hour12: true,
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;

    const green: [number, number, number] = [17, 103, 69];
    const darkGreen: [number, number, number] = [11, 65, 47];
    const gold: [number, number, number] = [226, 170, 55];
    const ink: [number, number, number] = [31, 41, 55];
    const muted: [number, number, number] = [100, 116, 139];
    const paleGreen: [number, number, number] = [239, 248, 242];
    const paleGold: [number, number, number] = [255, 249, 234];

    // Load the actual website logo. If unavailable, the report remains branded
    // with a typographic logo instead of failing to download.
    const logoData = await new Promise<string | null>((resolve) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || 300;
          canvas.height = img.naturalHeight || 120;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(null);
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = '/sarva-solar-logo.png';
    });

    const money = (value: number) =>
      `Rs. ${Math.round(value).toLocaleString('en-IN')}`;

    const drawHeader = () => {
      doc.setFillColor(...darkGreen);
      doc.rect(0, 0, pageWidth, 39, 'F');
      doc.setFillColor(...gold);
      doc.rect(0, 39, pageWidth, 1.5, 'F');

      if (logoData) {
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(13, 6, 29, 26, 2, 2, 'F');
        doc.addImage(logoData, 'PNG', 14.5, 7.5, 26, 23, undefined, 'FAST');
      } else {
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('SARVA', 15, 17);
        doc.text('SOLARS', 15, 24);
      }

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(17);
      doc.text('SARVA SOLARS', 47, 15);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('SOLAR ROOFTOP ESTIMATION REPORT', 47, 22);
      doc.setTextColor(226, 210, 164);
      doc.setFontSize(7.5);
      doc.text(`Report Ref: ${reportRef}`, 47, 29);
      doc.text(`Generated: ${generatedAt}`, pageWidth - 13, 29, { align: 'right' });
    };

    const drawFooter = (page: number, total: number) => {
      doc.setDrawColor(...gold);
      doc.setLineWidth(0.6);
      doc.line(margin, 274, pageWidth - margin, 274);
      doc.setTextColor(...green);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('SARVA SOLARS', margin, 280);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...muted);
      doc.setFontSize(7);
      doc.text('Brodipet 5/15, Guntur, Andhra Pradesh - 522002', margin, 285);
      doc.text('Phone: +91 8985430100 / +91 9160513161', margin, 290);
      doc.text('Email: solarsarva@gmail.com', pageWidth - margin, 285, { align: 'right' });
      doc.text(`Page ${page} of ${total}`, pageWidth - margin, 290, { align: 'right' });
    };

    let y = 48;
    const ensureSpace = (height: number) => {
      if (y + height > 266) {
        doc.addPage();
        drawHeader();
        y = 48;
      }
    };

    const section = (title: string) => {
      ensureSpace(15);
      doc.setFillColor(...paleGreen);
      doc.roundedRect(margin, y - 5, contentWidth, 10, 1.5, 1.5, 'F');
      doc.setFillColor(...gold);
      doc.rect(margin, y - 5, 1.5, 10, 'F');
      doc.setTextColor(...darkGreen);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.text(title, margin + 5, y + 1.5);
      y += 13;
    };

    const row = (label: string, value: string, options: { bold?: boolean; color?: [number, number, number] } = {}) => {
      const lines = doc.splitTextToSize(`${label}: ${value}`, contentWidth - 8);
      const height = Math.max(6, lines.length * 4.5 + 1);
      ensureSpace(height);
      doc.setFont('helvetica', options.bold ? 'bold' : 'normal');
      doc.setFontSize(8.8);
      doc.setTextColor(...(options.color || ink));
      doc.text(lines, margin + 4, y);
      y += height;
    };

    const note = (text: string) => {
      const lines = doc.splitTextToSize(text, contentWidth - 10);
      const height = lines.length * 4 + 8;
      ensureSpace(height);
      doc.setFillColor(...paleGold);
      doc.roundedRect(margin, y - 3, contentWidth, height, 1.5, 1.5, 'F');
      doc.setTextColor(...ink);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(lines, margin + 5, y + 2);
      y += height + 3;
    };

    const metric = (x: number, top: number, width: number, label: string, value: string) => {
      doc.setFillColor(...paleGreen);
      doc.roundedRect(x, top, width, 20, 2, 2, 'F');
      doc.setTextColor(...muted);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(label, x + 4, top + 6);
      doc.setTextColor(...darkGreen);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(doc.splitTextToSize(value, width - 8), x + 4, top + 14);
    };

    const monthlySavings = annualSavings / 12;
    const estimatedPostSolarBill = Math.max(0, monthlyBill - monthlySavings);
    const monthlyGeneration = Math.round(annualUnits / 12);
    const annualTariffSavings = Math.round(annualSavings);
    const financeEnabled = activeTab === 'emi';

    doc.setProperties({
      title: 'Sarva Solars - Solar Rooftop Estimation Report',
      subject: `Indicative solar estimate ${reportRef}`,
      author: 'Sarva Solars',
      creator: 'Sarva Solars Solar Calculator',
    });

    drawHeader();

    // Customer and report details
    section('01  CUSTOMER & REPORT DETAILS');
    row('Customer name', leadName.trim() || 'Not provided');
    row('Mobile number', leadPhone.trim() || 'Not provided');
    if (leadEmail.trim()) row('Email address', leadEmail.trim());
    row('Location', [leadCity.trim(), leadState.trim()].filter(Boolean).join(', ') || 'Not provided');
    row('Property category', propertyType === 'home' ? 'Residential' : 'Commercial');
    row('Roof type', roofType || 'Not specified');
    row('Solar connection', connectionType);
    row('Report reference', reportRef);
    row('Generated on', generatedAt);

    // Quick summary
    section('02  RECOMMENDED SOLAR SYSTEM');
    ensureSpace(25);
    const gap = 3;
    const cardWidth = (contentWidth - gap * 2) / 3;
    metric(margin, y, cardWidth, 'SYSTEM CAPACITY', `${estimatedKw.toFixed(1)} kWp`);
    metric(margin + cardWidth + gap, y, cardWidth, 'MONTHLY GENERATION', `${monthlyGeneration.toLocaleString('en-IN')} units`);
    metric(margin + (cardWidth + gap) * 2, y, cardWidth, 'ANNUAL GENERATION', `${annualUnits.toLocaleString('en-IN')} units`);
    y += 26;

    row('Current monthly electricity bill', money(monthlyBill));
    row('Entered electricity tariff', `${money(tariffRate)} per unit`);
    row('Estimated monthly consumption', `${Math.round(estimatedMonthlyUnits).toLocaleString('en-IN')} units`);
    row('Estimated shadow-free roof area', `Approximately ${roofAreaSqFt.toLocaleString('en-IN')} sq. ft.`);
    row('Daily generation assumption', '4 units per kWp per day');
    row('Monthly generation estimate', 'Annual estimate divided by 12; actual output varies by season and site.');

    // Financial overview
    section('03  ESTIMATED SAVINGS & INVESTMENT');
    row('Indicative system cost', money(systemCostGross), { bold: true });
    row('Potential central subsidy estimate', `- ${money(subsidy)}`);
    row('Estimated net investment', money(netInvestment), { bold: true, color: green });
    row('Estimated monthly energy-cost offset', money(monthlySavings));
    row('Estimated post-solar monthly bill', money(estimatedPostSolarBill));
    row('Estimated annual energy-cost offset', money(annualTariffSavings));
    row('Indicative simple payback period', annualSavings > 0 ? `Approximately ${paybackYears} years` : 'Not available');
    row('Illustrative 25-year savings projection', money(lifetimeSavings25Years));
    note('Savings and payback are indicative estimates, not guaranteed bill reductions. Actual results depend on system design, site shading, seasonal output, self-consumption, utility rules, tariff changes, degradation, and maintenance.');

    // Finance illustration
    section('04  FINANCING ILLUSTRATION');
    row('Calculator mode at report generation', financeEnabled ? 'Bank EMI Finance' : 'Solar Rooftop & Savings');
    row('Illustrative loan amount', money(loanAmount));
    row('Assumed annual interest rate', `${interestRate.toFixed(2)}%`);
    row('Assumed loan tenure', `${tenureYears} years (${totalMonths} monthly instalments)`);
    row('Estimated monthly EMI', money(emi), { bold: true });
    row('Estimated total repayment', money(totalPayable));
    row('Estimated total interest', money(totalInterest));
    note('This is a mathematical illustration only, not a loan offer or bank approval. Actual interest, fees, eligibility, EMI and tenure are determined by the lender. Loan amount may differ from the final project cost.');

    // Environmental and assumptions
    section('05  ENVIRONMENTAL INDICATION & ASSUMPTIONS');
    row('Indicative annual CO2 reduction', `${co2ReductionTonsPerYear} metric tonnes (approximate)`);
    row('System pricing assumption', 'Rs. 55,000 per kWp; illustrative only, not a confirmed quotation.');
    row('Roof-space assumption', 'Approximately 100 sq. ft. per kWp; final layout requires a site survey.');
    row('Tariff escalation assumption', '3% per year used for the 25-year projection.');
    row('Generation basis', '4 kWh per kWp per day; weather, orientation, shading and equipment affect actual output.');

    section('06  SUBSIDY, SCOPE & IMPORTANT NOTES');
    row('Subsidy treatment', propertyType === 'home' && connectionType === 'On-Grid'
      ? 'The displayed amount is an indicative central subsidy calculation for an eligible residential on-grid system; it is not an approval.'
      : 'No central residential subsidy has been included for this selected property/connection category.');
    note('Government scheme rules, system eligibility, approved capacity, applicant requirements and disbursement are subject to current official guidelines and approval. Confirm eligibility before making an investment decision.');
    note('This report is a preliminary digital estimate, not a final commercial quotation, engineering design, savings guarantee, subsidy sanction, or financing commitment. Final pricing and specifications require a site survey, component selection, structural/electrical checks and written confirmation from Sarva Solars.');
    row('Warranty and equipment specifications', 'To be confirmed in the final project quotation and manufacturer documentation.');
    row('Recommended next step', 'Arrange a site assessment to validate roof area, shading, system sizing, meter requirements and final project cost.');

    // Add a consistent footer and page numbers to every page.
    const totalPages = doc.getNumberOfPages();
    for (let page = 1; page <= totalPages; page++) {
      doc.setPage(page);
      drawFooter(page, totalPages);
    }

    const safeCapacity = estimatedKw.toFixed(1).replace('.', 'p');
    doc.save(`Sarva_Solars_Estimation_${safeCapacity}kWp_${reportRef}.pdf`);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
      {/* Title & Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          PM Surya Ghar Compatible
        </div>
        <h2 className="text-3xl font-black text-slate-900 font-poppins">
          Sarva Solar Savings & EMI Calculator
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Estimate a suitable rooftop solar system, indicative costs, possible residential subsidy and potential savings. Actual results depend on your site, usage, tariff and scheme eligibility.
        </p>

        {/* Dual Tab Switcher */}
        <div className="flex justify-center gap-2 mt-6 p-1.5 bg-slate-100 rounded-2xl max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('bill')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm transition-all ${
              activeTab === 'bill'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Solar Rooftop & Savings
          </button>
          <button
            onClick={() => setActiveTab('emi')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm transition-all ${
              activeTab === 'emi'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bank EMI Finance
          </button>
        </div>
      </div>

      {/* Tab 1: Solar Rooftop & Savings */}
      {activeTab === 'bill' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <form onSubmit={handleLeadSubmit} className="lg:col-span-5 space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div>
              <label htmlFor="solar-lead-name" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
              <input id="solar-lead-name" name="fullName" required value={leadName} onChange={(e) => setLeadName(e.target.value)} autoComplete="name" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900" placeholder="Enter your full name" />
            </div>
            <div>
              <label htmlFor="solar-lead-phone" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Mobile Number</label>
              <input id="solar-lead-phone" name="phone" required type="tel" inputMode="numeric" maxLength={10} pattern="[0-9]{10}" value={leadPhone} onChange={(e) => setLeadPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} autoComplete="tel" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900" placeholder="10-digit mobile number" />
            </div>

            <div>
              <label htmlFor="monthly-electricity-bill" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Monthly Electricity Bill (₹)
              </label>
              <input
                id="monthly-electricity-bill"
                type="number"
                min={0}
                step={100}
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(Math.max(0, Number(e.target.value) || 0))}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
              <p className="mt-1 text-xs text-slate-500">Enter your average monthly bill in rupees.</p>
            </div>

            <div>
              <label htmlFor="discom-tariff-rate" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                DISCOM Tariff Rate (₹/unit)
              </label>
              <input
                id="discom-tariff-rate"
                type="number"
                min={0}
                step={0.01}
                value={tariffRate}
                onChange={(e) => setTariffRate(Math.max(0, Number(e.target.value) || 0))}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
              <p className="mt-1 text-xs text-slate-500">Use your effective energy charge per unit. Actual DISCOM tariffs may be slab-based.</p>
            </div>

            <div>
              <label htmlFor="solar-connection-type" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Solar Connection Type
              </label>
              <select
                id="solar-connection-type"
                value={connectionType}
                onChange={(e) => setConnectionType(e.target.value as 'On-Grid' | 'Off-Grid' | 'Hybrid')}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900"
              >
                <option value="On-Grid">On-Grid</option>
                <option value="Off-Grid">Off-Grid</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>


            {leadError && <p role="alert" className="text-sm font-medium text-red-600">{leadError}</p>}
            <button type="submit" disabled={leadLoading || !isEstimateReady || leadSubmitted} className="w-full rounded-xl bg-amber-500 px-5 py-3 font-extrabold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50">
              {leadLoading ? 'Submitting…' : leadSubmitted ? 'Enquiry Submitted' : 'Calculate Savings'}
            </button>

            <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/30 text-xs text-amber-900 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <span>
                {propertyType === 'home' && connectionType === 'On-Grid' ? (
                  <>
                    <strong>Indicative PM Surya Ghar subsidy estimate.</strong>{' '}
                    The central assistance calculation uses ₹30,000/kW for the first 2 kW
                    and ₹18,000/kW for the next 1 kW, capped at ₹78,000 for general states.
                    Final eligibility and payment depend on current scheme rules, eligible
                    equipment, DISCOM procedures and verification.
                    {isEstimateReady && (
                      <span className="block mt-2 font-bold">
                        Estimated subsidy: ₹{subsidy.toLocaleString('en-IN')}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <strong>Subsidy not included in this estimate.</strong>{' '}
                    This calculator does not estimate residential PM Surya Ghar assistance
                    for commercial, off-grid or hybrid configurations. Check current rules
                    and local eligibility before making a financial decision.
                  </>
                )}
              </span>
            </div>
          </form>

          {/* Results Output Cards */}
          <div className="lg:col-span-7 space-y-6">
            <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500">System Capacity</span>
                <p className="text-2xl font-black text-blue-600 mt-1">{leadSubmitted && isEstimateReady ? `${estimatedKw} kW` : '—'}</p>
                <span className="text-[10px] text-slate-500">Rooftop Plant</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-600">Annual Units</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">
                  {leadSubmitted && isEstimateReady ? annualUnits.toLocaleString('en-IN') : '—'}
                </p>
                <span className="text-[10px] text-slate-500">kWh Generated</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-bold text-amber-600">Roof Area Req.</span>
                <p className="text-2xl font-black text-slate-800 mt-1">{leadSubmitted && isEstimateReady ? `${roofAreaSqFt} sq ft` : '—'}</p>
                <span className="text-[10px] text-slate-500">Shadow Free Terrace</span>
              </div>
            </div>

            {/* Price & Subsidy Financial Breakdown */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-poppins">
                Financial Investment Summary
              </h4>

              <div className="flex justify-between text-sm text-slate-300">
                <span>Estimated Turnkey Cost (Panels + Inverter + Structure):</span>
                <span className="font-mono font-bold">{leadSubmitted && isEstimateReady ? `₹${systemCostGross.toLocaleString('en-IN')}` : '—'}</span>
              </div>

              <div className="flex justify-between text-sm text-emerald-400 font-bold">
                <span>Central Govt Subsidy (PM Surya Ghar):</span>
                <span className="font-mono">{leadSubmitted && isEstimateReady ? `- ₹${subsidy.toLocaleString('en-IN')}` : '—'}</span>
              </div>

              <div className="h-px bg-slate-800 my-2" />

              <div className="flex justify-between text-lg font-black text-white">
                <span>Estimated Net Investment:</span>
                <span className="font-mono text-amber-400">{leadSubmitted && isEstimateReady ? `₹${netInvestment.toLocaleString('en-IN')}` : '—'}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400">Annual Bill Savings:</span>
                  <p className="text-base font-extrabold text-emerald-400 font-mono">
                    {leadSubmitted && isEstimateReady ? `₹${annualSavings.toLocaleString('en-IN')} / year` : '—'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Estimated Payback Period:</span>
                  <p className="text-base font-extrabold text-blue-400 font-mono">{leadSubmitted && isEstimateReady && annualSavings > 0 ? `~${paybackYears} Years` : '—'}</p>
                </div>
              </div>
            </div>

            {/* PDF Report Download Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownloadPDF}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform transform active:scale-98"
               disabled={!leadSubmitted || !isEstimateReady}>
                <Download className="w-4 h-4" />
                <span>Download PDF Feasibility Report</span>
              </button>
            </div>

            </>

          </div>
        </div>
      )}

      {/* Tab 2: Bank EMI Finance Calculator */}
      {activeTab === 'emi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Solar Loan Amount (₹)
                </label>
                <span className="text-base font-black text-blue-600 font-mono">
                  ₹{loanAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="1000000"
                step="10000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Interest Rate (% p.a.)
                </label>
                <span className="text-sm font-bold text-slate-700 font-mono">
                  {interestRate}% p.a.
                </span>
              </div>
              <input
                type="range"
                min="6.5"
                max="14"
                step="0.25"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Loan Tenure (Years)
                </label>
                <span className="text-sm font-bold text-slate-700 font-mono">
                  {tenureYears} Years ({tenureYears * 12} Months)
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-900 to-slate-900 text-white shadow-xl space-y-4 text-center">
              <span className="text-xs uppercase font-bold text-emerald-300 tracking-widest font-poppins">
                Monthly Loan EMI
              </span>
              <p className="text-4xl font-black text-amber-400 font-mono">
                ₹{emi.toLocaleString('en-IN')} <span className="text-xs text-slate-300 font-normal">/ month</span>
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-emerald-800 text-xs text-left">
                <div>
                  <span className="text-slate-300">Total Loan Principal:</span>
                  <p className="text-sm font-extrabold text-white font-mono">₹{loanAmount.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <span className="text-slate-300">Total Payable Interest:</span>
                  <p className="text-sm font-extrabold text-amber-300 font-mono">₹{totalInterest.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-xs text-slate-700 space-y-2">
              <div className="flex items-center gap-2 font-bold text-blue-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Indicative Bank Finance Estimate</span>
              </div>
              <p>
                Compare your estimated loan EMI with your expected solar savings. The actual interest rate, loan approval, fees and energy savings depend on bank eligibility, your credit profile, system performance and local electricity tariffs.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
