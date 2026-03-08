import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

function DivScreenId() {
  return (
    <div className="absolute bg-[#151515] bottom-[129.14px] content-stretch flex flex-col items-start px-[11px] py-[6px] right-[17px] rounded-[6px] z-[3]" data-name="div.screen-id">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[10px] tracking-[1px] whitespace-nowrap">
        <p className="leading-[16px]">12.2 · Checkout</p>
      </div>
    </div>
  );
}

function DivLogoMark() {
  return (
    <div className="bg-[#bfff00] content-stretch flex items-center justify-center pb-[4.91px] pt-[4.09px] relative rounded-[10px] shrink-0 size-[38px]" data-name="div.logo-mark">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[18px] text-black text-center whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[28.8px]">🧠</p>
      </div>
    </div>
  );
}

function DivLogoName() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="div.logo-name">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[0px] text-left text-white tracking-[-0.36px] uppercase whitespace-nowrap">
        <p className="text-[18px]">
          <span className="leading-[28.8px] text-white">FLUENT</span>
          <span className="leading-[28.8px] text-[#bfff00]">FUSION</span>
        </p>
      </div>
    </div>
  );
}

function ALogo() {
  return (
    <a className="cursor-pointer relative shrink-0" data-name="a.logo" href="file:///home/ngabotech/Documents/ALU/CapstoneProject/files/FluentFusion_Screens/screens/35-checkout.html">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center relative">
        <DivLogoMark />
        <DivLogoName />
      </div>
    </a>
  );
}

function Div() {
  return (
    <div className="relative shrink-0" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[22.4px]">Secure Checkout 🔒</p>
        </div>
      </div>
    </div>
  );
}

function NavNav() {
  return (
    <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-[2]" data-name="nav.nav">
      <div aria-hidden="true" className="absolute border-[#2a2a2a] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-px px-[40px] relative size-full">
          <ALogo />
          <Div />
        </div>
      </div>
    </div>
  );
}

function Div1() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="div">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[0px] text-center text-white tracking-[-0.64px] uppercase whitespace-nowrap">
        <p className="text-[32px]">
          <span className="leading-[51.2px] text-white">{`Complete Your `}</span>
          <span className="leading-[51.2px] text-[#bfff00]">Subscription</span>
        </p>
      </div>
    </div>
  );
}

function ButtonBtn() {
  return (
    <div className="absolute bg-[#bfff00] content-stretch flex items-center justify-center left-0 px-[36px] py-[15px] right-0 rounded-[10px] shadow-[0px_0px_24px_0px_rgba(191,255,0,0.3),0px_0px_48px_0px_rgba(191,255,0,0.14)] top-[697.76px]" data-name="button.btn">
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[16px] text-center tracking-[0.16px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[normal]">Subscribe Now — $9/month →</p>
      </div>
    </div>
  );
}

function Div2() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-0 right-0 top-[759.76px]" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">Cancel anytime. No hidden fees.</p>
      </div>
    </div>
  );
}

function Div3() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[24px] right-[24px] top-[24px]" data-name="div">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-white tracking-[0.7px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px]">Contact Information</p>
      </div>
    </div>
  );
}

function LabelLabel() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="label.label">
      <div className="flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[10px] tracking-[1px] uppercase w-full">
        <p className="leading-[16px] whitespace-pre-wrap">Full Name</p>
      </div>
    </div>
  );
}

function Div4() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-auto relative w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[15px] text-white w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Jean Pierre Habimana</p>
        </div>
      </div>
    </div>
  );
}

function InputInput() {
  return (
    <div className="bg-[#1f1f1f] relative rounded-[8px] shrink-0 w-full" data-name="input.input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center px-[17px] py-[13px] relative w-full">
          <Div4 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function DivFormGroup() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[7px] items-start left-[24px] right-[24px] top-[66.39px]" data-name="div.form-group">
      <LabelLabel />
      <InputInput />
    </div>
  );
}

function LabelLabel1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="label.label">
      <div className="flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[10px] tracking-[1px] uppercase w-full">
        <p className="leading-[16px] whitespace-pre-wrap">Email</p>
      </div>
    </div>
  );
}

function Div5() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-auto relative w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[15px] text-white w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[normal] whitespace-pre-wrap">jp@example.com</p>
        </div>
      </div>
    </div>
  );
}

