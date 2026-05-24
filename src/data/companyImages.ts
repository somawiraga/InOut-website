import inoutLogo from '../assets/companies/inout-logo.png'
import cleaneraLogo from '../assets/companies/cleanera-logo.png'
import knightCleanLogo from '../assets/companies/knight-clean-logo.png'
import henkelLogo from '../assets/companies/henkel-logo.png'
import nordsonLogo from '../assets/companies/nordson-logo.png'
import midoriLogo from '../assets/companies/midori-logo.png'
import bullardLogo from '../assets/companies/bullard-logo.png'
import loctiteLogo from '../assets/companies/loctite-logo.png'

export interface CompanyEntry {
  name: string
  logo: string
}

export const companies: CompanyEntry[] = [
  { name: 'InOut', logo: inoutLogo },
  { name: 'CleanEra', logo: cleaneraLogo },
  { name: 'KnightClean', logo: knightCleanLogo },
  { name: 'Henkel', logo: henkelLogo },
  { name: 'Nordson', logo: nordsonLogo },
  { name: 'Midori', logo: midoriLogo },
  { name: 'Bullard', logo: bullardLogo },
  { name: 'Loctite / Henkel', logo: loctiteLogo },
]
