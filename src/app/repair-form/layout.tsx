import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Device Repair Form - SJD Tech",
  description: "Professional device repair form for SJD Tech customers and staff",
  robots: {
    index: false,
    follow: false,
  },
}

export default function RepairFormLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="repair-form-admin">
      {children}
    </div>
  )
}