function InputInput1() {
  return (
    <div className="bg-[#1f1f1f] relative rounded-[8px] shrink-0 w-full" data-name="input.input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center px-[17px] py-[13px] relative w-full">
          <Div5 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function DivFormGroup1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[7px] items-start left-[24px] right-[24px] top-[153.39px]" data-name="div.form-group">
      <LabelLabel1 />
      <InputInput1 />
    </div>
  );
}

function DivCard() {
  return (
    <div className="absolute bg-[#151515] border border-[#2a2a2a] border-solid h-[266.39px] left-0 overflow-clip right-0 rounded-[14px] top-0" data-name="div.card">
      <Div3 />
      <DivFormGroup />
      <DivFormGroup1 />
    </div>
  );
}

function Div6() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[24px] right-[24px] top-[24px]" data-name="div">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-white tracking-[0.7px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px]">Payment Method</p>
      </div>
    </div>
  );
}

function Div7() {
  return (
    <div className="bg-[rgba(191,255,0,0.1)] content-stretch flex flex-col items-center pb-[11.8px] pt-[10px] px-[11px] relative rounded-[8px] self-stretch shrink-0 w-[151.33px]" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#bfff00] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[13px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[20.8px]">💳 Card</p>
      </div>
    </div>
  );
}

function Div8() {
  return (
    <div className="bg-[#1f1f1f] content-stretch flex flex-col items-center pb-[11.8px] pt-[10px] px-[11px] relative rounded-[8px] self-stretch shrink-0 w-[151.34px]" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">📱 Mobile Money</p>
      </div>
    </div>
  );
}

function Div9() {
  return (
    <div className="bg-[#1f1f1f] content-stretch flex flex-col items-center pb-[11.8px] pt-[10px] px-[11px] relative rounded-[8px] self-stretch shrink-0 w-[151.33px]" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">🍎 Apple Pay</p>
      </div>
    </div>
  );
}

function DivFlex() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-start justify-center left-[24px] right-[24px] top-[66.39px]" data-name="div.flex">
      <Div7 />
      <Div8 />
      <Div9 />
    </div>
  );
}

function LabelLabel2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="label.label">
      <div className="flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[10px] tracking-[1px] uppercase w-full">
        <p className="leading-[16px] whitespace-pre-wrap">Card Number</p>
      </div>
    </div>
  );
}

function DivPlaceholder() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="div#placeholder">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[15px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[normal] whitespace-pre-wrap">1234 5678 9012 3456</p>
        </div>
      </div>
    </div>
  );
}

function InputInput2() {
  return (
    <div className="bg-[#1f1f1f] relative rounded-[8px] shrink-0 w-full" data-name="input.input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pl-[45px] pr-[17px] py-[13px] relative w-full">
          <DivPlaceholder />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function SpanInputIcon() {
  return (
    <div className="absolute bottom-[22.2%] content-stretch flex flex-col items-start left-[14px] top-[22.17%]" data-name="span.input-icon">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#888] text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[25.6px]">💳</p>
      </div>
    </div>
  );
}

function DivInputIconWrap() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="div.input-icon-wrap">
      <InputInput2 />
      <SpanInputIcon />
    </div>
  );
}

function DivFormGroup2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[7px] items-start left-[24px] right-[24px] top-[125.19px]" data-name="div.form-group">
      <LabelLabel2 />
      <DivInputIconWrap />
    </div>
  );
}

function LabelLabel3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="label.label">
      <div className="flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[10px] tracking-[1px] uppercase w-full">
        <p className="leading-[16px] whitespace-pre-wrap">Expiry Date</p>
      </div>
    </div>
  );
}

function DivPlaceholder1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="div#placeholder">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[15px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[normal] whitespace-pre-wrap">MM / YY</p>
        </div>
      </div>
    </div>
  );
}

function InputInput3() {
  return (
    <div className="bg-[#1f1f1f] relative rounded-[8px] shrink-0 w-full" data-name="input.input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center px-[17px] py-[13px] relative w-full">
          <DivPlaceholder1 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function DivFormGroup3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[7px] items-start min-h-px min-w-px relative w-full" data-name="div.form-group">
      <LabelLabel3 />
      <InputInput3 />
    </div>
  );
}

