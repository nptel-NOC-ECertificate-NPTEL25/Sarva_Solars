import React, { useState } from 'react';
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
import { jsPDF } from 'jspdf';

export const SolarCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bill' | 'emi'>('bill');

  // Bill Calculator State
  const [monthlyBill, setMonthlyBill] = useState<number>(4500);
  const [propertyType, setPropertyType] = useState<'home' | 'commercial'>('home');
  const [tariffRate, setTariffRate] = useState<number>(8.5);

  // Calculations for Solar Bill
  const estimatedKw = Math.max(1, Math.round((monthlyBill / (tariffRate * 120)) * 10) / 10);
  const roofAreaSqFt = Math.round(estimatedKw * 80);
  const annualUnits = Math.round(estimatedKw * 1440);
  const annualSavings = Math.round(annualUnits * tariffRate);
  const lifetimeSavings25Years = Math.round(annualSavings * 25 * 1.35); // 1.35 accounts for ~3% annual grid price hike
  const systemCostGross = Math.round(estimatedKw * 55000);

  let subsidy = 0;
  if (propertyType === 'home') {
    if (estimatedKw <= 1) subsidy = 30000;
    else if (estimatedKw <= 2) subsidy = 60000;
    else subsidy = 78000;
  }
  const netInvestment = Math.max(0, systemCostGross - subsidy);
  const paybackYears = Number((netInvestment / annualSavings).toFixed(1));
  const co2ReductionTonsPerYear = Number((annualUnits * 0.00082).toFixed(1));

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

  // PDF Export using jsPDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Header styling
    doc.setFillColor(11, 94, 215); // Primary #0B5ED7
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('SARVA SOLAR', 15, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Solar Energy Feasibility & Financial Savings Report', 15, 28);
    doc.text(`Generated Date: ${new Date().toLocaleDateString('en-IN')}`, 145, 28);

    // Section 1: System Specs
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Recommended Solar Plant System', 15, 52);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`• Property Type: ${propertyType === 'home' ? 'Residential Home' : 'Commercial Unit'}`, 20, 62);
    doc.text(`• Current Monthly Electricity Bill: Rs. ${monthlyBill.toLocaleString('en-IN')}`, 20, 70);
    doc.text(`• Recommended Capacity: ${estimatedKw} kWp Solar Rooftop Plant`, 20, 78);
    doc.text(`• Required Shadow-Free Roof Space: ~${roofAreaSqFt} sq. ft.`, 20, 86);
    doc.text(`• Estimated Annual Clean Generation: ${annualUnits.toLocaleString('en-IN')} Units (kWh)`, 20, 94);

    // Section 2: Financial Savings & Subsidy
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Investment & Govt Subsidy Breakdown', 15, 110);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`• Estimated System Turnkey Cost: Rs. ${systemCostGross.toLocaleString('en-IN')}`, 20, 120);
    doc.text(`• PM Surya Ghar Govt Subsidy Benefit: - Rs. ${subsidy.toLocaleString('en-IN')}`, 20, 128);
    doc.text(`• Estimated Net Out-of-Pocket Cost: Rs. ${netInvestment.toLocaleString('en-IN')}`, 20, 136);
    doc.text(`• Estimated Annual Bill Savings: Rs. ${annualSavings.toLocaleString('en-IN')} / year`, 20, 144);
    doc.text(`• Payback Period: ~${paybackYears} years`, 20, 152);
    doc.text(`• 25-Year Cumulative Savings: Rs. ${lifetimeSavings25Years.toLocaleString('en-IN')}`, 20, 160);

    // Section 3: Environmental Impact
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('3. Environmental Contribution', 15, 175);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`• CO2 Emission Reduction: ${co2ReductionTonsPerYear} Metric Tons per year`, 20, 185);
    doc.text(`• Equivalent to planting approx. ${Math.round(co2ReductionTonsPerYear * 45)} mature trees.`, 20, 193);

    // Footer contact info
    doc.setFillColor(245, 158, 11);
    doc.rect(0, 260, 210, 37, 'F');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Sarva Solar EPC Solutions Pvt. Ltd.', 15, 270);
    doc.setFont('helvetica', 'normal');
    doc.text('Guntur HQ Address: Brodipet 5/15, Guntur, AP - 522002', 15, 277);
    doc.text('Phone: +91 8985430100 / +91 9160513161 | Email: solarsarva@gmail.com', 15, 284);

    doc.save(`Sarva_Solar_Feasibility_Report_${estimatedKw}kW.pdf`);
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
          Calculate your exact rooftop plant capacity, government subsidy payout, monthly bill reduction, and zero-down financing options.
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
          <div className="lg:col-span-5 space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Property Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPropertyType('home')}
                  className={`py-3 px-4 rounded-xl font-bold text-xs border transition-all ${
                    propertyType === 'home'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-black'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Residential Home
                </button>
                <button
                  type="button"
                  onClick={() => setPropertyType('commercial')}
                  className={`py-3 px-4 rounded-xl font-bold text-xs border transition-all ${
                    propertyType === 'commercial'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-black'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Commercial / Factory
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Monthly Electricity Bill (₹)
                </label>
                <span className="text-base font-black text-blue-600 font-mono">
                  ₹{monthlyBill.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="50000"
                step="500"
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>₹1,000</span>
                <span>₹25,000</span>
                <span>₹50,000+</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  DISCOM Tariff Rate (₹/unit)
                </label>
                <span className="text-sm font-bold text-slate-700 font-mono">
                  ₹{tariffRate} / unit
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="12"
                step="0.5"
                value={tariffRate}
                onChange={(e) => setTariffRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/30 text-xs text-amber-800 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <span>
                {propertyType === 'home'
                  ? `Qualifies for PM Surya Ghar Scheme with direct central Govt subsidy payout of ₹${subsidy.toLocaleString('en-IN')}.`
                  : 'Commercial installations qualify for 40% Accelerated Depreciation tax deduction benefits.'}
              </span>
            </div>
          </div>

          {/* Results Output Cards */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500">System Capacity</span>
                <p className="text-2xl font-black text-blue-600 mt-1">{estimatedKw} kW</p>
                <span className="text-[10px] text-slate-500">Rooftop Plant</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-600">Annual Units</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">
                  {annualUnits.toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-slate-500">kWh Generated</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-bold text-amber-600">Roof Area Req.</span>
                <p className="text-2xl font-black text-slate-800 mt-1">{roofAreaSqFt} sq ft</p>
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
                <span className="font-mono font-bold">₹{systemCostGross.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-sm text-emerald-400 font-bold">
                <span>Central Govt Subsidy (PM Surya Ghar):</span>
                <span className="font-mono">- ₹{subsidy.toLocaleString('en-IN')}</span>
              </div>

              <div className="h-px bg-slate-800 my-2" />

              <div className="flex justify-between text-lg font-black text-white">
                <span>Estimated Net Investment:</span>
                <span className="font-mono text-amber-400">₹{netInvestment.toLocaleString('en-IN')}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400">Annual Bill Savings:</span>
                  <p className="text-base font-extrabold text-emerald-400 font-mono">
                    ₹{annualSavings.toLocaleString('en-IN')} / year
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Estimated Payback Period:</span>
                  <p className="text-base font-extrabold text-blue-400 font-mono">~{paybackYears} Years</p>
                </div>
              </div>
            </div>

            {/* PDF Report Download Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownloadPDF}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform transform active:scale-98"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Feasibility Report</span>
              </button>
            </div>
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
                <span>Zero Upfront Burden</span>
              </div>
              <p>
                In most cases, your monthly solar electricity bill savings (e.g. ₹4,000/mo) will be higher than your loan EMI (e.g. ₹2,200/mo) — making solar power positive cashflow from Day 1!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
