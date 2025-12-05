import React from "react";

type IconProps = { size?: number; weight?: "regular" | "fill"; className?: string };

export function HouseIcon({ size = 24 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256">
      <path d="M218.83,103.06l-80-72a16,16,0,0,0-21.66,0l-80,72A8,8,0,0,0,40,112H56v88a16,16,0,0,0,16,16H112a8,8,0,0,0,8-8V168a8,8,0,0,1,8-8h16a8,8,0,0,1,8,8v40a8,8,0,0,0,8,8h40a16,16,0,0,0,16-16V112h16a8,8,0,0,0,5.83-13Z" />
    </svg>
  );
}

export function UserIcon({ size = 24 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256">
      <path d="M128,24a56,56,0,1,0,56,56A56,56,0,0,0,128,24Zm0,96a40,40,0,1,1,40-40A40,40,0,0,1,128,120Zm0,24c-44.18,0-80,28.65-80,64a8,8,0,0,0,8,8H200a8,8,0,0,0,8-8C208,172.65,172.18,144,128,144Z" />
    </svg>
  );
}

export function UsersThreeIcon({ size = 24 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256">
      <path d="M168,120a40,40,0,1,0-40-40A40,40,0,0,0,168,120Zm32,8H160a56,56,0,0,0-56,56v16a8,8,0,0,0,8,8h112a8,8,0,0,0,8-8V184A56,56,0,0,0,200,128ZM88,120A32,32,0,1,0,56,88,32,32,0,0,0,88,120Zm24,16H80a48,48,0,0,0-48,48v16a8,8,0,0,0,8,8H96V184A63.86,63.86,0,0,1,112,136Z" />
    </svg>
  );
}

export function ChatIcon({ size = 24 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256">
      <path d="M216,40H40A16,16,0,0,0,24,56V224a8,8,0,0,0,12.44,6.66L88,192H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Z" />
    </svg>
  );
}

export function BellIcon({ size = 24 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256">
      <path d="M56,104a72,72,0,1,1,144,0v32l16,24v8H40v-8l16-24Z M128,224a24,24,0,0,0,24-24H104A24,24,0,0,0,128,224Z" />
    </svg>
  );
}

export function EyeIcon({ size = 24 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256">
      <path d="M128,56C72,56,28,96,16,128c12,32,56,72,112,72s100-40,112-72C228,96,184,56,128,56Zm0,112a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z" />
    </svg>
  );
}

export function MagnifyingGlassIcon({ size = 24 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256">
      <path d="M112,24A88,88,0,1,0,168.57,183.4l39,39a8,8,0,0,0,11.31-11.31l-39-39A88,88,0,0,0,112,24Zm0,160a72,72,0,1,1,72-72A72,72,0,0,1,112,184Z" />
    </svg>
  );
}

export function GearIcon({ size = 24 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256">
      <path d="M232,136V120l-22.2-5.55a79.27,79.27,0,0,0-6.5-15.7l12.87-18.69-11.31-11.31L186.17,81.2a79.27,79.27,0,0,0-15.7-6.5L165,52H149l-5.55,22.2a79.27,79.27,0,0,0-15.7,6.5L109.06,67.83,97.75,79.14l12.87,18.69a79.27,79.27,0,0,0-6.5,15.7L82,120v16l22.2,5.55a79.27,79.27,0,0,0,6.5,15.7L97.75,176.86l11.31,11.31,18.69-12.87a79.27,79.27,0,0,0,15.7,6.5L149,204h16l5.55-22.2a79.27,79.27,0,0,0,15.7-6.5l18.69,12.87,11.31-11.31-12.87-18.69a79.27,79.27,0,0,0,6.5-15.7Z M128,160a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z" />
    </svg>
  );
}

export function TrophyIcon({ size = 24 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256">
      <path d="M216,48H184V32a8,8,0,0,0-8-8H80A8,8,0,0,0,72,32V48H40A8,8,0,0,0,32,56v8a56,56,0,0,0,56,56h1.16A64,64,0,0,0,120,172.91V192H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H136V172.91A64,64,0,0,0,166.84,120H168a56,56,0,0,0,56-56V56A8,8,0,0,0,216,48ZM88,104A40,40,0,0,1,48,64V56H88Zm120-40a40,40,0,0,1-40,40V56h40Z" />
    </svg>
  );
}

export function HandshakeIcon({ size = 24 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256">
      <path d="M232,88H208V64a16,16,0,0,0-16-16H160a16,16,0,0,0-11.31,4.69L128,73.37,107.31,52.69A16,16,0,0,0,96,48H64A16,16,0,0,0,48,64V88H24A16,16,0,0,0,8,104v48a16,16,0,0,0,16,16H80l32,32a24,24,0,0,0,34,0l18-18,6,6a24,24,0,0,0,34,0l34-34a16,16,0,0,0,4.69-11.31V104A16,16,0,0,0,232,88Z" />
    </svg>
  );
}


export function CreditCardIcon({ size = 24 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256">
      <rect x="24" y="56" width="208" height="144" rx="16"/>
      <rect x="24" y="88" width="208" height="16" fill="#111a22" />
    </svg>
  );
}

export function PaperclipIcon({ size = 24, className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256" className={className}>
      <path d="M200,88l-88,88a40,40,0,0,1-56.57-56.57l96-96A32,32,0,0,1,200,80L120,160a24,24,0,1,1-33.94-33.94L168,44" stroke="currentColor" strokeWidth="16" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ShieldCheckIcon({ size = 24 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256">
      <path d="M128,24,40,56v64c0,61.86,39.43,117.61,88,128,48.57-10.39,88-66.14,88-128V56Z"/>
      <path d="M96,128l24,24,40-40" stroke="#111a22" strokeWidth="16" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ChartBarIcon({ size = 24 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256">
      <rect x="32" y="128" width="32" height="96"/>
      <rect x="96" y="96" width="32" height="128"/>
      <rect x="160" y="64" width="32" height="160"/>
    </svg>
  );
}

export function ListChecksIcon({ size = 24 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256">
      <path d="M40,64l16,16,24-24" stroke="currentColor" strokeWidth="16" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="112" y="56" width="104" height="16"/>
      <path d="M40,128l16,16,24-24" stroke="currentColor" strokeWidth="16" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="112" y="120" width="104" height="16"/>
      <path d="M40,192l16,16,24-24" stroke="currentColor" strokeWidth="16" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="112" y="184" width="104" height="16"/>
    </svg>
  );
}

export function ShareIcon({ size = 24 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256">
      <path d="M200,176a24,24,0,0,0-18.18,8.34l-90-45a24,24,0,0,0,0-22.68l90-45A24,24,0,1,0,176,56a24.15,24.15,0,0,0,2.18.1l-90,45a24,24,0,1,0,0,53.8l90,45A24,24,0,1,0,200,176Z" />
    </svg>
  );
}

export function QuestionMarkCircleIcon({ size = 24 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256">
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm12-88a16,16,0,1,1-16-16A16,16,0,0,1,140,128Zm12,48a8,8,0,1,1-8-8A8,8,0,0,1,152,176Z" />
    </svg>
  );
}