function DivFormGroupMargin() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px pb-[18px] relative self-stretch" data-name="div.form-group:margin">
      <DivFormGroup3 />
    </div>
  );
}

function LabelLabel4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="label.label">
      <div className="flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[10px] tracking-[1px] uppercase w-full">
        <p className="leading-[16px] whitespace-pre-wrap">CVV</p>
      </div>
    </div>
  );
}

function DivPlaceholder2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="div#placeholder">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[15px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[normal] whitespace-pre-wrap">123</p>
        </div>
      </div>
    </div>
  );
}

function InputInput4() {
  return (
    <div className="bg-[#1f1f1f] relative rounded-[8px] shrink-0 w-full" data-name="input.input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center px-[17px] py-[13px] relative w-full">
          <DivPlaceholder2 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function DivFormGroup4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[7px] items-start min-h-px min-w-px relative w-full" data-name="div.form-group">
      <LabelLabel4 />
      <InputInput4 />
    </div>
  );
}

function DivFormGroupMargin1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px pb-[18px] relative self-stretch" data-name="div.form-group:margin">
      <DivFormGroup4 />
    </div>
  );
}

function DivCardInputRow() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-start justify-center left-[24px] right-[24px] top-[212.19px]" data-name="div.card-input-row">
      <DivFormGroupMargin />
      <DivFormGroupMargin1 />
    </div>
  );
}

function LabelLabel5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="label.label">
      <div className="flex flex-col font-['JetBrains_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#888] text-[10px] tracking-[1px] uppercase w-full">
        <p className="leading-[16px] whitespace-pre-wrap">Cardholder Name</p>
      </div>
    </div>
  );
}

function DivPlaceholder3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="div#placeholder">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#555] text-[15px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Name on card</p>
        </div>
      </div>
    </div>
  );
}

function InputInput5() {
  return (
    <div className="bg-[#1f1f1f] relative rounded-[8px] shrink-0 w-full" data-name="input.input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center px-[17px] py-[13px] relative w-full">
          <DivPlaceholder3 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function DivFormGroup5() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[7px] items-start left-[24px] right-[24px] top-[299.19px]" data-name="div.form-group">
      <LabelLabel5 />
      <InputInput5 />
    </div>
  );
}

function DivSecureBadge() {
  return (
    <div className="absolute content-stretch flex items-center left-[24px] right-[24px] top-[385.19px]" data-name="div.secure-badge">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[19.2px]">🔒 256-bit SSL encryption · Your data is safe</p>
      </div>
    </div>
  );
}

function DivCard1() {
  return (
    <div className="absolute bg-[#151515] border border-[#2a2a2a] border-solid h-[431.38px] left-0 overflow-clip right-0 rounded-[14px] top-[266.39px]" data-name="div.card">
      <Div6 />
      <DivFlex />
      <DivFormGroup2 />
      <DivCardInputRow />
      <DivFormGroup5 />
      <DivSecureBadge />
    </div>
  );
}

function LeftPaymentForm() {
  return (
    <div className="h-[779.95px] relative shrink-0 w-[520px]" data-name="Left: Payment Form">
      <ButtonBtn />
      <Div2 />
      <DivCard />
      <DivCard1 />
    </div>
  );
}

function Div10() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[29px] right-[29px] top-[29px]" data-name="div">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-white tracking-[0.7px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[22.4px]">Order Summary</p>
      </div>
    </div>
  );
}

function Div12() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[16px] right-[16px] top-[16px]" data-name="div">
      <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[10px] tracking-[1px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">⭐ Pro Plan · Annual</p>
      </div>
    </div>
  );
}

function Div13() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[16px] right-[16px] top-[36px]" data-name="div">
      <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[16px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[25.6px]">Learner Subscription</p>
      </div>
    </div>
  );
}

function Div14() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[16px] pb-[0.8px] right-[16px] top-[64.59px]" data-name="div">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[20.8px]">Billed annually · $108/year</p>
      </div>
    </div>
  );
}

function Div11() {
  return (
    <div className="absolute bg-[rgba(191,255,0,0.1)] border border-[rgba(191,255,0,0.2)] border-solid h-[104.39px] left-[29px] right-[29px] rounded-[14px] top-[71.39px]" data-name="div">
      <Div12 />
      <Div13 />
      <Div14 />
    </div>
  );
}

