export interface IndustryCategory {
  id: string
  name: string
  slug: string
  description: string
  icon: string
}

export const industryCategories: IndustryCategory[] = [
  {
    id: 'aerospace',
    name: 'Aerospace',
    slug: 'aerospace',
    description:
      'Aerospace assembly and MRO operations demand high-performance adhesives, sealants, and contamination-control supplies.',
    icon: 'airplane',
  },
  {
    id: 'pharmaceutical',
    name: 'Pharmaceutical',
    slug: 'pharmaceutical',
    description:
      'GMP-compliant pharmaceutical facilities trust InOut for sterile cleanroom garments, powder-free gloves, face masks, and controlled-environment consumables.',
    icon: 'capsule',
  },
  {
    id: 'hospitality',
    name: 'Hospitality',
    slug: 'hospitality',
    description:
      'Hotels, restaurants, and food service operations rely on InOut for hygienic cleaning supplies, PPE, and contamination-control products.',
    icon: 'hotel',
  },
  {
    id: 'medical-device',
    name: 'Medical Device',
    slug: 'medical-device',
    description:
      'Medical device manufacturers require validated, traceable consumables. InOut provides ISO-certified cleanroom wipes, gloves, and packaging materials.',
    icon: 'heart-pulse',
  },
  {
    id: 'semiconductor',
    name: 'Semiconductor & Microelectronics',
    slug: 'semiconductor',
    description:
      'Semiconductor fabs demand ultra-clean environments and zero-defect consumables. InOut supplies ISO Class 4–6 cleanroom consumables engineered for wafer fabrication.',
    icon: 'microchip',
  },
]
