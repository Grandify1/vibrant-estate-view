import { Json } from '@/integrations/supabase/types';

export interface PropertyHighlight {
  id: string;
  name: string;
}

export interface PropertyImage {
  id: string;
  url: string;
  isFeatured: boolean;
}

export interface FloorPlan {
  id: string;
  url: string;
  name: string;
}

export interface EnergyDetails {
  certificateAvailable: boolean;
  certificateType?: string;
  energyConsumption?: string;
  energyEfficiencyClass?: string;
  includesWarmWater: boolean;
  primaryEnergyCarrier?: string;
  finalEnergyDemand?: string;
  constructionYear?: string;
  validUntil?: string;
  createdAt?: string;
}

export interface PropertyDetails {
  price: string;
  livingArea: string;
  plotArea: string;
  rooms: string;
  bathrooms: string;
  bedrooms: string;
  propertyType: string;
  availableFrom: string;
  maintenanceFee: string;
  constructionYear: string;
  condition: string;
  heatingType: string;
  energySource: string;
  floor: string;
  totalFloors: string;
  parkingSpaces: string;
  lastRenovation?: string;
  availability?: string;
}

export interface Property {
  id: string;
  title: string;
  address: string;
  status: 'active' | 'sold' | 'archived';
  highlights: PropertyHighlight[];
  images: PropertyImage[];
  floorPlans: FloorPlan[];
  details: PropertyDetails;
  energy: EnergyDetails;
  description: string;
  amenities: string;
  location: string;
  agent_id?: string | null;
  company_id?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const propertyTypes = [
  'Einfamilienhaus',
  'Mehrfamilienhaus',
  'Reihenhaus',
  'Doppelhaushälfte',
  'Wohnung',
  'Penthouse',
  'Villa',
  'Grundstück',
  'Gewerbeobjekt',
  'Sonstiges'
];

export const propertyConditions = [
  'Neuwertig',
  'Gepflegt',
  'Renovierungsbedürftig',
  'Saniert',
  'Erstbezug',
  'Projektiert'
];

export const heatingTypes = [
  'Zentralheizung',
  'Fußbodenheizung',
  'Gasheizung',
  'Ölheizung',
  'Fernwärme',
  'Wärmepumpe',
  'Elektroheizung',
  'Pelletheizung',
  'Kamin',
  'Sonstige'
];

export const energySources = [
  'Gas',
  'Öl',
  'Strom',
  'Fernwärme',
  'Erdwärme',
  'Solar',
  'Holz',
  'Pellets',
  'Kohle',
  'Sonstige'
];

export const energyEfficiencyClasses = [
  'A+',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H'
];

export const certificateTypes = [
  'Verbrauchsausweis',
  'Bedarfsausweis'
];

export const propertyStatuses = [
  { value: 'active', label: 'Aktiv', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'sold', label: 'Verkauft', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'archived', label: 'Archiviert', color: 'bg-gray-100 text-gray-800 border-gray-200' }
];

export const initialProperty: Property = {
  id: '',
  title: '',
  address: '',
  status: 'active',
  highlights: [],
  images: [],
  floorPlans: [],
  details: {
    price: '',
    livingArea: '',
    plotArea: '',
    rooms: '',
    bathrooms: '',
    bedrooms: '',
    propertyType: '',
    availableFrom: '',
    maintenanceFee: '',
    constructionYear: '',
    condition: '',
    heatingType: '',
    energySource: '',
    floor: '',
    totalFloors: '',
    parkingSpaces: ''
  },
  energy: {
    certificateAvailable: false,
    certificateType: '',
    energyConsumption: '',
    energyEfficiencyClass: '',
    constructionYear: '',
    validUntil: '',
    createdAt: '',
    includesWarmWater: false,
    primaryEnergyCarrier: '',
    finalEnergyDemand: ''
  },
  description: '',
  amenities: '',
  location: '',
  agent_id: null,
  company_id: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