function Span() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[22.4px]">Subtotal</p>
      </div>
    </div>
  );
}

function Span1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[14px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[22.4px]">$15.00/mo</p>
      </div>
    </div>
  );
}

function DivFlex1() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="div.flex">
      <Span />
      <Span1 />
    </div>
  );
}

function Span2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#00ff7f] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[22.4px]">Annual discount (40%)</p>
      </div>
    </div>
  );
}

function Span3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#00ff7f] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[22.4px]">-$6.00</p>
      </div>
    </div>
  );
}

function DivFlex2() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="div.flex">
      <Span2 />
      <Span3 />
    </div>
  );
}

function Span4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[22.4px]">VAT (0%)</p>
      </div>
    </div>
  );
}

function Span5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        <p className="leading-[22.4px]">$0.00</p>
      </div>
    </div>
  );
}

function DivFlex3() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="div.flex">
      <Span4 />
      <Span5 />
    </div>
  );
}

function Div15() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[10px] items-start left-[29px] right-[29px] top-[191.78px]" data-name="div">
      <DivFlex1 />
      <DivFlex2 />
      <DivFlex3 />
    </div>
  );
}

function Span6() {
  return (
    <div className="relative shrink-0" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[15px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[24px]">Total today</p>
        </div>
      </div>
    </div>
  );
}

function Span7() {
  return (
    <div className="relative shrink-0" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[24px] whitespace-nowrap">
          <p className="leading-[38.4px]">$9.00</p>
        </div>
      </div>
    </div>
  );
}

function DivFlex4() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[29px] pt-[12px] right-[29px] top-[294.95px]" data-name="div.flex">
      <div aria-hidden="true" className="absolute border-[#2a2a2a] border-solid border-t inset-0 pointer-events-none" />
      <Span6 />
      <Span7 />
    </div>
  );
}

function Div17() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['DM_Sans:SemiBold','Noto_Sans_Symbols2:Regular',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#00ff7f] text-[12px] w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
          <p className="leading-[19.2px] whitespace-pre-wrap">✓ 7-day free trial included</p>
        </div>
      </div>
    </div>
  );
}

function Div18() {
  return (
    <div className="relative shrink-0 w-full" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
          <p className="leading-[19.2px] whitespace-pre-wrap">{`You won't be charged until your trial ends.`}</p>
        </div>
      </div>
    </div>
  );
}

function Div16() {
  return (
    <div className="absolute bg-[rgba(0,255,127,0.06)] content-stretch flex flex-col gap-px items-start left-[29px] pb-[13px] pt-[12px] px-[13px] right-[29px] rounded-[8px] top-[362.34px]" data-name="div">
      <div aria-hidden="true" className="absolute border border-[rgba(0,255,127,0.15)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Div17 />
      <Div18 />
    </div>
  );
}

function RightOrderSummary() {
  return (
    <div className="bg-[#151515] h-[457.72px] rounded-[20px] shrink-0 sticky top-0 w-[400px]" data-name="Right: Order Summary">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <Div10 />
      <Div11 />
      <Div15 />
      <DivFlex4 />
      <Div16 />
    </div>
  );
}

function DivCheckoutGrid() {
  return (
    <div className="content-stretch flex gap-[40px] items-start justify-center max-w-[960px] relative shrink-0 w-[960px]" data-name="div.checkout-grid">
      <LeftPaymentForm />
      <RightOrderSummary />
    </div>
  );
}

function Main() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="main">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[36px] items-center p-[40px] relative w-full">
          <Div1 />
          <DivCheckoutGrid />
        </div>
      </div>
    </div>
  );
}

export default function Component35Checkout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ff_access_token');
    const userData = localStorage.getItem('ff_user');
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    try {
      setUser(JSON.parse(userData));
    } catch (e) {
      navigate('/login');
      return;
    }
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="bg-[#0a0a0a] content-stretch flex flex-col h-screen isolate items-start justify-center relative size-full">
        <div className="flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#bfff00] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] content-stretch flex flex-col isolate items-start relative size-full" data-name="35-checkout">
      <DivScreenId />
      <NavNav />
      <Main />
    </div>
  );
}